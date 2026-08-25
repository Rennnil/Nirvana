import LoginLocators from "../locators/LoginLocators";

class LoginPage {
  static visit() {
    cy.visit("/");
  }

  static verifyLoginHeadingVisible() {
    cy.get(LoginLocators.loginHeading, { timeout: 15000 })
      .should("be.visible")
      .and("contain.text", "Sign in to Nirvana");
  }

  static enterEmail(email) {
    cy.log(`Entering email: ${email}`);
    cy.get(LoginLocators.emailInput, { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type(email);
  }

  static clickContinueButton() {
    cy.log("Clicking Continue button");
    cy.get(LoginLocators.continueButton).should("be.enabled").click();
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

    // Step 2: password field appears on a new screen after email submission
    this.enterPassword(password);
    this.clickContinueButton();
  }
}

export default LoginPage;