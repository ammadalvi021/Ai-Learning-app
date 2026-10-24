import { expect, test, type Page } from "@playwright/test";
import { challenges } from "../src/lib/challenges";

async function openLab(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Coding lab", exact: true }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Coding lab" }),
  ).toBeVisible();
}

test("a real JavaScript solution passes its tests and saves the draft and completion", async ({
  page,
}) => {
  await openLab(page);
  const editor = page.getByRole("textbox", { name: "Code editor" });
  await editor.fill(challenges[0].referenceSolution);
  await page.getByRole("button", { name: "Run tests", exact: true }).click();
  const output = page.getByRole("region", { name: "Test output" });
  await expect(output.getByRole("status")).toContainText(
    "All 4 tests passed. Challenge solved!",
  );
  await expect(output.getByText("PASS", { exact: true })).toHaveCount(4);
  await expect(page.getByText("1 / 3 solved", { exact: true })).toBeVisible();

  await page.reload();
  await page.getByRole("button", { name: "Coding lab", exact: true }).click();
  await expect(editor).toHaveValue(challenges[0].referenceSolution);
  await expect(page.getByText("1 / 3 solved", { exact: true })).toBeVisible();
  await expect(page.getByText("Solved", { exact: true })).toBeVisible();
});

test("starter code exposes failed cases and syntax errors without awarding completion", async ({
  page,
}) => {
  await openLab(page);
  const output = page.getByRole("region", { name: "Test output" });
  await page.getByRole("button", { name: "Run tests", exact: true }).click();
  await expect(output.getByRole("status")).toContainText("2 / 4 tests passed");
  await expect(output.getByText("FAIL", { exact: true })).toHaveCount(2);
  await expect(page.getByText("0 / 3 solved", { exact: true })).toBeVisible();

  await page
    .getByRole("textbox", { name: "Code editor" })
    .fill("function sumPositives( {");
  await page.getByRole("button", { name: "Run tests", exact: true }).click();
  await expect(output.getByRole("status")).toContainText("Execution stopped");
  await expect(output.getByText(/Unexpected|Syntax|Invalid/i)).toBeVisible();
  await expect(page.getByText("0 / 3 solved", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Run tests", exact: true }),
  ).toBeEnabled();
});

test("an infinite loop times out while the app remains responsive", async ({
  page,
}) => {
  await openLab(page);
  await page
    .getByRole("textbox", { name: "Code editor" })
    .fill("function sumPositives(numbers) { while (true) {} }");
  await page.getByRole("button", { name: "Run tests", exact: true }).click();
  const output = page.getByRole("region", { name: "Test output" });
  await expect(output.getByRole("status")).toContainText("Execution stopped");
  await expect(output.getByText(/Time limit exceeded/)).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Run tests", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: /Clean up usernames/ }).click();
  await expect(
    page.getByRole("heading", { name: "Clean up usernames", exact: true }),
  ).toBeVisible();
});

test("hints, challenge switching, and confirmed code reset preserve intentional edits", async ({
  page,
}) => {
  await openLab(page);
  const editor = page.getByRole("textbox", { name: "Code editor" });
  await page.getByRole("button", { name: "Need a hint?", exact: true }).click();
  await expect(page.getByText(challenges[0].hints[0])).toBeVisible();
  const draft = "function sumPositives(numbers) {\n  return 42;\n}\n";
  await editor.fill(draft);
  await page.getByRole("button", { name: /Clean up usernames/ }).click();
  await expect(editor).toHaveValue(challenges[1].starterCode);
  await editor.fill(challenges[1].referenceSolution);
  await page.getByRole("button", { name: /Sum the positives/ }).click();
  await expect(editor).toHaveValue(draft);

  await page.getByRole("button", { name: "Reset code", exact: true }).click();
  const confirmation = page.getByRole("group", { name: "Confirm code reset" });
  await confirmation
    .getByRole("button", { name: "Keep my code", exact: true })
    .click();
  await expect(editor).toHaveValue(draft);
  await page.getByRole("button", { name: "Reset code", exact: true }).click();
  await confirmation
    .getByRole("button", { name: "Restore starter code", exact: true })
    .click();
  await expect(editor).toHaveValue(challenges[0].starterCode);
  await page.getByRole("button", { name: /Clean up usernames/ }).click();
  await expect(editor).toHaveValue(challenges[1].referenceSolution);
});

for (const challenge of challenges.slice(1)) {
  test(`${challenge.title} accepts a working solution against all test cases`, async ({
    page,
  }) => {
    await openLab(page);
    await page
      .getByRole("button", { name: new RegExp(challenge.title) })
      .click();
    await page
      .getByRole("textbox", { name: "Code editor" })
      .fill(challenge.referenceSolution);
    await page.getByRole("button", { name: "Run tests", exact: true }).click();
    const output = page.getByRole("region", { name: "Test output" });
    await expect(output.getByRole("status")).toContainText(
      `All ${challenge.tests.length} tests passed. Challenge solved!`,
    );
    await expect(output.getByText("PASS", { exact: true })).toHaveCount(
      challenge.tests.length,
    );
  });
}

test("the isolated runtime cannot read app storage or send network requests", async ({
  page,
}) => {
  await openLab(page);
  const attemptedRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/lab-isolation-check"))
      attemptedRequests.push(request.url());
  });
  await page
    .getByRole("textbox", { name: "Code editor" })
    .fill(
      "async function sumPositives(numbers) {\n  await fetch('http://127.0.0.1:3000/lab-isolation-check');\n  return 8;\n}",
    );
  await page.getByRole("button", { name: "Run tests", exact: true }).click();
  const output = page.getByRole("region", { name: "Test output" });
  await expect(output.getByRole("status")).toContainText("Execution stopped");
  await expect(output.getByText(/fetch|network|load/i)).toBeVisible();
  expect(attemptedRequests).toHaveLength(0);

  await page
    .getByRole("textbox", { name: "Code editor" })
    .fill(
      "function sumPositives(numbers) { return localStorage.getItem('bloom-learning-progress-v1'); }",
    );
  await page.getByRole("button", { name: "Run tests", exact: true }).click();
  await expect(output.getByRole("status")).toContainText("Execution stopped");
  await expect(output.getByText(/localStorage|not defined/i)).toBeVisible();
});
