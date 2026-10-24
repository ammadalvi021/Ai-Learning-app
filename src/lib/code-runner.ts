import type { CodingChallenge } from "./challenges";

export type ChallengeResult = {
  label: string;
  passed: boolean;
  expected: string;
  actual: string;
};

export type CodeRunResult = {
  results: ChallengeResult[];
  error: string | null;
};

// Learner code runs in a worker inside an opaque-origin sandbox, never in the
// application's window. The sandbox blocks network access and the host enforces
// an independent deadline even if a program never returns.
const workerProgram = `
const send = self.postMessage.bind(self);
const stringify = (value) => {
  if (value === undefined) return 'undefined';
  try { return JSON.stringify(value) ?? String(value); }
  catch { return String(value); }
};
self.onmessage = async (event) => {
  const { token, code, functionName, tests } = event.data;
  try {
    const fn = new Function('"use strict";\\n' + code + '\\n;return typeof ' + functionName + ' === "function" ? ' + functionName + ' : null;')();
    if (!fn) throw new Error('Define a function named ' + functionName + '.');
    const results = [];
    for (const test of tests) {
      const actual = await fn(...test.args);
      const actualText = stringify(actual);
      const expectedText = stringify(test.expected);
      results.push({
        label: test.label,
        passed: actualText === expectedText,
        expected: expectedText.slice(0, 500),
        actual: actualText.slice(0, 500),
      });
    }
    send({ token, results, error: null });
  } catch (error) {
    send({ token, results: [], error: String(error && error.message || error).slice(0, 500) });
  }
};
`;

function sandboxDocument(token: string) {
  // Only a generated token and our fixed runner program are embedded in HTML.
  // The user's source is delivered after load via postMessage.
  return `<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; worker-src blob:; connect-src 'none'; img-src 'none'; style-src 'none'; base-uri 'none'; form-action 'none'"></head><body><script>
(() => {
  const token = ${JSON.stringify(token)};
  const source = ${JSON.stringify(workerProgram)};
  let worker;
  const send = (payload) => parent.postMessage({ ...payload, token }, '*');
  addEventListener('message', (event) => {
    if (event.source !== parent || event.data?.token !== token || event.data?.type !== 'run') return;
    try {
      const blob = new Blob([source], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      worker = new Worker(url);
      URL.revokeObjectURL(url);
      const timer = setTimeout(() => {
        worker.terminate();
        send({ type: 'result', results: [], error: 'Time limit exceeded. Check your loops and make sure your function returns.' });
      }, 1800);
      worker.onmessage = (message) => {
        if (message.data?.token !== token) return;
        clearTimeout(timer);
        worker.terminate();
        send({ type: 'result', results: message.data.results, error: message.data.error });
      };
      worker.onerror = () => {
        clearTimeout(timer);
        worker.terminate();
        send({ type: 'result', results: [], error: 'The JavaScript runtime could not execute this code.' });
      };
      worker.postMessage({ token, code: event.data.code, functionName: event.data.functionName, tests: event.data.tests });
    } catch {
      send({ type: 'result', results: [], error: 'This browser could not start the isolated JavaScript runtime.' });
    }
  });
  send({ type: 'ready' });
})();
<\/script></body></html>`;
}

function isRunResult(
  value: unknown,
  expectedCount: number,
): value is CodeRunResult {
  if (typeof value !== "object" || value === null) return false;
  const result = value as Record<string, unknown>;
  if (!Array.isArray(result.results)) return false;
  if (result.error !== null && typeof result.error !== "string") return false;
  if (result.error === null && result.results.length !== expectedCount)
    return false;
  return result.results.every(
    (item: unknown) =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as ChallengeResult).label === "string" &&
      typeof (item as ChallengeResult).passed === "boolean" &&
      typeof (item as ChallengeResult).expected === "string" &&
      typeof (item as ChallengeResult).actual === "string",
  );
}

export function runChallenge(
  code: string,
  challenge: CodingChallenge,
  signal?: AbortSignal,
): Promise<CodeRunResult> {
  return new Promise((resolve) => {
    if (signal?.aborted) {
      resolve({ results: [], error: "Execution canceled." });
      return;
    }

    const token = Array.from(crypto.getRandomValues(new Uint32Array(4))).join(
      "-",
    );
    const frame = document.createElement("iframe");
    frame.setAttribute("sandbox", "allow-scripts");
    frame.setAttribute("aria-hidden", "true");
    frame.tabIndex = -1;
    frame.hidden = true;
    frame.title = "Isolated JavaScript challenge runtime";
    let done = false;

    const finish = (result: CodeRunResult) => {
      if (done) return;
      done = true;
      clearTimeout(deadline);
      window.removeEventListener("message", onMessage);
      signal?.removeEventListener("abort", onAbort);
      frame.remove();
      resolve(result);
    };
    const onAbort = () => finish({ results: [], error: "Execution canceled." });
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frame.contentWindow || event.data?.token !== token)
        return;
      if (event.data.type === "ready") {
        frame.contentWindow?.postMessage(
          {
            type: "run",
            token,
            code,
            functionName: challenge.functionName,
            tests: challenge.tests,
          },
          "*",
        );
      } else if (event.data.type === "result") {
        if (isRunResult(event.data, challenge.tests.length)) {
          finish({ results: event.data.results, error: event.data.error });
        } else {
          finish({
            results: [],
            error:
              "The JavaScript runtime returned an invalid result. Please try again.",
          });
        }
      }
    };
    const deadline = window.setTimeout(
      () =>
        finish({
          results: [],
          error:
            "Time limit exceeded. Check your loops and make sure your function returns.",
        }),
      5000,
    );
    window.addEventListener("message", onMessage);
    signal?.addEventListener("abort", onAbort, { once: true });
    frame.srcdoc = sandboxDocument(token);
    document.body.appendChild(frame);
  });
}
