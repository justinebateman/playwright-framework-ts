import { Page } from "@playwright/test";

const mockRequestByRequestPath = async (
  page: Page,
  requestPathToMatch: string | RegExp,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  responseBodyToReturn: any
) => {
  await page.route(requestPathToMatch, (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify(responseBodyToReturn),
      contentType: "application/json",
      headers: {
        "access-control-allow-origin": "*",
      },
    });
  });
};

const mockRequestByRequestPathAndBody = async (
  page: Page,
  requestPathToMatch: string | RegExp,
  requestBodyToMatch: string,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  responseBodyToReturn: any
) => {
  await page.route(requestPathToMatch, (route) => {
    const requestBodyData = route.request().postData();
    if (
      requestBodyData != null &&
      requestBodyData.includes(requestBodyToMatch)
    ) {
      route.fulfill({
        status: 200,
        body: JSON.stringify(responseBodyToReturn),
        contentType: "application/json",
        headers: {
          "access-control-allow-origin": "*",
        },
      });
    } else route.continue();
  });
};

const removeMockRequestByRequestPath = async (
  page: Page,
  requestPathToMatch: string | RegExp
) => {
  await page.unroute(requestPathToMatch);
};

export default {
  mockRequestByRequestPath,
  mockRequestByRequestPathAndBody,
  removeMockRequestByRequestPath,
};
