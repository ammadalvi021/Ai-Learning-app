"use client";

import { useEffect, useRef, useState } from "react";
import { Compartment, EditorState } from "@codemirror/state";
import {
  EditorView,
  drawSelection,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
} from "@codemirror/view";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentLess,
  indentMore,
} from "@codemirror/commands";
import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completeFromList,
  completionKeymap,
} from "@codemirror/autocomplete";
import {
  HighlightStyle,
  bracketMatching,
  defaultHighlightStyle,
  indentOnInput,
  syntaxHighlighting,
  syntaxTree,
} from "@codemirror/language";
import { javascript, javascriptLanguage } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { linter, lintGutter, type Diagnostic } from "@codemirror/lint";
import { tags } from "@lezer/highlight";
import { CheckCircle2, Code2, TriangleAlert } from "lucide-react";

export type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  onRun?: () => void;
  language?: "javascript" | "html" | "css";
  label?: string;
};

const MAX_LENGTH = 50_000;
const languageNames = { javascript: "JavaScript", html: "HTML", css: "CSS" };

function languageExtension(language: CodeEditorProps["language"]) {
  if (language === "html") return html();
  if (language === "css") return css();
  return [
    javascript(),
    javascriptLanguage.data.of({
      autocomplete: completeFromList([
        {
          label: "console.log",
          type: "function",
          detail: "Print a value",
          apply: "console.log()",
        },
        { label: "Math.max", type: "function", detail: "Largest number" },
        { label: "Math.min", type: "function", detail: "Smallest number" },
        { label: "Math.floor", type: "function", detail: "Round down" },
        {
          label: "JSON.stringify",
          type: "function",
          detail: "Serialize a value",
        },
        { label: "JSON.parse", type: "function", detail: "Read JSON" },
        { label: "Array.isArray", type: "function", detail: "Check an array" },
        {
          label: "Number.isFinite",
          type: "function",
          detail: "Check a finite number",
        },
      ]),
    }),
  ];
}

const colors = HighlightStyle.define([
  {
    tag: [tags.keyword, tags.operatorKeyword, tags.modifier],
    color: "var(--accent)",
  },
  { tag: [tags.string, tags.special(tags.string)], color: "var(--success)" },
  { tag: [tags.number, tags.bool, tags.null], color: "#c6a8ee" },
  { tag: [tags.comment], color: "var(--muted)", fontStyle: "italic" },
  {
    tag: [tags.function(tags.variableName), tags.function(tags.propertyName)],
    color: "var(--code, var(--accent))",
  },
  {
    tag: [tags.tagName, tags.attributeName, tags.className],
    color: "var(--accent)",
  },
]);

const editorTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "transparent",
      color: "var(--text)",
      fontSize: "13px",
      width: "100%",
      maxWidth: "100%",
    },
    "&.cm-focused": { outline: "none" },
    ".cm-scroller": {
      fontFamily: "var(--mono, monospace)",
      overflow: "auto",
      lineHeight: "1.9",
      minHeight: "260px",
      maxHeight: "500px",
    },
    ".cm-content": {
      padding: "17px 0",
      minHeight: "260px",
      caretColor: "var(--accent)",
    },
    ".cm-line": { padding: "0 15px" },
    ".cm-gutters": {
      backgroundColor: "transparent",
      border: "none",
      color: "var(--muted)",
      padding: "0 7px",
      opacity: "0.7",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(var(--accent-rgb), .08)",
      color: "var(--accent)",
    },
    ".cm-activeLine": { backgroundColor: "rgba(var(--accent-rgb), .035)" },
    ".cm-cursor, .cm-dropCursor": { borderLeftColor: "var(--accent)" },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection":
      { backgroundColor: "rgba(var(--accent-rgb), .2)" },
    ".cm-matchingBracket": {
      backgroundColor: "rgba(var(--accent-rgb), .2)",
      outline: "1px solid rgba(var(--accent-rgb), .45)",
    },
    ".cm-tooltip": {
      backgroundColor: "var(--panel-strong)",
      color: "var(--text)",
      border: "1px solid var(--border)",
      borderRadius: "6px",
    },
    ".cm-tooltip-autocomplete > ul > li[aria-selected]": {
      backgroundColor: "rgba(var(--accent-rgb), .17)",
      color: "var(--text)",
    },
    ".cm-completionDetail": {
      color: "var(--muted)",
      fontSize: "10px",
      paddingLeft: "10px",
    },
    ".cm-diagnostic-error": { borderLeftColor: "var(--danger)" },
    ".cm-lintRange-error": { backgroundPosition: "left bottom" },
  },
  { dark: true },
);

export default function CodeEditor({
  value,
  onChange,
  readOnly = false,
  onRun,
  language = "javascript",
  label = "Code editor",
}: CodeEditorProps) {
  const mount = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const callbacks = useRef({ onChange, onRun });
  const initial = useRef({ value, language, label, readOnly });
  const [issues, setIssues] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  const [config] = useState(() => ({
    language: new Compartment(),
    readOnly: new Compartment(),
    attributes: new Compartment(),
  }));

  useEffect(() => {
    callbacks.current = { onChange, onRun };
  }, [onChange, onRun]);

  useEffect(() => {
    if (!mount.current) return;
    const defaults = initial.current;
    const diagnose = linter(
      (view) => {
        const diagnostics: Diagnostic[] = [];
        syntaxTree(view.state).iterate({
          enter(node) {
            if (node.type.isError && diagnostics.length < 20) {
              const from = Math.min(
                node.from,
                Math.max(0, view.state.doc.length - 1),
              );
              diagnostics.push({
                from,
                to: Math.min(
                  view.state.doc.length,
                  Math.max(from + 1, node.to),
                ),
                severity: "error",
                message:
                  "Syntax error. Check brackets, quotes, and punctuation near this position.",
              });
            }
          },
        });
        setIssues(diagnostics.length);
        return diagnostics;
      },
      { delay: 350 },
    );

    const view = new EditorView({
      parent: mount.current,
      state: EditorState.create({
        doc: defaults.value.slice(0, MAX_LENGTH),
        extensions: [
          lineNumbers(),
          highlightActiveLineGutter(),
          highlightActiveLine(),
          drawSelection(),
          history(),
          indentOnInput(),
          bracketMatching(),
          closeBrackets(),
          autocompletion({ icons: false, activateOnTyping: true }),
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
          syntaxHighlighting(colors),
          editorTheme,
          lintGutter(),
          diagnose,
          config.language.of(languageExtension(defaults.language)),
          config.readOnly.of([
            EditorState.readOnly.of(defaults.readOnly),
            EditorView.editable.of(!defaults.readOnly),
          ]),
          config.attributes.of(
            EditorView.contentAttributes.of({
              "aria-label": defaults.label,
              "aria-multiline": "true",
              role: "textbox",
              spellcheck: "false",
              autocorrect: "off",
              autocapitalize: "off",
            }),
          ),
          EditorState.tabSize.of(2),
          keymap.of([
            {
              key: "Mod-Enter",
              run: () => {
                callbacks.current.onRun?.();
                return Boolean(callbacks.current.onRun);
              },
            },
            { key: "Mod-]", run: indentMore },
            { key: "Mod-[", run: indentLess },
            ...closeBracketsKeymap,
            ...completionKeymap,
            ...historyKeymap,
            ...defaultKeymap,
          ]),
          EditorState.transactionFilter.of((transaction) => {
            if (transaction.newDoc.length <= MAX_LENGTH) return transaction;
            setLimitReached(true);
            return [];
          }),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              setLimitReached(false);
              callbacks.current.onChange(update.state.doc.toString());
            }
          }),
        ],
      }),
    });
    viewRef.current = view;
    return () => {
      viewRef.current = null;
      view.destroy();
    };
  }, [config]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view || view.state.doc.toString() === value) return;
    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: value.slice(0, MAX_LENGTH),
      },
    });
  }, [value]);
  useEffect(() => {
    viewRef.current?.dispatch({
      effects: config.language.reconfigure(languageExtension(language)),
    });
  }, [language, config]);
  useEffect(() => {
    viewRef.current?.dispatch({
      effects: config.readOnly.reconfigure([
        EditorState.readOnly.of(readOnly),
        EditorView.editable.of(!readOnly),
      ]),
    });
  }, [readOnly, config]);
  useEffect(() => {
    viewRef.current?.dispatch({
      effects: config.attributes.reconfigure(
        EditorView.contentAttributes.of({
          "aria-label": label,
          "aria-multiline": "true",
          role: "textbox",
          spellcheck: "false",
          autocorrect: "off",
          autocapitalize: "off",
        }),
      ),
    });
  }, [label, config]);

  return (
    <div className="professional-editor">
      <div className="editor-toolbar">
        <span className="editor-language">
          <Code2 size={13} />
          {languageNames[language]}
        </span>
        <span
          className={`editor-diagnostics ${issues ? "has-errors" : ""}`}
          aria-live="polite"
        >
          {issues ? <TriangleAlert size={12} /> : <CheckCircle2 size={12} />}
          {issues
            ? `${issues} syntax ${issues === 1 ? "issue" : "issues"}`
            : "No syntax issues"}
        </span>
      </div>
      <div className="codemirror-mount" ref={mount} />
      <div className="editor-shortcuts">
        <span>Ctrl / ⌘ + Space: complete · Tab: next control</span>
        <span>Ctrl / ⌘ + Z: undo{onRun ? " · Ctrl / ⌘ + Enter: run" : ""}</span>
      </div>
      {limitReached && (
        <p className="editor-limit" role="status">
          Code is limited to 50,000 characters per file.
        </p>
      )}
    </div>
  );
}
