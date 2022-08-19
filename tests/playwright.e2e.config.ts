import { PlaywrightTestConfig } from "@playwright/test";

const defaultPlaywrightConfig: PlaywrightTestConfig = {
  // Limit the number of workers on CI, use default locally
  workers: process.env.CI ? 1 : 4,
  retries: process.env.CI ? 3 : 0,
  use: {
    headless: true,
    ignoreHTTPSErrors: true,
    video: "on-first-retry",
    screenshot: "only-on-failure",
    baseURL: "https://the-internet.herokuapp.com/",
    actionTimeout: 10000,
  },
  expect: {
    // Threshold can be from 0 to 1
    toMatchSnapshot: { threshold: 0.3 },
    timeout: 10000,
  },
  reportSlowTests: {
    max: 0,
    threshold: 45000,
  },
  reporter: [["list"], process.env.CI ? ["github"] : ["null"]],
  projects: [
    {
      name: "Chrome Stable",
      use: {
        browserName: "chromium",
        // Test against Chrome Stable channel.
        channel: "chrome",
        viewport: { width: 1600, height: 1200 },
        contextOptions: {
          bypassCSP: true, // https://github.com/microsoft/playwright/issues/7395,
          permissions: ["clipboard-read", "clipboard-write"],
        },
      },
    },
  ],
};
export default defaultPlaywrightConfig;
