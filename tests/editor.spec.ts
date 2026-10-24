import { expect, test, type Page, type Locator } from "@playwright/test";
import { challenges } from "../src/lib/challenges";

async function openLab(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Coding lab", exact: true }).click();
  const editor = page.getByRole("textbox", {
    name: "Code editor",
    exact: true,
  });
  await expect(editor).toBeVisible();
  return editor;
}

async function source(editor: Locator) {
  return (await editor.innerText()).replace(/\n+$/, "");
}

test("the editor highlights JavaScript and diagnoses syntax errors as code changes", async ({
  page,
}) => {
  const editor = await openLab(page);
  await editor.fill("const answer = 42;");
  const keyword = editor.locator("span").filter({ hasText: /^const$/ });
  await expect(keyword).toBeVisible();
  const color = await keyword.evaluate((node) => getComputedStyle(node).color);
  const plainColor = await editor.evaluate(
    (node) => getComputedStyle(node).color,
  );
  expect(color).not.toBe(plainColor);
  await expect(page.locator(".editor-diagnostics")).toContainText(
    "No syntax issues",
  );

  await editor.fill("function broken( {");
  await expect(page.locator(".editor-diagnostics")).toContainText(
    /\d+ syntax issue/,
  );
  await expect(page.locator(".cm-lintRange-error").first()).toBeVisible();
  await editor.fill("function fixed() { return 42; }");
  await expect(page.locator(".editor-diagnostics")).toContainText(
    "No syntax issues",
  );
  await expect(page.locator(".cm-lintRange-error")).toHaveCount(0);
});

test("autocomplete inserts a real JavaScript completion and bracket pairs close together", async ({
  page,
}) => {
  const editor = await openLab(page);
  await editor.fill("con");
  await editor.press("Control+Space");
  const completion = page.getByRole("option", { name: /console\.log/ });
  await expect(completion).toBeVisible();
  await completion.click();
  await expect.poll(() => source(editor)).toBe("console.log()");

  await editor.fill("");
  await editor.pressSequentially("sum(");
  await expect.poll(() => source(editor)).toBe("sum()");
  await expect(page.locator(".cm-matchingBracket")).toHaveCount(2);
});

test("editor history supports undo and the run shortcut uses the latest source", async ({
  page,
}) => {
  const editor = await openLab(page);
  await editor.fill(challenges[0].referenceSolution);
  await editor.press("Control+Enter");
  await expect(
    page.getByRole("region", { name: "Test output" }).getByRole("status"),
  ).toContainText("All 4 tests passed");

  await editor.fill("const value = 1;");
  await editor.press("End");
  await editor.pressSequentially("x");
  await expect.poll(() => source(editor)).toBe("const value = 1;x");
  await editor.press("Control+z");
  await expect.poll(() => source(editor)).not.toContain(";x");
});

test("challenge search and filters narrow twenty exercises and recover empty results", async ({
  page,
}) => {
  await openLab(page);
  const list = page.getByRole("navigation", { name: "Coding challenges" });
  await expect(list.getByRole("button")).toHaveCount(challenges.length);
  await page
    .getByRole("textbox", { name: "Search challenges" })
    .fill("sum the positives");
  await expect(list.getByRole("button")).toHaveCount(1);
  await expect(
    list.getByRole("button", { name: /Sum the positives/ }),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "Challenge difficulty" })
    .selectOption("Intermediate");
  await expect(
    page.getByText("No challenges match your filters.", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Show all challenges", exact: true })
    .click();
  await expect(list.getByRole("button")).toHaveCount(challenges.length);
  await page
    .getByRole("combobox", { name: "Challenge category" })
    .selectOption("Strings");
  await expect(list.getByRole("button")).toHaveCount(
    challenges.filter((challenge) => challenge.category === "Strings").length,
  );
});

test("Tab exits the code editor so keyboard users can reach the next control", async ({
  page,
}) => {
  const editor = await openLab(page);
  await editor.click();
  await editor.press("Tab");
  await expect(editor).not.toBeFocused();
  await expect(
    page.getByRole("button", { name: "Reset code", exact: true }),
  ).toBeFocused();
});
