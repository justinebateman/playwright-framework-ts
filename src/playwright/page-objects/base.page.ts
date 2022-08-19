import test, { expect, Page } from "@playwright/test";
import IPage from "./IPage";
import waitUntil from "async-wait-until";

export default abstract class BasePage implements IPage {
  readonly page: Page;

  abstract readonly url: string;

  protected constructor(page: Page) {
    this.page = page;
  }

  async goto(expectedUrl?: string): Promise<void> {
    const urlToLoad = expectedUrl || this.url;

    const doGoTo = async () => {
      await this.page.goto(urlToLoad);
      await this.page.waitForURL(urlToLoad);
      await this.waitForPageToLoad({
        url: expectedUrl,
        waitForLoadState: true,
      });
    };
    if (process.env.TEST_WORKER_INDEX)
      await test.step(`Navigating to ${urlToLoad}`, doGoTo);
    else await doGoTo();
  }

  async waitForAllImagesToLoad(): Promise<void> {
    await this.page.waitForFunction(() => {
      return Array.from(document.images).every((i) => i.complete);
    });
  }

  async waitForPageToLoad(
    options?:
      | {
          url?: string;
          waitForLoadState?: boolean;
          condition?: "contains" | "endsWith";
        }
      | undefined
  ): Promise<void> {
    // if url is specified then use it, otherwise use page object url
    const expectedUrl = options && options.url ? options.url : this.url;
    // default to checking url endsWith if user hasn't specified options
    const condition =
      options && options.condition ? options.condition : "endsWith";

    if (condition === "endsWith") {
      // wait until the current url ends with our expected url
      await waitUntil(() => this.page.url().endsWith(expectedUrl), {
        timeout: 15000,
      }).catch(async (e) => {
        console.error(
          `Timed out waiting for url to end with ${expectedUrl} \nActual url was ${this.page.url()} \n`,
          e
        );
        throw e;
      });
    } else if (condition === "contains") {
      // wait until the current url contains our expected url
      await waitUntil(() => this.page.url().includes(expectedUrl), {
        timeout: 15000,
      }).catch(async (e) => {
        console.error(
          `Timed out waiting for url to contain ${expectedUrl} \nActual url was ${this.page.url()} \n`,
          e
        );
        throw e;
      });
    }

    // if we passed in the options.waitForLoadState param as true then run additional checks
    if (options && options.waitForLoadState) {
      await this.page.waitForLoadState("domcontentloaded");
      await this.page.waitForLoadState("networkidle");
      await this.waitForAllImagesToLoad();
    }
  }

  async assertCurrentPageUrl(expectedUrl?: string): Promise<void> {
    const urlToExpect = expectedUrl || this.url;

    const doAssertion = async () => {
      await this.page.waitForLoadState("domcontentloaded");
      expect(
        this.page.url(),
        "Current page url should contain expected string"
      ).toContain(urlToExpect);
    };
    if (process.env.TEST_WORKER_INDEX)
      await test.step(`Assert current url matches expected`, doAssertion);
    else await doAssertion();
  }
}
