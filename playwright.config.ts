import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests",
  testMatch: ["**/*.spec.ts"],
  timeout: 90_000,
  expect: { timeout: 10_000 },
  retries: isCI ? 2 : 0,

  // Reporter léger en CI, verbeux en local
  reporter: isCI
    ? [["html", { open: "never" }], ["github"]]
    : [["list"], ["html", { open: "never" }]],

  // Réduit fortement la taille du zip en CI
  use: {
    baseURL: "https://automationexercise.com",
    trace: isCI ? "retain-on-failure" : "on-first-retry",
    screenshot: "only-on-failure",
    video: isCI ? "off" : "retain-on-failure",
  },

  // (optionnel) Répertoire des artefacts; facile à zipper/ignorer
  outputDir: "test-results",

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        headless: isCI ? true : false,
        launchOptions: isCI ? {} : { slowMo: 200 },
        channel: "chromium",
      },
    },
  ],
});
