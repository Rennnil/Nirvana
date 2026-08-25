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