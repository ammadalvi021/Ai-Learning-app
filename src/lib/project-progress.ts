"use client";

import { useSyncExternalStore } from "react";
import { projects, type ProjectFiles } from "./projects";

export type ProjectProgress = {
  drafts: Record<string, ProjectFiles>;
  completed: Record<string, string[]>;
  storageUnavailable: boolean;
};
const KEY = "bloom-projects-v1";
const EMPTY: ProjectProgress = {
  drafts: {},
  completed: {},
  storageUnavailable: false,
};
let snapshot = EMPTY;
let initialized = false;
const listeners = new Set<() => void>();
const filenames = ["index.html", "styles.css", "script.js"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function readSaved(): ProjectProgress {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const data: unknown = JSON.parse(raw);
    if (!isRecord(data) || !isRecord(data.drafts) || !isRecord(data.completed))
      return EMPTY;
    const drafts: Record<string, ProjectFiles> = {};
    const completed: Record<string, string[]> = {};
    for (const project of projects) {
      const files = data.drafts[project.id];
      if (
        isRecord(files) &&
        filenames.every(
          (name) =>
            typeof files[name] === "string" &&
            (files[name] as string).length <= 50_000,
        )
      ) {
        drafts[project.id] = Object.fromEntries(
          filenames.map((name) => [name, files[name]]),
        ) as ProjectFiles;
      }
      const ids = data.completed[project.id];
      if (Array.isArray(ids))
        completed[project.id] = [
          ...new Set(
            ids.filter(
              (id): id is string =>
                typeof id === "string" &&
                project.checkpoints.some((point) => point.id === id),
            ),
          ),
        ];
    }
    return { drafts, completed, storageUnavailable: false };
  } catch (error) {
    return error instanceof SyntaxError
      ? EMPTY
      : { ...EMPTY, storageUnavailable: true };
  }
}
function getSnapshot() {
  if (!initialized && typeof window !== "undefined") {
    initialized = true;
    snapshot = readSaved();
  }
  return snapshot;
}
function notify() {
  listeners.forEach((listener) => listener());
}
function storage(event: StorageEvent) {
  if (event.key !== KEY && event.key !== null) return;
  try {
    if (event.storageArea !== window.localStorage) return;
  } catch {
    return;
  }
  snapshot = readSaved();
  notify();
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", storage);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) window.removeEventListener("storage", storage);
  };
}
function save(next: ProjectProgress) {
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
export function useProjectProgress() {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}
export function saveProjectFiles(id: string, files: ProjectFiles) {
  if (
    !projects.some((project) => project.id === id) ||
    !filenames.every(
      (name) => typeof files[name] === "string" && files[name].length <= 50_000,
    )
  )
    return;
  const current = getSnapshot();
  save({ ...current, drafts: { ...current.drafts, [id]: { ...files } } });
}
export function saveProjectCheckpoints(id: string, ids: string[]) {
  const project = projects.find((item) => item.id === id);
  if (!project) return;
  const current = getSnapshot();
  const valid = ids.filter((point) =>
    project.checkpoints.some((check) => check.id === point),
  );
  save({
    ...current,
    completed: {
      ...current.completed,
      [id]: [...new Set([...(current.completed[id] ?? []), ...valid])],
    },
  });
}
export function resetProject(id: string) {
  const current = getSnapshot();
  const drafts = { ...current.drafts };
  const completed = { ...current.completed };
  delete drafts[id];
  delete completed[id];
  save({ ...current, drafts, completed });
}
