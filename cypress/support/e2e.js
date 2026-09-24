import "allure-cypress";
import "./commands";
import "cypress-real-events";

const { register: registerCypressGrep } = require("@cypress/grep");
registerCypressGrep();

afterEach(function () {
  const specName = Cypress.spec.name;
  const videoPath = `cypress/images-videos/videos/${specName}.mp4`;
  cy.log(`📹 Video Location: ${videoPath}`);
});

Cypress.on("uncaught:exception", (err) => {
  if (err.message.includes("removeChild") || err.message.includes("insertBefore")) {
    return false; // tells Cypress: ignore this specific error, don't fail the test
  }
});