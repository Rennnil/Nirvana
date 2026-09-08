const { defineConfig } = require("cypress");
const { allureCypress } = require("allure-cypress/reporter");
const { plugin: cypressGrepPlugin } = require("@cypress/grep/plugin");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://agents.staging.nirvanatech.com/",
    pageLoadTimeout: 120000,
    testIsolation: false,
    viewportWidth: 1920,
    viewportHeight: 1080,
    defaultCommandTimeout: 12000,

    video: true,
    videoCompression: 32,
    videosFolder: "cypress/images-videos/videos",

    screenshotsFolder: "cypress/images-videos/screenshots",
    screenshotOnRunFailure: true,

    retries: {
      runMode: 0,
      openMode: 0,
    },

    setupNodeEvents(on, config) {
      cypressGrepPlugin(config);

      allureCypress(on, config, {
        resultsDir: "cypress/report/allure-results",
      });

      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.name === "chrome") {
          launchOptions.args.push(
            "--disable-blink-features=AutomationControlled"
          );
        }
        return launchOptions;
      });

      // Clear previous Allure results before execution
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

      // Copy videos to Allure attachments
      on("after:spec", (spec, results) => {
        try {
          if (results?.video && fs.existsSync(results.video)) {
            const destinationPath = path.join(
              "cypress/report/allure-results",
              `${Date.now()}-attachment.mp4`
            );

            fs.copyFileSync(results.video, destinationPath);
            console.log(`Video copied: ${destinationPath}`);
          } else {
            console.log(`No video found for spec: ${spec.relative}`);
          }
        } catch (err) {
          console.log(`Video copy skipped: ${err.message}`);
        }
      });

      // Generate Allure report after execution
      on("after:run", () => {
        try {
          console.log("Generating Allure report...");

          execSync(
            "npx allure generate cypress/report/allure-results --clean -o cypress/report/allure-report",
            { stdio: "inherit" }
          );

          console.log("Allure report generated successfully.");
        } catch (err) {
          console.error(
            "Failed to generate Allure report:",
            err.message
          );
        }
      });

      return config;
    },
  },
});