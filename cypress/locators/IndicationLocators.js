class IndicationLocators {

  static indicationHeading = "h4.MuiTypography-root.MuiTypography-h4";
  static errorTelematicsText = "Please connect the telematics";
  static errorHelperText = "p.MuiFormHelperText-root.Mui-error";

  static deductibleSelect = "div#mui-component-select-CoverageAutoPhysicalDamage";
  static limitsSelect = "div#mui-component-select-CoverageAutoLiability";

  static connectTelematicsButton = "button:contains('Connect Telematics')";

  // Popup 1 — Request telematics consent (Name/Email form)
  static consentNameInput = "input[name='name']";
  static consentEmailInput = "input[name='email']";
  static createLinkButton = "button[type='submit']:contains('Create Link')";

  // Popup 2 — Send Telematics Link (after link generated)
  static sendEmailButton = "button:contains('Send')";
  static popupCloseButton = "button[type='button'] svg[stroke='currentColor']";
  static dialogContent = "div.MuiDialogContent-root";
  static multiEmailInput = "div.react-multi-email input[type='text']";

  static planSelectButton = "button:contains('Select')";

  static proceedButtonText = "Proceed";
}

export default IndicationLocators;