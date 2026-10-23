# Bloom · AI Learning App

A beginner-friendly place to learn the basics of artificial intelligence, complete short quizzes, and track your learning progress. Built with Next.js, React, and TypeScript.

## What you can do

- Work through short lessons about AI, machine learning, prompting, and responsible use.
- Check your understanding with interactive quizzes.
- Keep your completed lessons and quiz progress in your browser using `localStorage`.
- Learn on a phone, tablet, or computer with a responsive interface and keyboard-friendly controls.
- Search lessons, revisit explanations, and reset your progress when you want a fresh start.

The app works without an account or an API key. Progress is stored in the current browser, so it does not sync between devices and can be removed by clearing site data. This starter does not include a backend or an AI chat service.

Pass both questions to complete a lesson. Your best quiz score is retained, and you can retry without a limit. If browser storage is blocked, learning still works, but progress lasts only while the page stays open.

## Run the app

Install [Node.js](https://nodejs.org/) version 22 or newer, then open a terminal in this repository:

```sh
npm ci
npm run dev
```

Open the address printed by the development server in your browser. Changes to the source files appear as you work.

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

Use `npm run format` to format the source files. The browser suite covers quiz results, saved progress, search, reset, unavailable or corrupt storage, and mobile keyboard navigation.

## Find your way around

- `src/app`: Next.js pages, layouts, and application styles.
- `src/components`: Reusable interactive interface components.
- `src/lib/course.ts`: Lesson content and course data.
- `.github/workflows/ci.yml`: Automated checks for changes.

## Deploy

You can deploy this app to a hosting provider that supports Next.js. Connect your repository, select the provider's Next.js preset, and use `npm run build` as the build command. A self-hosted Node deployment can run `npm start` after building.

Deployment is a separate step; creating or building this repository does not publish a website. No API credentials are required for the current app.
