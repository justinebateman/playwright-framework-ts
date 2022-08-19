import { test, expect } from "@playwright/test";
import { elementHelpers } from "../../src/playwright/util";

test.describe.configure({ mode: "parallel" });

test.describe("Element Helpers test suite", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
  });

  test("Wait For Element To Be Visible works for hidden elements", async ({
    page,
  }) => {
    await page.goto("/dynamic_loading/1", { waitUntil: "networkidle" });
    await page.locator("div#start button").click();
    await elementHelpers.waitForElementToBeVisible(
      page.locator("div#finish h4"),
      { timeout: 30000 }
    );
    await expect(page.locator("div#finish h4")).toBeVisible();
  });

  test("Wait For Element To Be Visible works for elements not yet in DOM", async ({
    page,
  }) => {
    await page.goto("/dynamic_loading/2", { waitUntil: "networkidle" });
    await page.locator("div#start button").click();
    await elementHelpers.waitForElementToBeVisible(
      page.locator("div#finish h4"),
      { timeout: 30000 }
    );
    await expect(page.locator("div#finish h4")).toBeVisible();
  });

  test("Wait For Element To Disappear works", async ({ page }) => {
    await page.goto("/add_remove_elements/", { waitUntil: "networkidle" });
    await page.locator("div.example button").click();
    await elementHelpers.waitForElementToBeVisible(
      page.locator("div#elements button"),
      { timeout: 30000 }
    );
    await expect(page.locator("div#elements button")).toBeVisible();
    await page.locator("div#elements button").click();
    await elementHelpers.waitForElementToDisappear(
      page.locator("div#elements button"),
      { timeout: 30000 }
    );
    await expect(page.locator("div#elements button")).not.toBeVisible();
  });

  test("Wait For Element Text To Equal works for locator", async ({ page }) => {
    await page.goto("/key_presses", { waitUntil: "networkidle" });
    await page.locator("input#target").type("T");
    await elementHelpers.waitForElementTextToEqual(
      page,
      page.locator("p#result"),
      "You entered: T"
    );
    await expect(page.locator("p#result")).toHaveText("You entered: T");
  });

  test("Wait For Element Text To Equal works for selector", async ({
    page,
  }) => {
    await page.goto("/key_presses", { waitUntil: "networkidle" });
    await page.locator("input#target").type("T");
    await elementHelpers.waitForElementTextToEqual(
      page,
      "p#result",
      "You entered: T"
    );
    await expect(page.locator("p#result")).toHaveText("You entered: T");
  });

  test("Wait For Input element text To Equal works for locator", async ({
    page,
  }) => {
    await page.goto("/inputs", { waitUntil: "networkidle" });
    await page.locator("input").type("1234");
    await elementHelpers.waitForInputElementTextValueToEqual(
      page,
      page.locator("input"),
      "1234"
    );
    await expect(page.locator("input")).toHaveValue("1234");
  });

  test("Wait For Input element text To Equal works for selector", async ({
    page,
  }) => {
    await page.goto("/inputs", { waitUntil: "networkidle" });
    await page.locator("input").type("1234");
    await elementHelpers.waitForInputElementTextValueToEqual(
      page,
      "input",
      "1234"
    );
    await expect(page.locator("input")).toHaveValue("1234");
  });

  test("Wait For element style value To equal works", async ({ page }) => {
    await page.goto("/dynamic_controls", { waitUntil: "networkidle" });
    await page.locator("form#input-example button").click();
    await elementHelpers.waitForElementStyleValueToEqual(
      page,
      page.locator("form#input-example input"),
      "background-color",
      "rgb(255, 255, 255)"
    );
    expect(
      await elementHelpers.getElementStyleValue(
        page,
        page.locator("form#input-example input"),
        "background-color"
      )
    ).toBe("rgb(255, 255, 255)");
  });

  test("Wait For element attribute to equal works", async ({ page }) => {
    await page.goto("/checkboxes", { waitUntil: "networkidle" });
    await page.locator("form#checkboxes input").first().click();
    await elementHelpers.waitForElementAttributeValueToEqual(
      page,
      page.locator("form#checkboxes input").first(),
      "checked",
      ""
    );
    expect(
      await page
        .locator("form#checkboxes input")
        .first()
        .getAttribute("checked")
    ).toBe("");
  });

  test("Remove element from dom works for locator", async ({ page }) => {
    await page.goto("/forgot_password", { waitUntil: "networkidle" });
    const submitButton = page.locator("button#form_submit");
    await elementHelpers.removeElementsFromDom(page, submitButton);
    await expect(submitButton).not.toBeVisible();
  });

  test("Remove element from dom works for selector", async ({ page }) => {
    await page.goto("/forgot_password", { waitUntil: "networkidle" });
    const submitButton = page.locator("button#form_submit");
    await elementHelpers.removeElementsFromDom(page, "button#form_submit");
    await expect(submitButton).not.toBeVisible();
  });

  test("Scroll element to top of page works for locator", async ({ page }) => {
    await page.goto("/infinite_scroll", { waitUntil: "networkidle" });
    const paragraphs = await page.locator("div.jscroll-added");
    await page.evaluate("window.scroll(0, 300)");
    await page.waitForTimeout(500);
    await page.waitForFunction("window.scrollY != 0");
    await elementHelpers.scrollElementToTopOfPage(page, paragraphs.first());
    await page.waitForTimeout(500);
    await expect(paragraphs.first()).toBeVisible();
  });

  test("Scroll element to top of page works for selector", async ({ page }) => {
    await page.goto("/infinite_scroll", { waitUntil: "networkidle" });
    const paragraphs = await page.locator("div.jscroll-added");
    await page.evaluate("window.scroll(0, 300)");
    await page.waitForTimeout(500);
    await page.waitForFunction("window.scrollY != 0");
    await elementHelpers.scrollElementToTopOfPage(page, "div.jscroll-added");
    await page.waitForTimeout(500);
    await expect(paragraphs.first()).toBeVisible();
  });
});
