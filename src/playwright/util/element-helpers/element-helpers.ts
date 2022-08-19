import { expect, Locator, Page } from "@playwright/test";
import waitUntil from "async-wait-until";

async function waitForElementToBeVisible(
  element: Locator,
  options?:
    | {
        timeout?: number;
        intervalBetweenAttempts?: number;
      }
    | undefined
): Promise<void> {
  let timeout;
  let intervalBetweenAttempts;
  if (options) {
    timeout = options.timeout || 15000;
    intervalBetweenAttempts = options.intervalBetweenAttempts || 50;
  }
  await waitUntil(async () => element.isVisible(), {
    timeout: timeout,
    intervalBetweenAttempts: intervalBetweenAttempts,
  }).catch(async (e) => {
    await expect(
      element,
      "Error waiting for element to be visible"
    ).toBeVisible({ timeout: 500 });
    throw e;
  });
}

async function waitForElementToDisappear(
  element: Locator,
  options?:
    | {
        timeout?: number;
        intervalBetweenAttempts?: number;
      }
    | undefined
): Promise<void> {
  let timeout;
  let intervalBetweenAttempts;
  if (options) {
    timeout = options.timeout || 15000;
    intervalBetweenAttempts = options.intervalBetweenAttempts || 50;
  }
  await waitUntil(async () => element.isHidden(), {
    timeout: timeout,
    intervalBetweenAttempts: intervalBetweenAttempts,
  }).catch(async (e) => {
    await expect(
      element,
      "Error waiting for element to disappear"
    ).not.toBeVisible({ timeout: 500 });
    throw e;
  });
}

async function waitForElementTextToEqual(
  page: Page,
  element: string | Locator, // selector string or Locator object
  expectedText: string,
  options?:
    | {
        timeout?: number;
        intervalBetweenAttempts?: number;
      }
    | undefined
): Promise<void> {
  if (typeof element === "string") {
    await page.waitForSelector(`${element} >> text=${expectedText}`);
  } else {
    await waitUntil(
      async () => (await element.textContent())?.trim() === expectedText.trim(),
      options
    ).catch(async (e) => {
      expect(
        (await element.textContent({ timeout: 500 }))?.trim(),
        "Error waiting for element text content to equal expected text"
      ).toBe(expectedText.trim());
      throw e;
    });
  }
}

async function waitForInputElementTextValueToEqual(
  page: Page,
  element: string | Locator, // selector string or Locator object
  expectedText: string,
  options?:
    | {
        timeout?: number;
        intervalBetweenAttempts?: number;
      }
    | undefined
): Promise<void> {
  if (typeof element === "string") {
    await page.waitForFunction(
      ([elementSelectorF, expectedTextF]) => {
        const element = <HTMLInputElement>(
          document.querySelector(elementSelectorF)
        );
        if (element != null) {
          return element.value === expectedTextF;
        }
        return false;
      },
      [element, expectedText]
    );
  } else {
    await waitUntil(
      async () => (await element.inputValue()) === expectedText,
      options
    ).catch(async (e) => {
      expect(
        await element.inputValue({ timeout: 500 }),
        "Error waiting for element text input value to equal expected text"
      ).toBe(expectedText);
      throw e;
    });
  }
}

async function getElementStyleValue(
  page: Page,
  element: Locator,
  styleAttribute: string
): Promise<string> {
  const elementHandle = await element.elementHandle();
  return page.evaluate(
    ([elementHandleF, styleAttributeF]) => {
      return (
        window
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .getComputedStyle(elementHandleF)
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .getPropertyValue(styleAttributeF)
      );
    },
    [elementHandle, styleAttribute]
  );
}

async function waitForElementStyleValueToEqual(
  page: Page,
  element: Locator,
  styleAttribute: string,
  expectedValue: string,
  options?:
    | {
        timeout?: number;
        intervalBetweenAttempts?: number;
      }
    | undefined
): Promise<void> {
  const elementHandle = await element.elementHandle();

  const getStyle = async () => {
    return page.evaluate(
      ([elementHandleF, styleAttributeF]) => {
        if (elementHandleF) {
          return (
            window
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              .getComputedStyle(elementHandleF)
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              .getPropertyValue(styleAttributeF)
          );
        }
      },
      [elementHandle, styleAttribute]
    );
  };

  await waitUntil(
    async () => (await getStyle()) === expectedValue,
    options
  ).catch(async (e) => {
    console.error(
      `Error waiting for element style to equal expected. Expected: ${expectedValue} Actual: ${await getStyle()}`
    );
    throw e;
  });
}

async function waitForElementAttributeValueToEqual(
  page: Page,
  element: Locator,
  attribute: string,
  expectedValue: string,
  options?:
    | {
        timeout?: number;
        intervalBetweenAttempts?: number;
      }
    | undefined
): Promise<void> {
  await waitUntil(
    async () => (await element.getAttribute(attribute)) === expectedValue,
    options
  ).catch(async (e) => {
    console.error(
      `Error waiting for element attribute to equal expected. Expected: ${expectedValue} Actual: ${await element.getAttribute(
        attribute
      )}`
    );
    throw e;
  });
}

/**
 * @deprecated deprecated in favour of waitForElementStyleValueToEqual with "color"
 */
async function waitForElementColourToEqual(
  page: Page,
  elementSelector: string,
  expectedColour: string
): Promise<void> {
  await page.waitForFunction(
    ([elementSelectorF, expectedColourF]) => {
      return (
        window.getComputedStyle(
          <Element>document.querySelector(elementSelectorF)
        ).color === expectedColourF
      );
    },
    [elementSelector, expectedColour]
  );
}

async function removeElementsFromDom(
  page: Page,
  element: string | Locator // selector string or Locator object
): Promise<void> {
  if (typeof element === "string") {
    await page.evaluate((elementSelectorF) => {
      document.querySelectorAll(elementSelectorF).forEach((e) => e.remove());
    }, element);
  } else {
    const elementHandle = await element.elementHandle();
    await page.evaluate((elementHandleF) => {
      if (elementHandleF) elementHandleF.remove();
    }, elementHandle);
  }
}

async function scrollElementToTopOfPage(
  page: Page,
  element: string | Locator // selector string or Locator object
): Promise<void> {
  if (typeof element === "string") {
    await page.evaluate((elementSelectorF) => {
      const element = document.querySelector(elementSelectorF);
      if (element !== null) {
        element.scrollIntoView(true);
      }
    }, element);
  } else {
    const elementHandle = await element.elementHandle();
    await page.evaluate((elementHandleF) => {
      if (elementHandleF) elementHandleF.scrollIntoView(true);
    }, elementHandle);
  }
}

export default {
  waitForElementToBeVisible,
  waitForElementToDisappear,
  waitForElementTextToEqual,
  waitForInputElementTextValueToEqual,
  getElementStyleValue,
  waitForElementStyleValueToEqual,
  waitForElementAttributeValueToEqual,
  waitForElementColourToEqual,
  removeElementsFromDom,
  scrollElementToTopOfPage,
};
