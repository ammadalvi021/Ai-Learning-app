# Bloom · Developer Workspace

A futuristic workspace for learning JavaScript, understanding AI, and practicing real code. Version 0.2 adds five visual themes, a JavaScript learning track, and an interactive coding lab. Built with Next.js, React, and TypeScript.

## What you can do

- Follow **JavaScript essentials**: six lessons covering variables, conditions, functions, arrays, objects, and asynchronous code, with runnable-style code examples and short quizzes.
- Explore **AI foundations**: the original six lessons about AI, data, prompting, and responsible use. Existing completed lessons and best quiz scores remain available.
- Switch tracks, search lessons, review explanations, and see progress for each track.
- Write JavaScript in **Coding lab** and run actual test cases for three exercises: summing positive numbers, cleaning usernames, and counting words.
- Read expected and actual results, reveal hints, and reset starter code after confirmation. Code drafts and completed challenges are saved in the current browser.
- Use the responsive layout and keyboard navigation on a phone, tablet, or computer.

Pass both quiz questions to complete a lesson. Your best score is retained, and you can retry without a limit. Resetting lesson progress clears both learning tracks; it leaves your selected theme and coding drafts alone.

## Choose your theme

Open **Appearance** in the navigation, or use the color swatches near the bottom of the sidebar:

| Theme           | Design                                                       |
| --------------- | ------------------------------------------------------------ |
| **Ember glass** | Orange light, black backgrounds, and smoked-glass panels.    |
| **Neon glass**  | Electric green accents over a black glass workspace.         |
| **Matrix**      | Phosphor green, terminal styling, and animated digital rain. |
| **Robot**       | Metallic panels, cyan accents, and a robot illustration.     |
| **Nova**        | Deep-space violet and luminous orbital accents.              |

Your selection is saved in this browser and restored when you return. Switching themes preserves your lessons, quiz progress, and code drafts. Animations respect the device’s reduced-motion preference.

## What stays on your device

The app works without an account or an API key. Themes, lesson progress, and code drafts use browser storage, so they do not sync across devices and can be removed by clearing site data. If storage is blocked, you can still learn and practice, but changes may last only while the page stays open.

The coding lab runs JavaScript in an isolated browser worker inside a sandbox. Network access is blocked, and code that does not finish is stopped by a time limit. Test output reports actual results rather than simulating a successful run.

This version does not include a Python runtime, a server backend, accounts, cloud sync, or a live AI tutor. The AI track teaches concepts through local lesson content; it does not call an AI service.

## Run the app

Install [Node.js](https://nodejs.org/) version 22 or newer, then open a terminal in this repository:

```sh
npm ci
npm run dev
```

Open the address printed by the development server in your browser. Changes to the source files appear as you work.

## Update an existing copy

If you cloned the repository with Git, stop the app with **Ctrl+C**, then run these commands from the project folder:

```sh
git pull origin main
npm ci
npm run dev
```

Keep any local edits safe before pulling. If you originally used **Download ZIP**, including on Windows, download the updated `main` ZIP from GitHub, extract it into a new folder, open that folder in VS Code, and run `npm ci` followed by `npm run dev` in its terminal. Choose the folder containing `package.json`.

## Check your changes

Run these commands from the repository directory:

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

The browser tests use Playwright. Install its Chromium browser and required system dependencies before running tests for the first time:

```sh
npx playwright install --with-deps chromium
```

In a managed cloud environment that already provides Chromium, you can use that browser instead:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test
```

`npm run build` creates a production build. After building, use `npm start` to run it locally. The GitHub Actions workflow runs linting, type checks, browser tests, and the production build on pushes and pull requests.

Use `npm run format` to format the source files. The browser suite covers lesson quizzes and persistence, search and filters, reset confirmation, unavailable or corrupt storage, mobile keyboard navigation, themes, and coding lab behavior.

## Find your way around

- `src/app`: Next.js pages, layouts, and application styles.
- `src/components`: Reusable interactive interface components.
- `src/components/lesson-reader.tsx`: Lesson reading, code examples, and quizzes.
- `src/components/code-lab.tsx`: Coding editor, hints, and test-result interface.
- `src/components/theme-picker.tsx`: Theme selection and previews.
- `src/lib/course.ts`: JavaScript and AI learning tracks.
- `src/lib/progress.ts`: Stored lesson completion and best quiz scores.
- `src/lib/themes.ts`: Theme definitions and stored appearance preferences.
- `src/lib/challenges.ts`: Coding exercises and their test cases.
- `src/lib/code-runner.ts`: Isolated JavaScript execution and time limits.
- `.github/workflows/ci.yml`: Automated checks for changes.

## Deploy

You can deploy this app to a hosting provider that supports Next.js. Connect your repository, select the provider's Next.js preset, and use `npm run build` as the build command. A self-hosted Node deployment can run `npm start` after building.

Deployment is a separate step; creating or building this repository does not publish a website. No API credentials are required for the current app.
