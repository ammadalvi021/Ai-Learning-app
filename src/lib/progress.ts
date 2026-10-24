"use client";

import { useSyncExternalStore } from "react";
import { allLessons } from "./course";

export type Progress = {
  completed: string[];
  scores: Record<string, number>;
  completionDates: Record<string, string>;
  storageUnavailable: boolean;
};

const STORAGE_KEY = "bloom-learning-progress-v1";
const CHANGE_EVENT = "bloom-learning-progress-change";
const lessonIds = new Set(allLessons.map((lesson) => lesson.id));
const EMPTY_PROGRESS: Progress = {
  completed: [],
  scores: {},
  completionDates: {},
  storageUnavailable: false,
};

let snapshot = EMPTY_PROGRESS;
let initialized = false;
const listeners = new Set<() => void>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isLessonId(value: unknown): value is string {
  return typeof value === "string" && lessonIds.has(value);
}

function isDateKey(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T12:00:00Z`);
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

function parseProgress(raw: string | null): Progress {
  if (raw === null) return EMPTY_PROGRESS;

  try {
    const value: unknown = JSON.parse(raw);
    if (
      !isRecord(value) ||
      !Array.isArray(value.completed) ||
      !isRecord(value.scores) ||
      !isRecord(value.completionDates)
    ) {
      return EMPTY_PROGRESS;
    }

    const completed: unknown[] = value.completed;
    const scoreEntries = Object.entries(value.scores);
    const dateEntries = Object.entries(value.completionDates);

    if (
      !completed.every(isLessonId) ||
      new Set(completed).size !== completed.length ||
      !scoreEntries.every(
        ([id, score]) =>
          isLessonId(id) &&
          typeof score === "number" &&
          Number.isFinite(score) &&
          score >= 0 &&
          score <= 100,
      ) ||
      !dateEntries.every(([id, date]) => isLessonId(id) && isDateKey(date))
    ) {
      return EMPTY_PROGRESS;
    }

    const scores = Object.fromEntries(scoreEntries) as Record<string, number>;
    const completionDates = Object.fromEntries(dateEntries) as Record<
      string,
      string
    >;
    const completedIds = completed as string[];

    if (
      !completedIds.every(
        (id) =>
          Object.hasOwn(scores, id) &&
          scores[id] === 100 &&
          Object.hasOwn(completionDates, id),
      ) ||
      !dateEntries.every(([id]) => completedIds.includes(id)) ||
      !scoreEntries.every(
        ([id, score]) => score !== 100 || completedIds.includes(id),
      )
    ) {
      return EMPTY_PROGRESS;
    }

    return {
      completed: completedIds,
      scores,
      completionDates,
      storageUnavailable: false,
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

function initialize() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  try {
    snapshot = parseProgress(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    snapshot = { ...EMPTY_PROGRESS, storageUnavailable: true };
  }
}

function notify() {
  listeners.forEach((listener) => listener());
}

function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY && event.key !== null) return;

  try {
    if (event.storageArea !== window.localStorage) return;
    snapshot = parseProgress(event.key === null ? null : event.newValue);
  } catch {
    snapshot = { ...snapshot, storageUnavailable: true };
  }

  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    window.addEventListener(CHANGE_EVENT, notify);
    window.addEventListener("storage", onStorage);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener(CHANGE_EVENT, notify);
      window.removeEventListener("storage", onStorage);
    }
  };
}

function getSnapshot() {
  initialize();
  return snapshot;
}

function getServerSnapshot() {
  return EMPTY_PROGRESS;
}

export function useLearningProgress(): Progress {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function todayKey(): string {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function recordQuiz(lessonId: string, score: number): void {
  if (
    typeof window === "undefined" ||
    !isLessonId(lessonId) ||
    !Number.isFinite(score) ||
    score < 0 ||
    score > 100
  ) {
    return;
  }

  initialize();
  const previousScore = Object.hasOwn(snapshot.scores, lessonId)
    ? snapshot.scores[lessonId]
    : 0;
  const completed = snapshot.completed.includes(lessonId);
  const next: Progress = {
    completed:
      score === 100 && !completed
        ? [...snapshot.completed, lessonId]
        : snapshot.completed,
    scores: { ...snapshot.scores, [lessonId]: Math.max(previousScore, score) },
    completionDates:
      score === 100 && !completed
        ? { ...snapshot.completionDates, [lessonId]: todayKey() }
        : snapshot.completionDates,
    storageUnavailable: false,
  };

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        completed: next.completed,
        scores: next.scores,
        completionDates: next.completionDates,
      }),
    );
  } catch {
    next.storageUnavailable = true;
  }

  snapshot = next;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  initialize();
  snapshot = EMPTY_PROGRESS;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    snapshot = { ...EMPTY_PROGRESS, storageUnavailable: true };
  }

  window.dispatchEvent(new Event(CHANGE_EVENT));
}
