import Helpers from "../../../support/utils/Helpers";
import BasePage from "../NonFleet/BasePage";

class FleetApplicationPage {
  static dialog = "[role='dialog']";
  static fieldLabel = `${this.dialog} label`;
  static dotNumberInput = "input[name='dotNumber']";
  static companyNameInput = "input[name='companyName']";
  static effectiveDateInput = "input[type='tel'][placeholder='mm/dd/yyyy']";
  static powerUnitsInput =
    "input[data-attr='posthog-power-units'][inputmode='numeric']";
  static agencySelect = `${this.dialog} #agency-select`;
  static producerSelect = `${this.dialog} #producer-select`;
  static marketerSelect = `${this.dialog} #marketer-select`;
  static continueButton =
    "button[data-attr='posthog-create-application-continue']";
  static noOption = "button[value='no']";

  static fieldControl(labelText, controlSelector) {
    return cy
      .contains(this.fieldLabel, labelText)
      .parent()
      .find(controlSelector);
  }

  static verifyDialogVisible() {
    BasePage.verifyVisible(
      this.dialog,
      "Please tell us more about the insured",
    );
  }

  static enterDotNumber(dotNumber) {
    BasePage.typeInto(
      this.fieldControl("DOT number", this.dotNumberInput),
      dotNumber,
    );
  }

  static verifyCompanyNameAutoFetched(expectedCompanyName) {
    return this.fieldControl("Company name", this.companyNameInput)
      .should("be.visible")
      .should("have.value", expectedCompanyName)
      .invoke("val");
  }

  static enterEffectiveDate(effectiveDate) {
    BasePage.typeAndVerify(
      this.fieldControl("Effective date of coverage", this.effectiveDateInput),
      effectiveDate,
    );
  }

  static enterPowerUnits(powerUnits) {
    BasePage.typeAndVerify(
      this.fieldControl("# of power units", this.powerUnitsInput),
      powerUnits,
    );
  }

  static verifyProducerAndMarketerDisabled() {
    cy.get(this.producerSelect).should("have.attr", "aria-disabled", "true");
    cy.get(this.marketerSelect).should("have.attr", "aria-disabled", "true");
  }

  static selectAgency(agencyName) {
    Helpers.selectMuiDropdownOption(this.agencySelect, agencyName, "listbox");
    cy.get(this.agencySelect).should("contain.text", agencyName);
    cy.get(this.producerSelect).should("not.have.attr", "aria-disabled");
    cy.get(this.marketerSelect).should("not.have.attr", "aria-disabled");
  }

  static selectProducer(producerName) {
    Helpers.selectMuiDropdownOption(
      this.producerSelect,
      producerName,
      "listbox",
    );
    cy.get(this.producerSelect).should("contain.text", producerName);
  }

  static selectMarketer(marketerName) {
    Helpers.selectMuiDropdownOption(
      this.marketerSelect,
      marketerName,
      "listbox",
    );
    cy.get(this.marketerSelect).should("contain.text", marketerName);
  }

  static clickContinue() {
    BasePage.clickVisible(this.continueButton, { mustBeEnabled: true });
  }

  static clickNoOption() {
    BasePage.clickVisible(this.noOption);
    cy.get(this.noOption)
      .should("have.attr", "aria-pressed", "true")
      .and("contain.text", "No");
  }
}

export default FleetApplicationPage;
