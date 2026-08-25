class InsuredDetailsLocators {
  static dotNumberInput = "input[name='dotNumber']";
  static companyNameInput = "input[name='companyName']";
  static effectiveDateInput = "div[aria-label='Choose date'] input[type='tel']";
  static powerUnitsInput = "input[data-attr='posthog-power-units']";
  static producerSelect = "div[id='producer-select']";
  static continueButton =
    "button[data-attr='posthog-create-application-continue']";

  static toggleButtonByValue = (value) => `button[value='${value}']`;
}

export default InsuredDetailsLocators;
