import InsuredDetailsLocators from "../locators/InsuredDetailsLocators";
import DashboardLocators from "../locators/DashboardLocators";
import Helpers from "../support/utils/Helpers";
import BasePage from "./BasePage";

class InsuredDetailsPage {
  static verifyPopupVisible(expectedText) {
    BasePage.verifyVisible(DashboardLocators.popupContainer, expectedText, 10000);
  }

  static enterDotNumber(dotNumber) {
    BasePage.typeInto(InsuredDetailsLocators.dotNumberInput, dotNumber);
  }

  static verifyCompanyNameAutoFetched() {
    cy.log("Waiting for company name to auto-sync after DOT number entry");
    return cy
      .get(InsuredDetailsLocators.companyNameInput, { timeout: 15000 })
      .should(($input) => {
        const value = $input.val();
        expect(value, "Company name should be auto-populated").to.not.be.empty;
      })
      .invoke("val");
  }

  static enterEffectiveDate(dateString) {
    BasePage.typeInto(InsuredDetailsLocators.effectiveDateInput, dateString);
    BasePage.verifyInputValue(InsuredDetailsLocators.effectiveDateInput, dateString);
  }

  static enterPowerUnits(count) {
    BasePage.typeInto(InsuredDetailsLocators.powerUnitsInput, count);
    BasePage.verifyInputValue(InsuredDetailsLocators.powerUnitsInput, count);
  }

  static selectProducer(producerName) {
    Helpers.selectMuiDropdownOption(
      InsuredDetailsLocators.producerSelect,
      producerName,
      "listbox",
    );
    cy.get(InsuredDetailsLocators.producerSelect).should(
      "contain.text",
      producerName,
    );
  }

  static clickContinue() {
    BasePage.clickVisible(InsuredDetailsLocators.continueButton, { mustBeEnabled: true });
  }

  static fillInsuredDetails({
    dotNumber,
    effectiveDate,
    powerUnits,
    producer,
  }) {
    this.enterDotNumber(dotNumber);
    this.enterEffectiveDate(effectiveDate);
    this.enterPowerUnits(powerUnits);
    this.selectProducer(producer);
    return this.verifyCompanyNameAutoFetched();
  }

  static clickToggleOption(value, expectedLabel) {
    cy.log(`Clicking toggle option with value: "${value}"`);
    cy.get(InsuredDetailsLocators.toggleButtonByValue(value), {
      timeout: 10000,
    })
      .should("be.visible")
      .click();

    cy.get(InsuredDetailsLocators.toggleButtonByValue(value))
      .should("have.attr", "aria-pressed", "true")
      .and("contain.text", expectedLabel);

    cy.log(
      `Toggle option "${expectedLabel}" (value="${value}") is now selected`,
    );
  }

  static clickNoOption() {
    this.clickToggleOption("no", "No");
  }
}

export default InsuredDetailsPage;