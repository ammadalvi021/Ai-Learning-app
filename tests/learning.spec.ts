import { expect, test, type Page } from "@playwright/test";
import { codingLessons as lessons } from "../src/lib/course";

async function completeFirstLesson(page: Page) {
  await page.getByRole("button", { name: "Start your first lesson" }).click();
  for (const question of lessons[0].quiz) {
    await page
      .getByRole("radio", {
        name: question.options[question.correctIndex],
        exact: true,
      })
      .check();
  }
  await page.getByRole("button", { name: "Check my answers" }).click();
  const result = page
    .getByRole("status")
    .filter({ hasText: "Lesson complete!" });
  await expect(result).toBeVisible();
  return result;
}

test("a completed lesson and quiz score survive a page reload", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start your first lesson" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: lessons[0].title }),
  ).toBeVisible();

  const submit = page.getByRole("button", { name: "Check my answers" });
  await expect(submit).toBeDisabled();
  for (const question of lessons[0].quiz) {
    await page
      .getByRole("radio", {
        name: question.options[question.correctIndex],
        exact: true,
      })
      .check();
  }
  await submit.click();
  await expect(page.getByRole("status")).toContainText("Lesson complete!");
  await page
    .getByRole("button", { name: "Back to my learning", exact: true })
    .click();

  const completedStat = page
    .getByText("Lessons completed", { exact: true })
    .locator("..");
  await expect(completedStat).toContainText("1 / 6");
  await expect(
    page.getByRole("button", { name: "Continue learning", exact: true }),
  ).toBeVisible();

  await page.reload();
  await expect(completedStat).toContainText("1 / 6");
  await expect(page.getByText("100%", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "My progress", exact: true }).click();
  await expect(
    page.getByRole("progressbar", { name: "Course completion" }),
  ).toHaveAttribute("aria-valuenow", "17");
  await expect(
    page.getByRole("button", {
      name: /Variables & values.*Completed.*Best: 100%/,
    }),
  ).toBeVisible();
});

test("incorrect answers give feedback and can be retried without completing the lesson", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start your first lesson" }).click();

  for (const question of lessons[0].quiz) {
    const incorrectIndex =
      (question.correctIndex + 1) % question.options.length;
    await page
      .getByRole("radio", {
        name: question.options[incorrectIndex],
        exact: true,
      })
      .check();
  }
  await page.getByRole("button", { name: "Check my answers" }).click();
  await expect(page.getByRole("status")).toContainText("0% — you’re learning");
  for (const question of lessons[0].quiz) {
    await expect(
      page.getByText(question.explanation, { exact: true }),
    ).toBeVisible();
  }

  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Check my answers" }),
  ).toBeDisabled();
  await expect(page.getByRole("radio").first()).not.toBeChecked();
  await page
    .getByRole("button", { name: "Back to learning", exact: true })
    .click();
  await expect(
    page.getByText("Lessons completed", { exact: true }).locator(".."),
  ).toContainText("0 / 6");
  await expect(
    page.getByRole("button", { name: "Start your first lesson" }),
  ).toBeVisible();
});

test("lesson filters and search handle empty results and recover to the full course", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Completed", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Nothing here just yet" }),
  ).toBeVisible();
  await expect(
    page.getByText("Complete your first lesson to see it here.", {
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Show all lessons" }).click();

  const search = page.getByRole("textbox", { name: "Search lessons" });
  await search.fill("arrays");
  await expect(
    page.getByRole("button", { name: /Arrays & iteration/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Variables & values/ }),
  ).toHaveCount(0);
  await search.fill("no-matching-lesson-9876");
  await expect(
    page.getByRole("heading", { name: "No lessons found" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  await expect(search).toHaveValue("");
  for (const lesson of lessons) {
    await expect(
      page.getByRole("button", {
        name: new RegExp(lesson.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      }),
    ).toBeVisible();
  }
});

test("mobile navigation opens, changes views, and keeps content within the viewport @mobile", async ({
  page,
}) => {
  await page.goto("/");
  const menu = page.getByRole("button", {
    name: "Open navigation",
    exact: true,
  });
  await expect(menu).toBeVisible();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("button", { name: "My learning", exact: false }).click();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Your next skill\s+starts here\./,
    }),
  ).toBeVisible();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(
    page.getByRole("button", { name: "Close navigation", exact: true }),
  ).toHaveCount(0);

  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);

  await page.getByRole("button", { name: /Variables & values/ }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: lessons[0].title }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Back to learning", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Your next skill\s+starts here\./,
    }),
  ).toBeVisible();
});

test("resetting progress requires confirmation and stays cleared after reload", async ({
  page,
}) => {
  await page.goto("/");
  await completeFirstLesson(page);
  await page
    .getByRole("button", { name: "Back to my learning", exact: true })
    .click();
  await page.getByRole("button", { name: "My progress", exact: true }).click();
  const completion = page.getByRole("progressbar", {
    name: "Course completion",
  });
  await expect(completion).toHaveAttribute("aria-valuenow", "17");

  await page
    .getByRole("button", { name: "Reset my progress", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog
    .getByRole("button", { name: "Keep my progress", exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
  await expect(completion).toHaveAttribute("aria-valuenow", "17");

  await page
    .getByRole("button", { name: "Reset my progress", exact: true })
    .click();
  await dialog
    .getByRole("button", { name: "Reset progress", exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
  await expect(completion).toHaveAttribute("aria-valuenow", "0");
  await expect(
    page.getByText("Lessons completed", { exact: true }).locator(".."),
  ).toContainText("0 / 6");

  await page.reload();
  await expect(
    page.getByText("Lessons completed", { exact: true }).locator(".."),
  ).toContainText("0 / 6");
  await expect(
    page.getByRole("button", { name: "Start your first lesson" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "My progress", exact: true }).click();
  await expect(completion).toHaveAttribute("aria-valuenow", "0");
  await expect(page.getByRole("button", { name: /Best: 100%/ })).toHaveCount(0);
});

test("corrupt saved progress recovers to a usable course and can save a fresh result", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    const marker = "bloom-test-corrupt-progress-seeded";
    if (!sessionStorage.getItem(marker)) {
      localStorage.setItem("bloom-learning-progress-v1", "{badJSON");
      sessionStorage.setItem(marker, "true");
    }
  });

  await page.goto("/");
  const completedStat = page
    .getByText("Lessons completed", { exact: true })
    .locator("..");
  await expect(completedStat).toContainText("0 / 6");
  await completeFirstLesson(page);
  await page
    .getByRole("button", { name: "Back to my learning", exact: true })
    .click();
  await expect(completedStat).toContainText("1 / 6");
  await page.reload();
  await expect(completedStat).toContainText("1 / 6");
  expect(errors).toEqual([]);
});

test("blocked browser storage keeps session progress and explains that it is temporary", async ({
  page,
}) => {
  await page.addInitScript(() => {
    for (const method of ["getItem", "setItem", "removeItem"]) {
      Object.defineProperty(Storage.prototype, method, {
        configurable: true,
        value() {
          throw new DOMException("Browser storage is blocked", "SecurityError");
        },
      });
    }
  });

  await page.goto("/");
  const warning = page
    .getByRole("status")
    .filter({ hasText: /^Browser storage is unavailable/i });
  await expect(warning).toBeVisible();
  const result = await completeFirstLesson(page);
  await expect(result).toContainText(/session|temporar/i);
  await expect(result).not.toContainText("saved in this browser");
  await expect(warning).toBeVisible();

  await page
    .getByRole("button", { name: "Back to my learning", exact: true })
    .click();
  const completedStat = page
    .getByText("Lessons completed", { exact: true })
    .locator("..");
  await expect(completedStat).toContainText("1 / 6");
  await page.reload();
  await expect(warning).toBeVisible();
  await expect(completedStat).toContainText("0 / 6");
});

test("mobile keyboard navigation excludes the closed sidebar and Escape restores the trigger @mobile", async ({
  page,
}) => {
  await page.goto("/");
  const menu = page.getByRole("button", {
    name: "Open navigation",
    exact: true,
  });
  const navigation = page.getByRole("navigation", {
    name: "Main navigation",
    includeHidden: true,
  });
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(navigation).not.toBeVisible();
  const closedSidebarAcceptsFocus = await navigation.evaluate((element) => {
    element.querySelector("button")?.focus();
    return element.contains(document.activeElement);
  });
  expect(closedSidebarAcceptsFocus).toBe(false);

  await menu.focus();
  await page.keyboard.press("Enter");
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await expect(navigation).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator(".sidebar")
        .evaluate((element) => element.contains(document.activeElement)),
    )
    .toBe(true);

  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(navigation).not.toBeVisible();
  await expect(menu).toBeFocused();
});
