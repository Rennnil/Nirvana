import LoginLocators from "../locators/LoginLocators";
import BasePage from "./BasePage";

class LoginPage {
  static visit() {
    cy.visit("/");
  }

  static verifyLoginHeadingVisible() {
    BasePage.verifyVisible(LoginLocators.loginHeading, "Sign in to Nirvana", 15000);
  }

  static enterEmail(email) {
    BasePage.typeInto(LoginLocators.emailInput, email, { blur: false });
  }

  static clickContinueButton() {
    BasePage.clickVisible(LoginLocators.continueButton, { mustBeEnabled: true });
  }

  static enterPassword(password) {
    cy.log("Entering password");
    cy.get(LoginLocators.passwordInput, { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type(password, { log: false });
  }

  static login(email, password) {
    this.enterEmail(email);
    this.clickContinueButton();
    this.enterPassword(password);
    this.clickContinueButton();
  }
}

export default LoginPage;