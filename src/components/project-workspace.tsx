"use client";

import { useEffect, useRef, useState } from "react";
import {
  Braces,
  Check,
  CheckCircle2,
  Code2,
  ExternalLink,
  Eye,
  FileCode2,
  FolderCode,
  Lightbulb,
  LoaderCircle,
  Play,
  RotateCcw,
  Target,
  XCircle,
} from "lucide-react";
import CodeEditor from "./code-editor";
import { projects, type ProjectFiles } from "@/lib/projects";
import {
  resetProject,
  saveProjectCheckpoints,
  saveProjectFiles,
  useProjectProgress,
} from "@/lib/project-progress";

type CheckResult = { id: string; passed: boolean; detail: string };
type PreviewState = {
  html: string;
  token: string;
  projectId: string;
  files: ProjectFiles;
  checkAfterLoad: boolean;
};
const filenames = ["index.html", "styles.css", "script.js"] as const;
const fileLanguages = {
  "index.html": "html",
  "styles.css": "css",
  "script.js": "javascript",
} as const;

// This bridge runs only inside an opaque-origin sandbox. Learner source is
// delivered as data, then loaded through a local Blob script. It never runs in
// the application's window, and its network and storage access are blocked.
function previewBridge(
  token: string,
  projectId: string,
  css: string,
  source: string,
) {
  const send = (type: string, payload: Record<string, unknown>) =>
    parent.postMessage(Object.assign({ type, token }, payload), "*");
  let runtimeError = false;
  function fail(message: string) {
    runtimeError = true;
    send("preview-error", { error: message.slice(0, 500) });
  }
  window.addEventListener("error", (event) =>
    fail(event.message || "A script in this project could not run."),
  );
  window.addEventListener("unhandledrejection", (event) =>
    fail(
      String(
        event.reason?.message ?? event.reason ?? "Unhandled JavaScript error.",
      ),
    ),
  );
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
  const result = (id: string, passed: boolean, detail: string) => ({
    id,
    passed,
    detail,
  });
  function check() {
    const results: { id: string; passed: boolean; detail: string }[] = [];
    try {
      if (projectId === "developer-portfolio") {
        const name = document.querySelector("h1")?.textContent?.trim() ?? "";
        results.push(
          result(
            "portfolio-introduction",
            name.length >= 3 && !/todo|your name/i.test(name),
            "A real, non-placeholder name appears in the main heading.",
          ),
        );
        const cards = Array.from(document.querySelectorAll(".project-card"));
        results.push(
          result(
            "portfolio-projects",
            cards.length >= 3 &&
              cards.every((card) =>
                Boolean(card.querySelector("h2,h3")?.textContent?.trim()),
              ),
            "At least three project cards have meaningful headings.",
          ),
        );
        results.push(
          result(
            "portfolio-navigation",
            Boolean(
              document.querySelector('a[href="#projects"]') &&
              document.querySelector("#projects"),
            ),
            "The Projects navigation link points to an existing Projects section.",
          ),
        );
      } else if (projectId === "task-tracker") {
        const form = document.querySelector<HTMLFormElement>("#task-form");
        const input = document.querySelector<HTMLInputElement>("#task-input");
        const list = document.querySelector("#task-list");
        results.push(
          result(
            "tasks-form",
            Boolean(
              form &&
              input &&
              form.querySelector('button[type="submit"],button:not([type])') &&
              list,
            ),
            "A task form, text input, submit button, and list are present.",
          ),
        );
        const text = "Bloom checkpoint task";
        if (form && input) {
          input.value = text;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          form.requestSubmit();
        }
        const item = Array.from(list?.querySelectorAll("li") ?? []).find(
          (node) => node.textContent?.includes(text),
        );
        results.push(
          result(
            "tasks-add",
            Boolean(item),
            "Submitting the form adds the entered task to the list.",
          ),
        );
        let toggled = false;
        let deleted = false;
        if (item) {
          const checkbox = item.querySelector<HTMLInputElement>(
            'input[type="checkbox"]',
          );
          checkbox?.click();
          toggled = Boolean(
            checkbox?.checked && item.classList.contains("completed"),
          );
          const remove = Array.from(item.querySelectorAll("button")).find(
            (button) => /delete/i.test(button.textContent ?? ""),
          );
          remove?.click();
          deleted = !document.documentElement.contains(item);
        }
        results.push(
          result(
            "tasks-complete-delete",
            toggled && deleted,
            "A task can be marked completed and then removed with Delete.",
          ),
        );
      } else if (projectId === "weather-dashboard") {
        const select =
          document.querySelector<HTMLSelectElement>("#city-select");
        const temperature = () =>
          document
            .querySelector("#temperature")
            ?.textContent?.replace(/\s/g, "") ?? "";
        const summary = () =>
          document.querySelector("#weather-summary")?.textContent ?? "";
        if (select) {
          select.value = "Tokyo";
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }
        results.push(
          result(
            "weather-city",
            temperature() === "18°C" && /cloudy/i.test(summary()),
            "Selecting Tokyo displays 18°C and Cloudy from the sample dataset.",
          ),
        );
        const toggle =
          document.querySelector<HTMLButtonElement>("#unit-toggle");
        toggle?.click();
        const fahrenheit = temperature() === "64°F";
        toggle?.click();
        results.push(
          result(
            "weather-units",
            fahrenheit && temperature() === "18°C",
            "The unit control converts 18°C to 64°F and back.",
          ),
        );
        if (select) {
          select.value = "Reykjavik";
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }
        results.push(
          result(
            "weather-location",
            temperature() === "6°C" &&
              /windy/i.test(summary()) &&
              /Reykjavik/.test(
                document.querySelector("#location-name")?.textContent ?? "",
              ) &&
              /sample weather data/i.test(document.body.textContent ?? ""),
            "Reykjavik shows 6°C and Windy, and the page identifies its sample data.",
          ),
        );
        if (select) {
          select.value = "Lisbon";
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
      send("check-results", { results });
    } catch (error) {
      send("preview-error", {
        error: String(error instanceof Error ? error.message : error),
      });
    }
  }
  window.addEventListener("message", (event) => {
    if (
      event.source !== parent ||
      event.data?.token !== token ||
      event.data?.type !== "check"
    )
      return;
    check();
  });
  const script = document.createElement("script");
  const url = URL.createObjectURL(
    new Blob([source], { type: "text/javascript" }),
  );
  script.src = url;
  script.onload = () => {
    URL.revokeObjectURL(url);
    if (!runtimeError) send("preview-ready", {});
  };
  script.onerror = () => {
    URL.revokeObjectURL(url);
    fail(
      "The JavaScript file could not be loaded. Check the source and try again.",
    );
  };
  document.body.appendChild(script);
}

function makePreview(files: ProjectFiles, projectId: string, token: string) {
  // Template contents stay inert: parsing learner HTML here must not start
  // image or iframe requests outside the preview's content security policy.
  const parsed = document.createElement("template");
  parsed.innerHTML = files["index.html"];
  parsed.content
    .querySelectorAll("script,base,meta[http-equiv],link[rel=stylesheet]")
    .forEach((node) => node.remove());
  const serialize = (value: string) =>
    JSON.stringify(value).replace(/</g, "\\u003c");
  const bridge = `(${previewBridge.toString()})(${serialize(token)},${serialize(projectId)},${serialize(files["styles.css"])},${serialize(files["script.js"])});`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' blob:; style-src 'unsafe-inline'; img-src data: blob:; connect-src 'none'; base-uri 'none'; form-action 'none'"><title>Project preview</title></head><body>${parsed.innerHTML}<script>${bridge}<\/script></body></html>`;
}

export default function ProjectWorkspace({
  initialProjectId,
}: {
  initialProjectId?: string;
}) {
  const progress = useProjectProgress();
  const [activeId, setActiveId] = useState(
    projects.some((item) => item.id === initialProjectId)
      ? initialProjectId!
      : projects[0].id,
  );
  const [file, setFile] = useState<(typeof filenames)[number]>("index.html");
  const [hintId, setHintId] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<
    "reference" | "reset" | null
  >(null);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(false);
  const [results, setResults] = useState<CheckResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(false);
  const project = projects.find((item) => item.id === activeId) ?? projects[0];
  const files = progress.drafts[project.id] ?? project.starterFiles;
  const bestCompleted = progress.completed[project.id] ?? [];
  const dirty = Boolean(
    preview && JSON.stringify(preview.files) !== JSON.stringify(files),
  );

  useEffect(() => {
    if (!preview) return;
    const active = preview;
    let deadline = window.setTimeout(() => {
      if (!readyRef.current) {
        setError(
          "The preview did not start in time. Check your JavaScript, then run it again.",
        );
        setChecking(false);
      }
    }, 5000);
    function receive(event: MessageEvent) {
      if (
        event.source !== frameRef.current?.contentWindow ||
        event.data?.token !== active.token
      )
        return;
      if (event.data.type === "preview-error") {
        clearTimeout(deadline);
        setError(
          String(event.data.error ?? "The preview could not run.").slice(
            0,
            500,
          ),
        );
        setChecking(false);
      } else if (event.data.type === "preview-ready") {
        readyRef.current = true;
        setReady(true);
        clearTimeout(deadline);
        if (active.checkAfterLoad) {
          frameRef.current?.contentWindow?.postMessage(
            { type: "check", token: active.token },
            "*",
          );
          deadline = window.setTimeout(() => {
            setChecking(false);
            setError(
              "The checkpoint checks did not finish. Review the code and try again.",
            );
          }, 4000);
        }
      } else if (event.data.type === "check-results") {
        const value: unknown = event.data.results;
        const expected = projects.find(
          (item) => item.id === active.projectId,
        )!.checkpoints;
        if (
          !Array.isArray(value) ||
          value.length !== expected.length ||
          !value.every(
            (item) =>
              item &&
              typeof item.id === "string" &&
              typeof item.passed === "boolean" &&
              typeof item.detail === "string" &&
              expected.some((point) => point.id === item.id),
          ) ||
          new Set(value.map((item) => item.id)).size !== expected.length
        )
          return;
        clearTimeout(deadline);
        const actual = value as CheckResult[];
        setResults(actual);
        setChecking(false);
        setError(null);
        saveProjectCheckpoints(
          active.projectId,
          actual.filter((item) => item.passed).map((item) => item.id),
        );
        requestAnimationFrame(() =>
          resultRef.current?.focus({ preventScroll: true }),
        );
      }
    }
    window.addEventListener("message", receive);
    return () => {
      clearTimeout(deadline);
      window.removeEventListener("message", receive);
    };
  }, [preview]);

  function runPreview(checkAfterLoad = false, nextFiles = files) {
    const token = Array.from(crypto.getRandomValues(new Uint32Array(4))).join(
      "-",
    );
    readyRef.current = false;
    setReady(false);
    setChecking(checkAfterLoad);
    setResults(null);
    setError(null);
    setPreview({
      html: makePreview(nextFiles, project.id, token),
      token,
      projectId: project.id,
      files: { ...nextFiles },
      checkAfterLoad,
    });
  }
  function chooseProject(id: string) {
    setActiveId(id);
    setFile("index.html");
    setPreview(null);
    setReady(false);
    setChecking(false);
    setResults(null);
    setError(null);
    setHintId(null);
    setConfirmation(null);
    readyRef.current = false;
  }
  function replaceFiles() {
    const next =
      confirmation === "reference"
        ? project.referenceFiles
        : project.starterFiles;
    if (confirmation === "reset") resetProject(project.id);
    else saveProjectFiles(project.id, next);
    setConfirmation(null);
    runPreview(false, next);
  }

  return (
    <section className="projects-page" aria-labelledby="projects-title">
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            <FolderCode size={13} /> BUILD SOMETHING THAT WORKS
          </span>
          <h1 id="projects-title">Guided projects</h1>
          <p>
            Three real projects. Three files each. Build the feature, check it,
            and make it your own.
          </p>
        </div>
        <span className="page-badge">HTML / CSS / JAVASCRIPT</span>
      </div>
      {progress.storageUnavailable && (
        <p className="storage-warning" role="status">
          Browser storage is unavailable. Project drafts and checkpoints last
          only while this page stays open.
        </p>
      )}
      <div
        className="project-selector"
        role="group"
        aria-label="Choose a guided project"
      >
        {projects.map((item, index) => (
          <button
            key={item.id}
            className={`project-card ${activeId === item.id ? "selected" : ""}`}
            aria-pressed={activeId === item.id}
            onClick={() => chooseProject(item.id)}
          >
            <span className="project-card-number">0{index + 1}</span>
            <span>
              <strong>{item.title}</strong>
              <small>
                {item.level} · {item.duration}
              </small>
            </span>
            <span className="project-card-progress">
              {progress.completed[item.id]?.length ?? 0}/
              {item.checkpoints.length}
            </span>
          </button>
        ))}
      </div>
      <div className="project-layout">
        <aside className="project-sidebar">
          <div className="project-brief glass-panel">
            <span className="section-kicker">YOUR BUILD BRIEF</span>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <span className="project-language-tag">
              <Braces size={13} /> Browser-based project
            </span>
          </div>
          <section
            className="project-checkpoint-list glass-panel"
            aria-labelledby="checkpoint-heading"
          >
            <div className="project-panel-header">
              <h2 id="checkpoint-heading">
                <Target size={15} /> Checkpoints
              </h2>
              <span>
                {bestCompleted.length}/{project.checkpoints.length} best
              </span>
            </div>
            {project.checkpoints.map((point, index) => (
              <div className="project-checkpoint" key={point.id}>
                <div className="project-checkpoint-title">
                  <span
                    className={bestCompleted.includes(point.id) ? "done" : ""}
                  >
                    {bestCompleted.includes(point.id) ? (
                      <Check size={13} />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <h3>{point.title}</h3>
                </div>
                <p className="project-checkpoint-instruction">
                  {point.instruction}
                </p>
                <button
                  className="text-button"
                  onClick={() =>
                    setHintId(hintId === point.id ? null : point.id)
                  }
                  aria-expanded={hintId === point.id}
                >
                  <Lightbulb size={13} />
                  {hintId === point.id ? "Hide hint" : "Show hint"}
                  <span className="sr-only"> for {point.title}</span>
                </button>
                {hintId === point.id && (
                  <p className="project-hint">{point.hint}</p>
                )}
              </div>
            ))}
          </section>
          <div className="project-local-note">
            <Eye size={16} />
            <p>
              The preview is isolated from app storage and the network. Weather
              uses built-in sample data. Drafts stay in this browser.
            </p>
          </div>
        </aside>
        <div className="project-workbench">
          <section
            className="project-panel glass-panel"
            aria-label="Project files"
          >
            <div className="project-panel-header">
              <span className="project-filename">
                <Code2 size={15} /> Your project files
              </span>
              <span>
                {progress.storageUnavailable
                  ? "Session draft"
                  : "Saved on this device"}
              </span>
            </div>
            <div
              className="project-file-tabs"
              role="tablist"
              aria-label="Project files"
            >
              {filenames.map((name) => (
                <button
                  key={name}
                  id={`project-tab-${name}`}
                  role="tab"
                  aria-selected={file === name}
                  aria-controls="project-editor-panel"
                  tabIndex={file === name ? 0 : -1}
                  onKeyDown={(event) => {
                    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft")
                      return;
                    event.preventDefault();
                    const index = filenames.indexOf(file);
                    const next =
                      filenames[
                        (index + (event.key === "ArrowRight" ? 1 : 2)) % 3
                      ];
                    setFile(next);
                    document.getElementById(`project-tab-${next}`)?.focus();
                  }}
                  onClick={() => setFile(name)}
                >
                  <FileCode2 size={13} />
                  {name}
                </button>
              ))}
            </div>
            <div
              id="project-editor-panel"
              role="tabpanel"
              aria-labelledby={`project-tab-${file}`}
            >
              <CodeEditor
                key={`${project.id}-${file}`}
                value={files[file]}
                onChange={(value) => {
                  saveProjectFiles(project.id, { ...files, [file]: value });
                  setResults(null);
                }}
                language={fileLanguages[file]}
                label="Project code editor"
                readOnly={checking}
                onRun={() => runPreview(false)}
              />
            </div>
            <div className="project-actions">
              <button
                className="secondary-button"
                onClick={() => runPreview(false)}
              >
                <Play size={14} />
                Run preview
              </button>
              <button
                className="primary-button"
                disabled={checking}
                onClick={() => runPreview(true)}
              >
                {checking ? (
                  <LoaderCircle size={14} className="lab-spinner" />
                ) : (
                  <CheckCircle2 size={14} />
                )}{" "}
                {checking ? "Checking…" : "Check checkpoints"}
              </button>
            </div>
            <div className="project-toolbar">
              <button
                className="text-button"
                onClick={() => setConfirmation("reference")}
              >
                Load reference project <ExternalLink size={12} />
              </button>
              <button
                className="text-button"
                onClick={() => setConfirmation("reset")}
              >
                <RotateCcw size={12} />
                Reset project
              </button>
            </div>
            {confirmation && (
              <div
                className="project-confirm"
                role="group"
                aria-label={
                  confirmation === "reference"
                    ? "Confirm reference project"
                    : "Confirm project reset"
                }
              >
                <p>
                  {confirmation === "reference"
                    ? "Replace this project’s saved draft with a complete reference? Your current edits will be replaced."
                    : "Restore the starter files and clear this project’s checkpoints? Other projects and lessons stay as they are."}
                </p>
                <button
                  className="text-button"
                  onClick={() => setConfirmation(null)}
                >
                  Keep my draft
                </button>
                <button className="secondary-button" onClick={replaceFiles}>
                  {confirmation === "reference"
                    ? "Replace with reference"
                    : "Restore starter project"}
                </button>
              </div>
            )}
          </section>
          <section
            className="project-panel project-preview glass-panel"
            aria-label="Live project preview"
          >
            <div className="project-panel-header">
              <h2>
                <Eye size={15} /> Live preview
              </h2>
              <span>
                {dirty
                  ? "Draft changed · run again"
                  : ready
                    ? "Preview ready"
                    : preview
                      ? "Starting preview…"
                      : "Ready when you are"}
              </span>
            </div>
            <iframe
              ref={frameRef}
              className="project-preview-frame"
              title="Project preview"
              sandbox="allow-scripts allow-forms"
              srcDoc={
                preview?.html ??
                '<!doctype html><html><body style="margin:0;background:#11151c;color:#9da9ba;font:14px system-ui;display:grid;place-content:center;min-height:310px;text-align:center"><p>Your next build starts here.</p><p style="font-size:12px">Run the preview to see your files in action.</p></body></html>'
              }
            />
          </section>
          {(results || error) && (
            <section
              ref={resultRef}
              className="project-results glass-panel"
              tabIndex={-1}
              aria-label="Checkpoint results"
            >
              <div className="project-panel-header">
                <h2>
                  <Target size={15} /> Checkpoint results
                </h2>
              </div>
              {error ? (
                <div className="project-error" role="status">
                  <XCircle size={17} />
                  <p>{error}</p>
                </div>
              ) : (
                <>
                  <p className="project-result-status" role="status">
                    {results?.every((item) => item.passed)
                      ? "All checkpoints passed. Project complete!"
                      : `${results?.filter((item) => item.passed).length} / ${project.checkpoints.length} checkpoints passed. Keep building.`}
                  </p>
                  {results?.map((item) => (
                    <div
                      key={item.id}
                      className={`project-result-row ${item.passed ? "passed" : "failed"}`}
                    >
                      <div>
                        {item.passed ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <XCircle size={16} />
                        )}
                        <strong>
                          {
                            project.checkpoints.find(
                              (point) => point.id === item.id,
                            )?.title
                          }
                        </strong>
                        <span>{item.passed ? "PASS" : "NOT YET"}</span>
                      </div>
                      <p>{item.detail}</p>
                    </div>
                  ))}
                  <p className="project-result-note">
                    {progress.storageUnavailable
                      ? "Checkpoint progress is temporary while this page stays open."
                      : "Passed checkpoints are saved in this browser. Your best progress is kept when you retry."}
                  </p>
                </>
              )}
            </section>
          )}
        </div>
      </div>
    </section>
  );
}
