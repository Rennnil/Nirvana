import BasePage from "../NonFleet/BasePage";
import FleetAgentTestData from "../../../testData/FleetAgentAppTestData";

class LoginPage {
  static loginHeading = "h1.cl-headerTitle";
  static emailInput = "input[name='identifier']";
  static passwordInput = "input[name='password']";
  static continueButton = "button.cl-formButtonPrimary";

  static visit = () => {
    cy.visit("https://agents.staging.nirvanatech.com/");
  };

  static headingTitle = () => {
    cy.get(this.loginHeading, { timeout: 15000 })
      .should("be.visible")
      .and("have.text", FleetAgentTestData.HeadingTitle);
  };

  static email = () => {
    BasePage.typeInto(this.emailInput, FleetAgentTestData.emailText, {
      blur: false,
    });
  };

  static password = () => {
    cy.get(this.passwordInput, { timeout: 10000 }).should("be.visible");
    cy.get(this.passwordInput).clear();
    cy.get(this.passwordInput).type(FleetAgentTestData.passwordText, {
      log: false,
    });
  };

  static loginButton = () => {
    BasePage.clickVisible(this.continueButton, {
      mustBeEnabled: true,
    });
  };
}

export default LoginPage;
