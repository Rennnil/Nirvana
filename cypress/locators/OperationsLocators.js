class OperationsLocators {
  static dotNumberText = "p.MuiTypography-root.MuiTypography-body2";
  static companyNameText = "p.MuiTypography-root.MuiTypography-body2";
  static operationsHeading = "h4.MuiTypography-root.MuiTypography-h4";

  static proceedButton = "button.MuiButtonBase-root.MuiButton-root.MuiButton-containedPrimary";

  static effectiveDateInput = "input[placeholder='mm/dd/yyyy'][type='tel']";

  static producerSelect = "div[aria-haspopup='listbox'][role='button']";

  static coverageLabelText = (coverageName) => `p:contains('${coverageName}')`;

  static businessOwnerFirstNameInput = "input[name='operationsForm.businessOwner.firstName']";
  static businessOwnerLastNameInput = "input[name='operationsForm.businessOwner.lastName']";
  static businessOwnerCityInput = "input#city[name='operationsForm.businessOwner.address.city']";
  static businessOwnerZipInput = "input[placeholder='eg. 12345']";

  static streetAutocompleteInput = ".autocomplete-container input[placeholder='Search for a place']";
  static autocompleteListbox = "ul[role='listbox']";
  static autocompleteOption = "li[role='option']";

  static driverOnPolicyRadioGroup = "div[role='radiogroup'][aria-label='driver-on-policy']";
  static driverOnPolicyRadioByValue = (value) =>
    `${OperationsLocators.driverOnPolicyRadioGroup} input[type='radio'][value='${value}']`;

  static terminalLocationCheckboxLabel = "Same as Business Owner’s Address";

  static allClaimsInput = "[data-testid='nonfleet-all-claims-input'] input";

  static primaryOperatingClassWrapper = "[data-testid='nonfleet-primary-operating-class-wrapper']";
  static primaryOperatingClassInput = `${OperationsLocators.primaryOperatingClassWrapper} input`;

  static primaryCommodityInput = "div.MuiAutocomplete-root input[placeholder='Select']";
}

export default OperationsLocators;