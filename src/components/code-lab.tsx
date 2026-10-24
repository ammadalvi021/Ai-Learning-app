"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Lightbulb,
  LoaderCircle,
  Play,
  RotateCcw,
  Search,
  Terminal,
  XCircle,
} from "lucide-react";
import { challenges, type CodingChallenge } from "@/lib/challenges";
import CodeEditor from "./code-editor";
import { runChallenge, type CodeRunResult } from "@/lib/code-runner";

type LabProgress = {
  drafts: Record<string, string>;
  completed: string[];
  storageUnavailable: boolean;
};

const KEY = "bloom-code-lab-v1";
const EMPTY: LabProgress = {
  drafts: {},
  completed: [],
  storageUnavailable: false,
};
const challengeIds = new Set(challenges.map((challenge) => challenge.id));
let snapshot = EMPTY;
let initialized = false;
const listeners = new Set<() => void>();

function readSavedLab(): LabProgress {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return EMPTY;
    const saved = value as Record<string, unknown>;
    if (
      !saved.drafts ||
      typeof saved.drafts !== "object" ||
      Array.isArray(saved.drafts) ||
      !Array.isArray(saved.completed)
    )
      return EMPTY;
    const drafts = Object.fromEntries(
      Object.entries(saved.drafts).filter(
        ([id, code]) =>
          challengeIds.has(id) &&
          typeof code === "string" &&
          code.length <= 50_000,
      ),
    ) as Record<string, string>;
    const completed = [
      ...new Set(
        saved.completed.filter(
          (id): id is string => typeof id === "string" && challengeIds.has(id),
        ),
      ),
    ];
    return { drafts, completed, storageUnavailable: false };
  } catch (error) {
    // Invalid JSON is recoverable; actual storage access errors need a warning.
    return error instanceof SyntaxError
      ? EMPTY
      : { ...EMPTY, storageUnavailable: true };
  }
}

function getSnapshot() {
  if (!initialized && typeof window !== "undefined") {
    initialized = true;
    snapshot = readSavedLab();
  }
  return snapshot;
}

function notify() {
  listeners.forEach((listener) => listener());
}

function onStorage(event: StorageEvent) {
  if (event.key !== KEY && event.key !== null) return;
  snapshot = readSavedLab();
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function save(next: LabProgress) {
  snapshot = next;
  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ drafts: next.drafts, completed: next.completed }),
    );
    snapshot = { ...next, storageUnavailable: false };
  } catch {
    snapshot = { ...next, storageUnavailable: true };
  }
  notify();
}

export default function CodeLab() {
  const progress = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  const [activeId, setActiveId] = useState(challenges[0].id);
  const [hintCount, setHintCount] = useState(0);
  const [result, setResult] = useState<CodeRunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [resetConfirmation, setResetConfirmation] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const categories = [...new Set(challenges.map((item) => item.category))];
  const visibleChallenges = challenges.filter((item) => {
    const text =
      `${item.title} ${item.concept} ${item.description}`.toLowerCase();
    return (
      text.includes(query.trim().toLowerCase()) &&
      (category === "all" || item.category === category) &&
      (difficulty === "all" || item.difficulty === difficulty)
    );
  });
  const challenge =
    challenges.find((item) => item.id === activeId) ?? challenges[0];
  const code = progress.drafts[challenge.id] ?? challenge.starterCode;
  const passed = result?.results.filter((test) => test.passed).length ?? 0;
  const allPassed = Boolean(
    result &&
    !result.error &&
    result.results.length === challenge.tests.length &&
    passed === challenge.tests.length,
  );

  useEffect(() => () => controllerRef.current?.abort(), []);

  useEffect(() => {
    if (result) resultRef.current?.focus({ preventScroll: true });
  }, [result]);

  function chooseChallenge(next: CodingChallenge) {
    controllerRef.current?.abort();
    setActiveId(next.id);
    setHintCount(0);
    setResult(null);
    setRunning(false);
    setResetConfirmation(false);
  }

  function changeCode(next: string) {
    save({ ...progress, drafts: { ...progress.drafts, [challenge.id]: next } });
    setResult(null);
  }

  async function runTests() {
    if (running) return;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setRunning(true);
    setResult(null);
    let output: CodeRunResult;
    try {
      output = await runChallenge(code, challenge, controller.signal);
    } catch {
      output = {
        results: [],
        error:
          "The JavaScript runtime could not start. Please try again in an up-to-date browser.",
      };
    }
    if (controller.signal.aborted) return;
    setResult(output);
    setRunning(false);
    if (
      !output.error &&
      output.results.length === challenge.tests.length &&
      output.results.every((test) => test.passed)
    ) {
      const current = getSnapshot();
      if (!current.completed.includes(challenge.id))
        save({ ...current, completed: [...current.completed, challenge.id] });
    }
  }

  function resetCode() {
    changeCode(challenge.starterCode);
    setResetConfirmation(false);
    requestAnimationFrame(() =>
      editorRef.current
        ?.querySelector<HTMLElement>('[role="textbox"]')
        ?.focus(),
    );
  }

  return (
    <section className="lab-page" aria-labelledby="lab-title">
      <div className="page-heading">
        <div>
          <span className="eyebrow">PRACTICE / BUILD / REPEAT</span>
          <h1 id="lab-title">Coding lab</h1>
          <p>
            Twenty challenges. A real editor. Build your skills one working
            solution at a time.
          </p>
        </div>
        <span className="lab-tag">
          <Code2 size={14} /> JAVASCRIPT RUNTIME
        </span>
      </div>
      {progress.storageUnavailable && (
        <p className="storage-warning" role="status">
          Browser storage is unavailable. Your code and completed challenges
          will last only while this page stays open.
        </p>
      )}
      <div className="lab-layout">
        <aside className="lab-sidebar">
          <div className="lab-panel-header">
            <span>EXERCISES</span>
            <span>
              {progress.completed.length} / {challenges.length} solved
            </span>
          </div>
          <div className="lab-filters">
            <label className="lab-search">
              <Search size={14} />
              <input
                aria-label="Search challenges"
                placeholder="Find a challenge…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <div className="lab-filter-row">
              <select
                aria-label="Challenge category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="all">All topics</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <select
                aria-label="Challenge difficulty"
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
              >
                <option value="all">All levels</option>
                <option value="Starter">Starter</option>
                <option value="Intermediate">Intermediate</option>
              </select>
            </div>
            <p className="lab-result-count">
              {visibleChallenges.length} of {challenges.length} challenges
            </p>
          </div>
          <nav aria-label="Coding challenges">
            {visibleChallenges.map((item) => (
              <button
                className={`lab-challenge-card ${activeId === item.id ? "active" : ""}`}
                key={item.id}
                aria-pressed={activeId === item.id}
                onClick={() => chooseChallenge(item)}
              >
                <span className="lab-challenge-number">
                  {progress.completed.includes(item.id) ? (
                    <Check size={16} />
                  ) : (
                    String(challenges.indexOf(item) + 1).padStart(2, "0")
                  )}
                </span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.concept}</small>
                </span>
                <ChevronRight size={15} />
              </button>
            ))}
            {!visibleChallenges.length && (
              <div className="lab-empty">
                <p>No challenges match your filters.</p>
                <button
                  className="text-button"
                  onClick={() => {
                    setQuery("");
                    setCategory("all");
                    setDifficulty("all");
                  }}
                >
                  Show all challenges
                </button>
              </div>
            )}
          </nav>
          <div className="lab-runtime-note">
            <Terminal size={18} />
            <h3>A space to experiment.</h3>
            <p>
              These exercises run JavaScript in your browser. Each run has a
              time limit, so an infinite loop won’t freeze the app.
            </p>
            <p>Your source stays on this device.</p>
          </div>
        </aside>
        <div className="lab-workspace" aria-busy={running}>
          <section
            className="lab-panel lab-brief"
            aria-labelledby="challenge-title"
          >
            <div className="lab-brief-heading">
              <span className="lab-tag">{challenge.difficulty}</span>
              {progress.completed.includes(challenge.id) && (
                <span className="lab-completed">
                  <CheckCircle2 size={14} /> Solved
                </span>
              )}
            </div>
            <h2 id="challenge-title">{challenge.title}</h2>
            <p>{challenge.description}</p>
            <div className="lab-example">
              <span>EXAMPLE</span>
              <code>
                {challenge.functionName}(
                {challenge.tests[0].args
                  .map((arg) => JSON.stringify(arg))
                  .join(", ")}
                )
              </code>
              <span className="lab-example-arrow">→</span>
              <code>{JSON.stringify(challenge.tests[0].expected)}</code>
            </div>
            <button
              className="text-button"
              onClick={() =>
                setHintCount(Math.min(hintCount + 1, challenge.hints.length))
              }
              disabled={hintCount === challenge.hints.length}
            >
              <Lightbulb size={15} />{" "}
              {hintCount === challenge.hints.length
                ? "All hints revealed"
                : hintCount === 0
                  ? "Need a hint?"
                  : "Show another hint"}
            </button>
            {challenge.hints.slice(0, hintCount).map((hint, index) => (
              <p key={hint} className="lab-hint">
                <span>0{index + 1}</span>
                {hint}
              </p>
            ))}
          </section>
          <section className="lab-panel" aria-label="JavaScript editor">
            <div className="lab-panel-header">
              <span className="lab-file">
                <Code2 size={14} /> solution.js
              </span>
              <span>JavaScript · ES2020+</span>
            </div>
            <div ref={editorRef}>
              <CodeEditor
                key={challenge.id}
                value={code}
                onChange={changeCode}
                readOnly={running}
                onRun={() => void runTests()}
              />
            </div>
            <div className="lab-editor-footer">
              <span id="editor-help">
                Highlighting · autocomplete · syntax diagnostics
              </span>
              <span>
                {progress.storageUnavailable
                  ? "Session only"
                  : "Draft saved on this device"}
              </span>
            </div>
            <div className="lab-actions">
              <button
                className="secondary-button"
                disabled={running}
                onClick={() => setResetConfirmation(true)}
              >
                <RotateCcw size={14} /> Reset code
              </button>
              <button
                className="primary-button"
                disabled={running}
                onClick={() => void runTests()}
              >
                {running ? (
                  <LoaderCircle size={15} className="lab-spinner" />
                ) : (
                  <Play size={15} />
                )}
                {running ? "Running…" : "Run tests"}
              </button>
            </div>
            {resetConfirmation && (
              <div
                className="lab-reset-confirm"
                role="group"
                aria-label="Confirm code reset"
              >
                <p>Replace your draft with the starter code?</p>
                <button
                  className="text-button"
                  onClick={() => setResetConfirmation(false)}
                >
                  Keep my code
                </button>
                <button className="secondary-button" onClick={resetCode}>
                  Restore starter code
                </button>
              </div>
            )}
          </section>
          <section
            className="lab-panel terminal-panel"
            aria-label="Test output"
          >
            <div className="lab-panel-header">
              <span className="lab-file">
                <Terminal size={14} /> TEST OUTPUT
              </span>
              <span>{challenge.tests.length} test cases</span>
            </div>
            <div className="terminal-output" tabIndex={-1} ref={resultRef}>
              {running ? (
                <div className="terminal-empty" role="status">
                  <LoaderCircle size={18} className="lab-spinner" />
                  <span>
                    Running your code against {challenge.tests.length} test
                    cases…
                  </span>
                </div>
              ) : result ? (
                <>
                  <div
                    className={`terminal-status ${allPassed ? "passed" : "failed"}`}
                    role="status"
                  >
                    {allPassed ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <XCircle size={18} />
                    )}
                    <strong>
                      {result.error
                        ? "Execution stopped"
                        : allPassed
                          ? `All ${challenge.tests.length} tests passed. Challenge solved!`
                          : `${passed} / ${challenge.tests.length} tests passed — keep iterating.`}
                    </strong>
                  </div>
                  {result.error && (
                    <pre className="terminal-error">{result.error}</pre>
                  )}
                  {result.results.map((test) => (
                    <div
                      className={`lab-test-row ${test.passed ? "passed" : "failed"}`}
                      key={test.label}
                    >
                      <div>
                        {test.passed ? (
                          <Check size={15} />
                        ) : (
                          <XCircle size={15} />
                        )}
                        <strong>{test.label}</strong>
                        <span>{test.passed ? "PASS" : "FAIL"}</span>
                      </div>
                      <p>
                        <span>Expected</span>
                        <code>{test.expected}</code>
                        <span>Received</span>
                        <code>{test.actual}</code>
                      </p>
                    </div>
                  ))}
                  {allPassed && (
                    <p className="lab-completion-note">
                      {progress.storageUnavailable
                        ? "Solved for this session. Browser storage is unavailable."
                        : "Challenge completion saved on this device."}
                    </p>
                  )}
                </>
              ) : (
                <div className="terminal-empty">
                  <Terminal size={23} />
                  <p>Your next breakthrough starts here.</p>
                  <span>
                    Run the tests to see which cases your solution passes.
                  </span>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
