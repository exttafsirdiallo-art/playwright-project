import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests",
  testMatch: ["**/*.spec.ts"],
  timeout: 90_000,
  expect: { timeout: 10_000 },
  retries: isCI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: "https://automationexercise.com",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        headless: isCI ? true : false, // 👈 headless en CI uniquement
        launchOptions: isCI ? {} : { slowMo: 200 }, // 👈 slowMo seulement en local
        channel: "chromium",
      },
    },
  ],
});
