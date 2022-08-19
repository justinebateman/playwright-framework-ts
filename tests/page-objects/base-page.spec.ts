import { test, Page } from "@playwright/test";
import { BasePage, IPage } from "../../src";

test.describe.configure({ mode: "parallel" });

test.describe("Base Page Object test suite", () => {
  let testPage: TestPage;
  test.beforeEach(async ({ page }) => {
    testPage = new TestPage(page);
  });

  test("navigate to page object url works", async () => {
    await testPage.goto();
    await testPage.assertCurrentPageUrl();
  });

  test("navigate to specified url works", async () => {
    await testPage.goto("/checkboxes");
    await testPage.assertCurrentPageUrl("/checkboxes");
  });

  test("wait for page to load and end with url works", async () => {
    await testPage.goto();
    await testPage.waitForPageToLoad({ condition: "endsWith", url: "puts" });
    await testPage.assertCurrentPageUrl();
  });

  test("wait for page to load and contain url works", async () => {
    await testPage.goto();
    await testPage.waitForPageToLoad({ condition: "contains", url: "put" });
    await testPage.assertCurrentPageUrl();
  });
});

class TestPage extends BasePage implements IPage {
  readonly page: Page;

  readonly url: string = "/inputs";

  constructor(page: Page) {
    super(page);
    this.page = page;
  }
}
