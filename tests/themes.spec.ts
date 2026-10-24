import { expect, test, type Page } from "@playwright/test";

const interfaces = [
  { id: "ember", name: "Ember glass" },
  { id: "neon", name: "Neon glass" },
  { id: "matrix", name: "Matrix" },
  { id: "robot", name: "Robot" },
  { id: "nova", name: "Nova" },
];

async function openAppearance(page: Page) {
  await page
    .getByRole("button", { name: "Customize theme", exact: true })
    .click();
  await expect(
    page.getByRole("group", { name: "Choose your interface", exact: true }),
  ).toBeVisible();
}

test("all five interfaces apply and retain the selected radio after reload", async ({
  page,
}) => {
  await page.goto("/");
  await openAppearance(page);

  for (const option of interfaces) {
    await page.getByRole("radio", { name: option.name, exact: true }).check();
    await expect(page.locator("html")).toHaveAttribute("data-theme", option.id);

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", option.id);
    await openAppearance(page);
    await expect(
      page.getByRole("radio", { name: option.name, exact: true }),
    ).toBeChecked();
  }
});

test("an unknown saved interface falls back to Ember glass", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("bloom-theme-v1", "not-a-real-theme");
  });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "ember");
  await openAppearance(page);
  await expect(
    page.getByRole("radio", { name: "Ember glass", exact: true }),
  ).toBeChecked();

  await page.getByRole("radio", { name: "Matrix", exact: true }).check();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "matrix");
});

test("switching interfaces preserves saved AI progress from the original app", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const marker = "bloom-test-legacy-progress";
    if (!sessionStorage.getItem(marker)) {
      localStorage.setItem(
        "bloom-learning-progress-v1",
        JSON.stringify({
          completed: ["what-is-ai"],
          scores: { "what-is-ai": 100 },
          completionDates: { "what-is-ai": "2026-10-23" },
        }),
      );
      sessionStorage.setItem(marker, "true");
    }
  });
  await page.goto("/");
  await page.getByRole("button", { name: /AI foundations.*6 lessons/ }).click();

  const completed = page
    .getByText("Lessons completed", { exact: true })
    .locator("..");
  await expect(completed).toContainText("1 / 6");
  await expect(
    page.getByText("Best quiz average", { exact: true }).locator(".."),
  ).toContainText("100%");
  await page
    .getByRole("button", { name: "Use Robot theme", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "robot");

  await page.reload();
  await page.getByRole("button", { name: /AI foundations.*6 lessons/ }).click();
  await expect(completed).toContainText("1 / 6");
  await page.getByRole("button", { name: "My progress", exact: true }).click();
  await expect(
    page.getByRole("progressbar", { name: "Course completion" }),
  ).toHaveAttribute("aria-valuenow", "17");
  await expect(
    page.getByRole("button", { name: /What is AI\?.*Completed.*Best: 100%/ }),
  ).toBeVisible();
});

test("theme changes synchronize between open tabs", async ({
  page,
  context,
}) => {
  await page.goto("/");
  const otherTab = await context.newPage();
  await otherTab.goto("/");
  await page
    .getByRole("button", { name: "Use Neon glass theme", exact: true })
    .click();
  await expect(otherTab.locator("html")).toHaveAttribute("data-theme", "neon");
  await otherTab
    .getByRole("button", { name: "Use Nova theme", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "nova");
  await otherTab.close();
});

test("blocked browser storage still allows temporary theme changes", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    for (const method of ["getItem", "setItem", "removeItem"]) {
      Object.defineProperty(Storage.prototype, method, {
        configurable: true,
        value() {
          throw new DOMException("Storage blocked", "SecurityError");
        },
      });
    }
  });
  await page.goto("/");
  await openAppearance(page);
  await page.getByRole("radio", { name: "Robot", exact: true }).check();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "robot");
  await expect(
    page.getByText(
      "Browser storage is unavailable. This theme lasts while this page stays open.",
      { exact: true },
    ),
  ).toBeVisible();

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "ember");
  expect(errors).toEqual([]);
});

test("mobile appearance keeps every theme within the viewport @mobile", async ({
  page,
}) => {
  await page.goto("/");
  await openAppearance(page);

  for (const option of interfaces) {
    const radio = page.getByRole("radio", { name: option.name, exact: true });
    await radio.check();
    await expect(radio).toBeChecked();
    await expect(page.locator("html")).toHaveAttribute("data-theme", option.id);
    const sizes = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(sizes.content).toBeLessThanOrEqual(sizes.viewport);
  }
});
