# Bloom · Developer Workspace

A futuristic workspace for learning JavaScript, understanding AI, and building real browser projects. Version **0.3** adds a professional CodeMirror 6 editor, **20 coding challenges**, and **three guided projects**. Built with Next.js, React, and TypeScript.

## What you can do

- Follow **JavaScript essentials**: six lessons about variables, conditions, functions, arrays, objects, and asynchronous code, with examples and quizzes.
- Explore **AI foundations**: the original six lessons about AI, data, prompting, and responsible use. Existing lesson IDs, completed lessons, and best quiz scores are preserved.
- Switch tracks, search lessons, review explanations, and see progress for each track.
- Practice in **Coding lab**, with 20 challenges searchable by title or concept and filterable by category and difficulty.
- Build a **Developer portfolio**, **Task tracker**, and **Weather dashboard** in **Guided projects**, using separate HTML, CSS, and JavaScript files.
- Keep the five visual themes and use responsive layouts with keyboard-friendly navigation.

Pass both quiz questions to complete a lesson. Your best score is retained, and you can retry without a limit. Resetting lesson progress clears both learning tracks; it leaves your theme and coding drafts alone.

## Work in the code editor

Coding lab and the guided-project workspace use **CodeMirror 6**, with:

- Syntax highlighting for JavaScript, HTML, and CSS.
- Autocomplete, automatic bracket closing, matching-bracket highlighting, and active-line highlighting.
- Line numbers, undo/redo, and parser diagnostics for syntax problems.
- Theme-aware colors that follow your selected Bloom interface.

**Tab moves focus to the next control**, so the editor does not trap keyboard users. Use **Ctrl/⌘ + Space** for completion, **Ctrl/⌘ + Z** to undo, and **Ctrl/⌘ + Enter** to run the current coding action. **Ctrl/⌘ + ]** and **Ctrl/⌘ + [** increase or decrease indentation.

Syntax diagnostics check the parser’s understanding of your source. They do not prove that a program produces the right result; use the runtime tests and project checks as well.

## Practice with coding challenges

Open **Coding lab** to work through **20 Starter and Intermediate exercises** across Arrays, Strings, Numbers, Objects, and Algorithms. The library includes frequency tables, array batching, palindrome checks, factorials, FizzBuzz, object-value totals, password-rule validation, and binary search, alongside the original three exercises.

The challenges contain **103 test cases**, including empty inputs, negative values, whitespace, ordering, and other edge cases. Each exercise provides a clear input contract, starter code, and progressive hints. Run your solution to see actual expected and received values. A challenge is marked solved when all its cases pass; the original three challenge IDs and existing saved drafts remain compatible.

Drafts and solved challenges are stored in the current browser. Resetting a challenge’s code requires confirmation before replacing your draft with the starter.

## Build guided projects

Open **Guided projects**, choose a project, and work through its checkpoint instructions and hints:

| Project                 | What you build                                                                                 |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| **Developer portfolio** | A personal introduction, a responsive three-project card grid, and working in-page navigation. |
| **Task tracker**        | An accessible task form, DOM updates, completion checkboxes, and delete controls.              |
| **Weather dashboard**   | City selection and Celsius/Fahrenheit conversion using a built-in sample dataset.              |

Use the `index.html`, `styles.css`, and `script.js` file tabs to edit the source, then choose **Run preview** or **Check checkpoints**. Source drafts are saved per project, so switching projects does not discard your work. Use **Load reference project** to compare with a working implementation; loading a reference or resetting a project requires confirmation before replacing your current files.

The weather project uses **sample weather data, not a live forecast**. It does not request your location or need an API key. Task-list items and other state inside a running preview are recreated when the preview restarts; saved project source is separate from that temporary page state.

## Choose your theme

Open **Appearance** in the navigation, or use the sidebar color swatches:

| Theme           | Design                                                       |
| --------------- | ------------------------------------------------------------ |
| **Ember glass** | Orange light, black backgrounds, and smoked-glass panels.    |
| **Neon glass**  | Electric green accents over a black glass workspace.         |
| **Matrix**      | Phosphor green, terminal styling, and animated digital rain. |
| **Robot**       | Metallic panels, cyan accents, and a robot illustration.     |
| **Nova**        | Deep-space violet and luminous orbital accents.              |

Your theme is saved in this browser and restored when you return. Switching themes preserves your learning progress and source drafts. Animations respect the device’s reduced-motion preference.

## What stays on your device

The app works without an account or an API key. Themes, lesson progress, coding drafts, and project drafts use browser storage. They do not sync across devices and can be removed by clearing site data. If storage is blocked, you can still learn and practice, but changes may last only while the page stays open.

Coding challenges execute JavaScript in an isolated browser worker inside a sandbox, with network access blocked and a time limit for programs that do not finish. Guided projects preview browser HTML, CSS, and JavaScript in a sandbox. Test output reports actual results rather than simulating success.

This release does not include Python or server-side execution, accounts, cloud sync, live AI mentoring, or GitHub integration. The AI track teaches concepts through local lesson content; it does not call an AI service.

## Run the app

Install [Node.js](https://nodejs.org/) version 22 or newer, then open a terminal in this repository:

```sh
npm ci
npm run dev
```

Open the address printed by the development server in your browser. Keep the terminal open while using the app. Source changes appear as you work.

## Update an existing copy

If you cloned the repository with Git, stop the app with **Ctrl+C**, then run these commands from the project folder:

```sh
git pull origin main
npm ci
npm run dev
```

Keep any local edits safe before pulling. If you originally used **Download ZIP**, including on Windows, download the updated `main` ZIP from GitHub, extract it into a new folder, open that folder in VS Code, and run `npm ci` followed by `npm run dev`. Choose the folder containing `package.json`.

## Check your changes

Run these commands from the repository directory:

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

The browser tests use Playwright. Install Chromium and its required system dependencies before running tests for the first time:

```sh
npx playwright install --with-deps chromium
```

In a managed cloud environment with Chromium already installed, use that browser instead:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test
```

`npm run build` creates a production build. After building, use `npm start` to run it locally. GitHub Actions runs lint, type checks, browser tests, and the production build on pushes and pull requests.

Use `npm run format` to format the source. Browser coverage includes lessons, progress persistence, filters, resets, storage failures, mobile keyboard navigation, themes, the professional editor, coding challenges, and guided projects.

## Find your way around

- `src/app`: Next.js pages, layouts, and application styles.
- `src/components/lesson-reader.tsx`: Lesson reading, code examples, and quizzes.
- `src/components/code-editor.tsx`: Shared CodeMirror editor and syntax diagnostics.
- `src/components/code-lab.tsx`: Challenge search, filters, hints, and test results.
- `src/components/project-workspace.tsx`: Guided projects, source-file tabs, and previews.
- `src/components/theme-picker.tsx`: Theme selection and previews.
- `src/lib/course.ts`: JavaScript and AI learning tracks.
- `src/lib/progress.ts`: Stored lesson completion and best quiz scores.
- `src/lib/themes.ts`: Theme definitions and stored appearance preferences.
- `src/lib/challenges.ts`: Twenty coding exercises and their test cases.
- `src/lib/code-runner.ts`: Isolated JavaScript execution and time limits.
- `src/lib/projects.ts`: Guided-project starters, references, and checkpoint instructions.
- `.github/workflows/ci.yml`: Automated checks for changes.

## Deploy

Deploy to a hosting provider that supports Next.js. Connect the repository, select the provider’s Next.js preset, and use `npm run build` as the build command. A self-hosted Node deployment can run `npm start` after building.

Deployment is a separate step; creating or building this repository does not publish a website. No API credentials are required for the current app.
