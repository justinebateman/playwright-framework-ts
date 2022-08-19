import { Page } from "@playwright/test";

async function getLocalStorage(page: Page): Promise<Storage> {
  return page.evaluate(() => {
    return window.localStorage;
  });
}

async function setLocalStorageItem(
  page: Page,
  key: string,
  value: string
): Promise<void> {
  await page.evaluate(
    ([k, v]) => {
      window.localStorage.setItem(k, v);
    },
    [key, value]
  );
}

async function getLocalStorageItem(page: Page, key: string): Promise<string> {
  const localStorageItemValue = await page.evaluate(
    ([k]) => {
      return window.localStorage.getItem(k);
    },
    [key]
  );
  return localStorageItemValue ?? "";
}

async function getLocalStorageItemThatStartsWith(
  page: Page,
  keyToSearchFor: string
): Promise<string> {
  const localStorage = await getLocalStorage(page);

  const localStorageItem =
    Object.keys(localStorage)
      .filter((key) => key.startsWith(keyToSearchFor))
      .map((key) => localStorage[key]) || [];
  return localStorageItem[0] ?? "";
}

async function removeLocalStorageItem(page: Page, key: string): Promise<void> {
  await page.evaluate(
    ([k]) => {
      window.localStorage.removeItem(k);
    },
    [key]
  );
}

// note that you must add browser permissions for "clipboard-read" and "clipboard-write" to your playwright config
async function getClipBoardText(page: Page): Promise<string> {
  return page.evaluate(() => navigator.clipboard.readText());
}

async function scrollFullLengthOfPage(page: Page): Promise<void> {
  // Get the height of the rendered page
  const bodyHandle = page.locator("body");
  const bodyBoundingBox = await bodyHandle.boundingBox();
  const height = bodyBoundingBox?.height;

  // Scroll one viewport at a time, pausing to let content load
  const viewportHeight = page.viewportSize()?.height;
  let viewportIncr = 0;
  if (viewportHeight && height) {
    while (viewportIncr + viewportHeight < height) {
      await page.evaluate((_viewportHeight) => {
        window.scrollBy(0, _viewportHeight);
      }, viewportHeight);
      await page.waitForTimeout(20);
      viewportIncr += viewportHeight;
    }
  }
}

async function scrollToTopOfPage(page: Page): Promise<void> {
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
}

export default {
  getLocalStorage,
  setLocalStorageItem,
  getLocalStorageItem,
  getLocalStorageItemThatStartsWith,
  removeLocalStorageItem,
  getClipBoardText,
  scrollFullLengthOfPage,
  scrollToTopOfPage,
};
