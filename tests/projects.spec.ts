import { expect, test, type Page } from "@playwright/test";
import { projects } from "../src/lib/projects";

async function openProjects(page: Page) {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Guided projects", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Guided projects", level: 1 }),
  ).toBeVisible();
}
async function chooseProject(page: Page, title: string) {
  await page
    .getByRole("group", { name: "Choose a guided project" })
    .getByRole("button", { name: new RegExp(title) })
    .click();
}
async function loadReference(page: Page) {
  await page
    .getByRole("button", { name: "Load reference project", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Replace with reference", exact: true })
    .click();
}

for (const project of projects) {
  test(`${project.title} passes real checkpoints and retains its files and completed checkpoints`, async ({
    page,
  }) => {
    await openProjects(page);
    await chooseProject(page, project.title);
    await loadReference(page);
    await page
      .getByRole("button", { name: "Check checkpoints", exact: true })
      .click();
    const results = page.getByRole("region", { name: "Checkpoint results" });
    await expect(results.getByRole("status")).toHaveText(
      "All checkpoints passed. Project complete!",
    );
    await expect(results.getByText("PASS", { exact: true })).toHaveCount(
      project.checkpoints.length,
    );
    await page.reload();
    await page
      .getByRole("button", { name: "Guided projects", exact: true })
      .click();
    await chooseProject(page, project.title);
    await expect(page.getByText("3/3 best", { exact: true })).toBeVisible();
    const editor = page.getByRole("textbox", {
      name: "Project code editor",
      exact: true,
    });
    await expect
      .poll(async () => (await editor.innerText()).replace(/\n+$/, ""))
      .toBe(project.referenceFiles["index.html"].replace(/\n+$/, ""));
  });
}

test("the task preview supports actual form submission, completion, and deletion", async ({
  page,
}) => {
  await openProjects(page);
  await chooseProject(page, "Task tracker");
  await loadReference(page);
  const frame = page.frameLocator('iframe[title="Project preview"]');
  await frame
    .getByRole("textbox", { name: "New task" })
    .fill("Ship my first project");
  await frame.getByRole("button", { name: "Add task", exact: true }).click();
  const item = frame
    .getByRole("listitem")
    .filter({ hasText: "Ship my first project" });
  await expect(item).toBeVisible();
  await item.getByRole("checkbox").check();
  await expect(item).toHaveClass(/completed/);
  await item
    .getByRole("button", { name: "Delete Ship my first project", exact: true })
    .click();
  await expect(item).toHaveCount(0);
});

test("project drafts persist per file, reference replacement can be cancelled, and reset requires confirmation", async ({
  page,
}) => {
  await openProjects(page);
  const editor = page.getByRole("textbox", {
    name: "Project code editor",
    exact: true,
  });
  const source = "<main><h1>My saved portfolio draft</h1></main>";
  await editor.fill(source);
  await page.getByRole("tab", { name: "styles.css", exact: true }).click();
  await editor.fill("body { color: orange; }");
  await page
    .getByRole("button", { name: "Load reference project", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Keep my draft", exact: true })
    .click();
  await expect(editor).toHaveText("body { color: orange; }");
  await page.reload();
  await page
    .getByRole("button", { name: "Guided projects", exact: true })
    .click();
  await expect(editor).toHaveText(source);
  await page.getByRole("tab", { name: "styles.css", exact: true }).click();
  await expect(editor).toHaveText("body { color: orange; }");
  await page
    .getByRole("button", { name: "Reset project", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Keep my draft", exact: true })
    .click();
  await expect(editor).toHaveText("body { color: orange; }");
  await page
    .getByRole("button", { name: "Reset project", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Restore starter project", exact: true })
    .click();
  await page.getByRole("tab", { name: "index.html", exact: true }).click();
  await expect(editor).toContainText("TODO: your name");
  await expect(page.getByText("0/3 best", { exact: true })).toBeVisible();
});

test("unfinished portfolio checks fail and syntax errors produce useful preview feedback", async ({
  page,
}) => {
  await openProjects(page);
  await page
    .getByRole("button", { name: "Check checkpoints", exact: true })
    .click();
  const results = page.getByRole("region", { name: "Checkpoint results" });
  await expect(results.getByRole("status")).toHaveText(
    "0 / 3 checkpoints passed. Keep building.",
  );
  await expect(results.getByText("NOT YET", { exact: true })).toHaveCount(3);
  await page.getByRole("tab", { name: "script.js", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Project code editor", exact: true })
    .fill("function broken( {");
  await page.getByRole("button", { name: "Run preview", exact: true }).click();
  await expect(results.getByRole("status")).toContainText(
    /Unexpected|Syntax|Invalid/i,
  );
  await expect(page.getByText("0/3 best", { exact: true })).toBeVisible();
});

test("the weather preview uses sample data and updates both city and units", async ({
  page,
}) => {
  await openProjects(page);
  await chooseProject(page, "Weather dashboard");
  await loadReference(page);
  const frame = page.frameLocator('iframe[title="Project preview"]');
  await expect(
    frame.getByText("Sample weather data · not a live forecast", {
      exact: true,
    }),
  ).toBeVisible();
  await frame.getByLabel("City", { exact: true }).selectOption("Tokyo");
  await expect(frame.locator("#temperature")).toHaveText("18°C");
  await frame.getByRole("button", { name: "Switch temperature units" }).click();
  await expect(frame.locator("#temperature")).toHaveText("64°F");
  await frame.getByRole("button", { name: "Switch temperature units" }).click();
  await frame.getByLabel("City", { exact: true }).selectOption("Reykjavik");
  await expect(frame.locator("#temperature")).toHaveText("6°C");
  await expect(frame.locator("#location-name")).toHaveText("Reykjavik");
});

test("mobile project files and preview stay inside the viewport @mobile", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Open navigation", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Guided projects", exact: true })
    .click();
  for (const project of projects) {
    await chooseProject(page, project.title);
    await loadReference(page);
    await page.getByRole("tab", { name: "script.js", exact: true }).click();
    await expect(
      page.getByRole("textbox", { name: "Project code editor", exact: true }),
    ).toBeVisible();
    const width = await page.evaluate(() => ({
      content: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
    }));
    expect(width.content).toBeLessThanOrEqual(width.viewport);
    await expect(
      page.getByTitle("Project preview", { exact: true }),
    ).toBeVisible();
  }
});

test("project previews cannot read app storage or load network resources", async ({
  page,
}) => {
  const deliveredResponses: number[] = [];
  const blockedRequests: string[] = [];
  page.on("response", (response) => {
    if (response.url().includes("/project-isolation-check"))
      deliveredResponses.push(response.status());
  });
  page.on("requestfailed", (request) => {
    if (request.url().includes("/project-isolation-check"))
      blockedRequests.push(request.failure()?.errorText ?? "unknown");
  });
  await openProjects(page);
  const editor = page.getByRole("textbox", {
    name: "Project code editor",
    exact: true,
  });
  await editor.fill(
    '<main><h1>Sandbox check</h1><p id="isolation-result">Checking isolation</p><img src="http://127.0.0.1:3000/project-isolation-check" alt="Blocked external resource"></main>',
  );
  await page.getByRole("tab", { name: "script.js", exact: true }).click();
  await editor.fill(`let storageBlocked = false;
try { localStorage.getItem('bloom-projects-v1'); } catch { storageBlocked = true; }
fetch('http://127.0.0.1:3000/project-isolation-check')
  .then(() => { document.querySelector('#isolation-result').textContent = 'Network unexpectedly available'; })
  .catch(() => { document.querySelector('#isolation-result').textContent = storageBlocked ? 'Storage and network blocked' : 'Storage unexpectedly available'; });`);
  await page.getByRole("button", { name: "Run preview", exact: true }).click();
  await expect(
    page
      .frameLocator('iframe[title="Project preview"]')
      .getByText("Storage and network blocked", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByTitle("Project preview", { exact: true }),
  ).not.toHaveAttribute("sandbox", /allow-same-origin/);
  await expect.poll(() => blockedRequests.length).toBeGreaterThan(0);
  expect(
    blockedRequests.every((reason) => /csp|blocked_by_csp/i.test(reason)),
  ).toBe(true);
  expect(deliveredResponses).toEqual([]);
});
