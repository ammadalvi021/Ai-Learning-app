"use client";

import type { CSSProperties } from "react";
import { Check } from "lucide-react";
import { setTheme, themes, useTheme } from "@/lib/themes";

export default function ThemePicker({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { theme, storageUnavailable } = useTheme();

  return (
    <fieldset
      className={`theme-picker ${compact ? "theme-picker-compact" : ""}`}
    >
      <legend>Choose your interface</legend>
      <p className="theme-picker-description">
        Five environments. One workspace. Make it feel like yours.
      </p>
      <div className="theme-options">
        {themes.map((option) => (
          <label
            key={option.id}
            className={`theme-option theme-option-${option.id} ${theme === option.id ? "is-selected" : ""}`}
            style={{ "--theme-swatch": option.color } as CSSProperties}
          >
            <input
              type="radio"
              name="interface-theme"
              aria-label={option.name}
              value={option.id}
              checked={theme === option.id}
              onChange={() => setTheme(option.id)}
            />
            <span className="theme-preview" aria-hidden="true">
              <span className="theme-preview-sidebar" />
              <span className="theme-preview-content">
                <span className="theme-preview-line" />
                <span className="theme-preview-hero" />
                <span className="theme-preview-cards">
                  <i />
                  <i />
                  <i />
                </span>
              </span>
              <span className="theme-preview-glow" />
            </span>
            <span className="theme-option-info">
              <strong>{option.name}</strong>
              {!compact && <span>{option.description}</span>}
            </span>
            <span className="theme-option-check" aria-hidden="true">
              {theme === option.id && <Check size={15} />}
            </span>
          </label>
        ))}
      </div>
      <p className="theme-picker-note">
        {storageUnavailable
          ? "Browser storage is unavailable. This theme lasts while this page stays open."
          : "Your theme follows this browser."}
      </p>
      <p className="theme-selection-status" role="status" aria-live="polite">
        {themes.find((option) => option.id === theme)?.name} selected.
      </p>
    </fieldset>
  );
}
