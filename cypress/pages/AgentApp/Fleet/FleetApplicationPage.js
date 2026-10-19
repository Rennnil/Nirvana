import FleetApplicationLocators from "../../../locators/AgentApp/Fleet/FleetApplicationLocators";
import Helpers from "../../../support/utils/Helpers";
import BasePage from "../NonFleet/BasePage";

class FleetApplicationPage {
  static verifyDialogVisible() {
    BasePage.verifyVisible(
      FleetApplicationLocators.dialog,
      "Please tell us more about the insured",
    );
  }

  static enterDotNumber(dotNumber) {
    BasePage.typeInto(FleetApplicationLocators.dotNumberInput, dotNumber);
  }

  static verifyCompanyNameAutoFetched(expectedCompanyName) {
    return cy
      .get(FleetApplicationLocators.companyNameInput, { timeout: 15000 })
      .should("have.value", expectedCompanyName)
      .invoke("val");
  }

  static enterEffectiveDate(effectiveDate) {
    BasePage.typeAndVerify(
      FleetApplicationLocators.effectiveDateInput,
      effectiveDate,
    );
  }

  static enterPowerUnits(powerUnits) {
    BasePage.typeAndVerify(
      FleetApplicationLocators.powerUnitsInput,
      powerUnits,
    );
  }

  static verifyProducerAndMarketerDisabled() {
    cy.get(FleetApplicationLocators.producerSelect).should(
      "have.attr",
      "aria-disabled",
      "true",
    );
    cy.get(FleetApplicationLocators.marketerSelect).should(
      "have.attr",
      "aria-disabled",
      "true",
    );
  }

  static selectAgency(agencyName) {
    Helpers.selectMuiDropdownOption(
      FleetApplicationLocators.agencySelect,
      agencyName,
      "listbox",
    );
    cy.get(FleetApplicationLocators.agencySelect).should(
      "contain.text",
      agencyName,
    );
    cy.get(FleetApplicationLocators.producerSelect).should(
      "not.have.attr",
      "aria-disabled",
    );
    cy.get(FleetApplicationLocators.marketerSelect).should(
      "not.have.attr",
      "aria-disabled",
    );
  }

  static selectProducer(producerName) {
    Helpers.selectMuiDropdownOption(
      FleetApplicationLocators.producerSelect,
      producerName,
      "listbox",
    );
    cy.get(FleetApplicationLocators.producerSelect).should(
      "contain.text",
      producerName,
    );
  }

  static selectMarketer(marketerName) {
    Helpers.selectMuiDropdownOption(
      FleetApplicationLocators.marketerSelect,
      marketerName,
      "listbox",
    );
    cy.get(FleetApplicationLocators.marketerSelect).should(
      "contain.text",
      marketerName,
    );
  }

  static clickContinue() {
    BasePage.clickVisible(FleetApplicationLocators.continueButton, {
      mustBeEnabled: true,
    });
  }

  static clickNoOption() {
    BasePage.clickVisible(FleetApplicationLocators.noOption);
    cy.get(FleetApplicationLocators.noOption)
      .should("have.attr", "aria-pressed", "true")
      .and("contain.text", "No");
  }
}

export default FleetApplicationPage;
