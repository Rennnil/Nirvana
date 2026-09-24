import LoginPage from "../pages/AgentApp/NonFleet/LoginPage";
import UnderwriterPage from "../pages/UnderwriterApp/Fleet/UnderwriterPage";
import DashboardPage from "../pages/AgentApp/NonFleet/DashboardPage";
import LoginLocators from "../locators/AgentApp/NonFleet/LoginLocators";
import UnderwriterLocators from "../locators/UnderwriterApp/Fleet/UnderwriterLocators";
import DashboardLocators from "../locators/AgentApp/NonFleet/DashboardLocators";

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


Cypress.Commands.add("getAuthToken", () => {
  cy.intercept("GET", "**/me").as("meCall");

  cy.window().then((win) => {
    win.location.reload();
  });

  return cy.wait("@meCall").then((interception) => {
    const token = interception.request.headers["clerk-authorization"];
    expect(token, "Clerk auth token should be present on /me request").to.exist;
    return token;
  });
});

Cypress.Commands.add("underwriterFreshLogin", (email, password, expectedName) => {
  cy.log("Clearing all session state to force fresh login and default tab state");
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });

  UnderwriterPage.visit();

  cy.get("body", { timeout: 15000 }).should(($body) => {
    const hasLogin = $body.find(LoginLocators.loginHeading).length > 0;
    const hasDashboard = $body.find(UnderwriterLocators.fleetApplicationsHeading).length > 0;
    expect(hasLogin || hasDashboard, "login form or dashboard rendered").to.be.true;
  });

  cy.get("body").then(($body) => {
    const isLoginPageShown = $body.find(LoginLocators.loginHeading).length > 0;

    if (isLoginPageShown) {
      cy.log("Login page shown — performing full login");
      LoginPage.verifyLoginHeadingVisible();
      LoginPage.login(email, password);
    } else {
      cy.log("Already authenticated despite clearing storage — session persisted server-side");
    }
  });

  UnderwriterPage.verifyFleetApplicationsHeadingVisible();
});


Cypress.Commands.add("underwriterLoginIfNeeded", (email, password, expectedName) => {
  UnderwriterPage.visit();

  cy.get("body", { timeout: 15000 })
    .should(($body) => {
      const hasLogin = $body.find(LoginLocators.loginHeading).length > 0;
      const hasDashboard = $body.find(UnderwriterLocators.fleetApplicationsHeading).length > 0;
      expect(hasLogin || hasDashboard, "login form or dashboard rendered").to.be.true;
    })
    .then(($body) => {
      const isLoginPageShown = $body.find(LoginLocators.loginHeading).length > 0;

      if (isLoginPageShown) {
        cy.log("Login page shown — performing full login");
        LoginPage.verifyLoginHeadingVisible();
        LoginPage.login(email, password);
      } else {
        cy.log("Already authenticated — skipping login form");
      }
    });

  UnderwriterPage.verifyFleetApplicationsHeadingVisible();
});


Cypress.Commands.add("interceptAndWait", (method, urlPattern, alias, timeout = 10000) => {
  cy.intercept(method, urlPattern).as(alias);
  return () => cy.wait(`@${alias}`, { timeout });
}); 

export default LoginPage;