const { defineConfig } = require("cypress");
const { allureCypress } = require("allure-cypress/reporter");
const { plugin: cypressGrepPlugin } = require("@cypress/grep/plugin");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://agents.nirvanatech.com/",
    testIsolation: false,
    video: true,
    videoCompression: 32,
    videosFolder: "cypress/images-videos/videos",
    screenshotsFolder: "cypress/images-videos/screenshots",
    screenshotOnRunFailure: true,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      cypressGrepPlugin(config);

      allureCypress(on, config, {
        resultsDir: "cypress/report/allure-results",
      });

      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.name === "chrome") {
          launchOptions.args.push("--disable-blink-features=AutomationControlled");
        }
        return launchOptions;
      });

      // Runs once, before ANY spec starts — cleans previous results
      on("before:run", () => {
        const resultsDir = path.resolve("cypress/report/allure-results");
        const reportDir = path.resolve("cypress/report/allure-report");

        if (fs.existsSync(resultsDir)) {
          fs.rmSync(resultsDir, { recursive: true, force: true });
        }
        if (fs.existsSync(reportDir)) {
          fs.rmSync(reportDir, { recursive: true, force: true });
        }
        console.log("Allure results/report cleared before run.");
      });

      on("after:spec", (spec, results) => {
        if (!results || !results.video || !fs.existsSync(results.video)) return;
        const resultsDir = path.resolve("cypress/report/allure-results");
        const videoFileName = `${Date.now()}-attachment.mp4`;
        fs.copyFileSync(results.video, path.join(resultsDir, videoFileName));
      });

      // Runs once, after ALL specs finish — auto-generates the report
      on("after:run", () => {
        try {
          console.log("Generating Allure report...");
          execSync(
            "allure generate cypress/report/allure-results --clean -o cypress/report/allure-report",
            { stdio: "inherit" }
          );
          console.log("Allure report generated successfully.");
        } catch (err) {
          console.error("Failed to generate Allure report:", err.message);
        }
      });

      return config;
    },
  },
});