import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import LoginLocators from "../locators/LoginLocators";
import DashboardLocators from "../locators/DashboardLocators";

Cypress.Commands.add("freshLogin", (email, password, expectedName) => {
  cy.log("Clearing all session state to force fresh login");
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });

  LoginPage.visit();
  LoginPage.verifyLoginHeadingVisible();
  LoginPage.login(email, password);
  DashboardPage.verifyAgentNameVisible(expectedName);
});

Cypress.Commands.add("loginIfNeeded", (email, password, expectedName) => {
  LoginPage.visit();

  cy.get("body", { timeout: 15000 })
    .should(($body) => {
      const hasLogin = $body.find(LoginLocators.loginHeading).length > 0;
      const hasDashboard = $body.find(DashboardLocators.agentNameText).length > 0;
      expect(hasLogin || hasDashboard, "login form or dashboard rendered").to.be.true;
    })
    .then(($body) => {
      const isLoginPageShown = $body.find(LoginLocators.loginHeading).length > 0;

      if (isLoginPageShown) {
        cy.log("Login page shown — performing full login");
        LoginPage.verifyLoginHeadingVisible();
        LoginPage.login(email, password);
      } else {
        cy.log("Already authenticated via Clerk session — skipping login form");
      }
    });

  DashboardPage.verifyAgentNameVisible(expectedName);
});

export default LoginPage;