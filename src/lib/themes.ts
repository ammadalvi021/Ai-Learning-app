"use client";

import { useSyncExternalStore } from "react";

export const themes = [
  {
    id: "ember",
    name: "Ember glass",
    description: "Smoked glass, obsidian panels, and molten orange light.",
    color: "#ff8a42",
  },
  {
    id: "neon",
    name: "Neon glass",
    description: "A black glass workspace illuminated by electric green.",
    color: "#9bff76",
  },
  {
    id: "matrix",
    name: "Matrix",
    description: "Digital rain, phosphor green, and a terminal-inspired grid.",
    color: "#3cff8f",
  },
  {
    id: "robot",
    name: "Robot",
    description: "Precision metal, cool cyan, and your robotic co-pilot.",
    color: "#70d9ff",
  },
  {
    id: "nova",
    name: "Nova",
    description: "Deep-space violet with luminous blue orbital accents.",
    color: "#bc9bff",
  },
] as const;

export type ThemeId = (typeof themes)[number]["id"];

type ThemeState = {
  theme: ThemeId;
  storageUnavailable: boolean;
};

const STORAGE_KEY = "bloom-theme-v1";
const INITIAL_STATE: ThemeState = {
  theme: "ember",
  storageUnavailable: false,
};
const themeIds = new Set<string>(themes.map(({ id }) => id));
let state = INITIAL_STATE;
let initialized = false;
const listeners = new Set<() => void>();

function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && themeIds.has(value);
}

function initialize() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    state = {
      theme: isThemeId(stored) ? stored : "ember",
      storageUnavailable: false,
    };
  } catch {
    state = { theme: "ember", storageUnavailable: true };
  }
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
}

function notify() {
  listeners.forEach((listener) => listener());
}

function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY && event.key !== null) return;

  try {
    if (event.storageArea !== window.localStorage) return;
    state = {
      theme: isThemeId(event.newValue) ? event.newValue : "ember",
      storageUnavailable: false,
    };
  } catch {
    state = { ...state, storageUnavailable: true };
  }

  applyTheme();
  notify();
}

function subscribe(listener: () => void) {
  initialize();
  applyTheme();
  listeners.add(listener);

  if (listeners.size === 1) {
    window.addEventListener("storage", onStorage);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("storage", onStorage);
    }
  };
}

function getSnapshot() {
  initialize();
  return state;
}

function getServerSnapshot() {
  return INITIAL_STATE;
}

export function useTheme(): ThemeState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setTheme(theme: ThemeId) {
  if (typeof window === "undefined" || !isThemeId(theme)) return;
  initialize();
  state = { theme, storageUnavailable: false };

  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    state = { theme, storageUnavailable: true };
  }

  applyTheme();
  notify();
}
