import { test, expect } from "@playwright/test";
import { browserHelpers } from "../../src/playwright/util";

test.describe.configure({ mode: "parallel" });

test.describe("Browser Helpers test suite", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await browserHelpers.setLocalStorageItem(page, "jbpw-test", "pass");
  });

  test("get local storage works", async ({ page }) => {
    const localStorage = await browserHelpers.getLocalStorage(page);
    expect(localStorage).not.toBeNull();
  });

  test("set and get local storage item works", async ({ page }) => {
    const localStorageItem = await browserHelpers.getLocalStorageItem(
      page,
      "jbpw-test"
    );
    expect(localStorageItem).toBe("pass");
  });

  test("get local storage item that starts with works", async ({ page }) => {
    const localStorageItem =
      await browserHelpers.getLocalStorageItemThatStartsWith(page, "jbpw");
    expect(localStorageItem).toBe("pass");
  });

  test("remove local storage item works", async ({ page }) => {
    await browserHelpers.removeLocalStorageItem(page, "jbpw-test");
    const localStorageItem = await browserHelpers.getLocalStorageItem(
      page,
      "jbpw-test"
    );
    expect(localStorageItem).toBe("");
  });
});
