import IndicationLocators from "../locators/IndicationLocators";
import Helpers from "../support/utils/Helpers";
import BasePage from "./BasePage";

class IndicationPage {
  static verifyIndicationHeadingVisible() {
    BasePage.verifyVisible(IndicationLocators.indicationHeading, "Indication", 15000);
  }

  static verifyPlansSectionVisible() {
    cy.log("Waiting for Plans section to be visible before proceeding");
    cy.contains("label", "Plans", { timeout: 15000 }).should("be.visible");
  }

  static clickProceed() {
    this.verifyIndicationHeadingVisible();
    this.verifyPlansSectionVisible();
    cy.log("Clicking Proceed button on Indication screen");
    BasePage.clickButtonByText(IndicationLocators.proceedButtonText, { timeout: 10000 });
  }

  static verifyProceedBlockedWithoutTelematics() {
    this.clickProceed();
    cy.log(`Verifying error message: "${IndicationLocators.errorTelematicsText}"`);
    cy.contains(IndicationLocators.errorHelperText, IndicationLocators.errorTelematicsText, {
      timeout: 10000,
    }).should("be.visible");
  }

  static verifyDefaultDeductibleValue(expectedValue) {
    BasePage.verifyVisible(IndicationLocators.deductibleSelect, expectedValue);
  }

  static verifyDefaultLimitsValue(expectedValue) {
    BasePage.verifyVisible(IndicationLocators.limitsSelect, expectedValue);
  }

  static verifyDefaultDeductibleAndLimits(deductibleValue, limitsValue) {
    this.verifyIndicationHeadingVisible();
    this.verifyDefaultDeductibleValue(deductibleValue);
    this.verifyDefaultLimitsValue(limitsValue);
  }

  static waitForScreenToSettleAfterRefresh() {
    cy.log("Waiting for page to settle after refresh");
    this.verifyIndicationHeadingVisible();

    cy.get(IndicationLocators.deductibleSelect, { timeout: 15000 })
      .should("be.visible")
      .and("not.have.class", "Mui-disabled");

    cy.get(IndicationLocators.limitsSelect, { timeout: 15000 })
      .should("be.visible")
      .and("not.have.class", "Mui-disabled");
  }

  static waitForEmailAutoFillInSendLinkPopup(expectedEmail) {
    cy.log(`Waiting for email to auto-fill in Send Telematics Link popup: ${expectedEmail}`);
    cy.get(IndicationLocators.dialogContent, { timeout: 10000 }).should("be.visible");

    cy.contains("div.react-multi-email span", expectedEmail, { timeout: 10000 }).should(
      "be.visible"
    );
  }

  static clickSendEmail() {
    cy.log("Clicking the enabled 'Send' button (email) in the popup");
    cy.get(IndicationLocators.dialogContent, { timeout: 10000 }).should("be.visible");

    cy.get(IndicationLocators.dialogContent)
      .contains("button", "Send")
      .filter(":not([disabled])")
      .first()
      .should("be.visible")
      .click();
  }

  static selectDeductibleOption(optionText) {
    cy.log(`Selecting Deductible option: "${optionText}"`);
    Helpers.selectMuiDropdownOption(
      IndicationLocators.deductibleSelect,
      optionText,
      "listbox"
    );

    this.waitForScreenToSettleAfterRefresh();

    cy.get(IndicationLocators.deductibleSelect).should("contain.text", optionText);
  }

  static selectLimitsOption(optionText) {
    cy.log(`Selecting Limits option: "${optionText}"`);
    Helpers.selectMuiDropdownOption(
      IndicationLocators.limitsSelect,
      optionText,
      "listbox"
    );

    this.waitForScreenToSettleAfterRefresh();

    cy.get(IndicationLocators.limitsSelect).should("contain.text", optionText);
  }

  static clickConnectTelematics() {
    BasePage.clickButtonByText("Connect Telematics");
  }

  static fillTelematicsConsentForm(name, email) {
    cy.log(`Filling telematics consent form: ${name}, ${email}`);
    cy.get(IndicationLocators.dialogContent, { timeout: 10000 }).should("be.visible");

    BasePage.typeInto(IndicationLocators.consentNameInput, name, { blur: false });
    BasePage.typeInto(IndicationLocators.consentEmailInput, email, { blur: false });
  }

  static clickCreateLink() {
    cy.log("Clicking Create Link button");
    cy.contains("button[type='submit']", "Create Link")
      .should("be.visible")
      .and("not.be.disabled")
      .click();
  }

  static closePopup() {
    cy.log("Closing telematics popup");
    cy.get(IndicationLocators.dialogContent)
      .find("button")
      .first()
      .click({ force: true });

    BasePage.verifyElementGone(IndicationLocators.dialogContent);
  }

  static connectTelematics(name, email) {
    this.clickConnectTelematics();
    this.fillTelematicsConsentForm(name, email);
    this.clickCreateLink();
    this.waitForEmailAutoFillInSendLinkPopup(email);
    this.clickSendEmail();
    this.closePopup();
  }

  static selectFirstAvailablePlan() {
    cy.log("Selecting a plan (first available 'Select' button)");

    let planName = "";

    cy.contains("button", "Select")
      .first()
      .closest(".MuiCard-root")
      .find("h6.MuiTypography-h6")
      .first()
      .then(($h6) => {
        planName = $h6.text().trim();
        cy.log(`Plan being selected: "${planName}"`);
      });

    cy.contains("button", "Select").first().click();

    return cy.wrap(null).then(() => planName);
  }

  static completeIndicationScreen({ deductibleOption, limitsOption }) {
    const telematicsName = Cypress.env("agentName");
    const telematicsEmail = Cypress.env("agentEmail");

    this.verifyIndicationHeadingVisible();
    this.selectDeductibleOption(deductibleOption);
    this.selectLimitsOption(limitsOption);
    this.connectTelematics(telematicsName, telematicsEmail);

    let capturedPlan = "";

    return this.selectFirstAvailablePlan()
      .then((planName) => {
        capturedPlan = planName;
        return this.clickProceed();
      })
      .then(() => {
        return capturedPlan;
      });
  }
}

export default IndicationPage;