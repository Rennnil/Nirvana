class FleetApplicationLocators {
  static dialog = "[role='dialog']";
  static dotNumberInput = `${this.dialog} input[name='dotNumber']`;
  static companyNameInput = `${this.dialog} input[name='companyName']`;
  static effectiveDateInput = `${this.dialog} input[placeholder='mm/dd/yyyy']`;
  static powerUnitsInput = `${this.dialog} input[data-attr='posthog-power-units']`;
  static agencySelect = `${this.dialog} #agency-select`;
  static producerSelect = `${this.dialog} #producer-select`;
  static marketerSelect = `${this.dialog} #marketer-select`;
  static continueButton =
    "button[data-attr='posthog-create-application-continue']";
  static noOption = "button[value='no']";
}

export default FleetApplicationLocators;
