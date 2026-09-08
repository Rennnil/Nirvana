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
    BasePage.typeAndVerify(InsuredDetailsLocators.effectiveDateInput, dateString);
  }

  static enterPowerUnits(count) {
    BasePage.typeAndVerify(InsuredDetailsLocators.powerUnitsInput, count);
  }

  static selectAgency(agencyName) {
    cy.log(`Selecting Agency: "${agencyName}"`);
    Helpers.selectMuiDropdownOption(InsuredDetailsLocators.agencySelect, agencyName, "listbox");
    cy.get(InsuredDetailsLocators.agencySelect).should("contain.text", agencyName);
  }

  static selectProducer(producerName) {
    cy.log(`Selecting Producer: "${producerName}"`);
    cy.get(InsuredDetailsLocators.producerSelect, { timeout: 10000 }).should("not.have.class", "Mui-disabled");
    Helpers.selectMuiDropdownOption(InsuredDetailsLocators.producerSelect, producerName, "listbox");
    cy.get(InsuredDetailsLocators.producerSelect).should("contain.text", producerName);
  }

  static selectMarketer(marketerName) {
    cy.log(`Selecting Marketer: "${marketerName}"`);
    cy.get(InsuredDetailsLocators.marketerSelect, { timeout: 10000 }).should("not.have.class", "Mui-disabled");
    Helpers.selectMuiDropdownOption(InsuredDetailsLocators.marketerSelect, marketerName, "listbox");
    cy.get(InsuredDetailsLocators.marketerSelect).should("contain.text", marketerName);
  }

  static clickContinue() {
    BasePage.clickVisible(InsuredDetailsLocators.continueButton, { mustBeEnabled: true });
  }

  static fillInsuredDetails({ dotNumber, effectiveDate, powerUnits, agency, producer, marketer }) {
    this.enterDotNumber(dotNumber);
    this.enterEffectiveDate(effectiveDate);
    this.enterPowerUnits(powerUnits);
    this.selectAgency(agency);
    this.selectProducer(producer);
    this.selectMarketer(marketer);
    return this.verifyCompanyNameAutoFetched();
  }

  static clickToggleOption(value, expectedLabel) {
    cy.log(`Clicking toggle option with value: "${value}"`);
    BasePage.clickVisible(InsuredDetailsLocators.toggleButtonByValue(value));

    cy.get(InsuredDetailsLocators.toggleButtonByValue(value))
      .should("have.attr", "aria-pressed", "true")
      .and("contain.text", expectedLabel);
  }

  static clickNoOption() {
    this.clickToggleOption("no", "No");
  }
}

export default InsuredDetailsPage;