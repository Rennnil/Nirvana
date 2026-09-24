class DriversLocators {
  static addDriverButton = "button:contains('Add Driver')";
  static driverRowByIndex = (i) => `tr[data-testid='driver-row-${i}']`;

  static cdlNumberInputByIndex = (i) =>
    `input[name='driversForm.drivers.${i}.licenseNumber']`;
  static firstNameInputByIndex = (i) =>
    `input[name='driversForm.drivers.${i}.firstName']`;
  static lastNameInputByIndex = (i) =>
    `input[name='driversForm.drivers.${i}.lastName']`;

  static stateSelectInRow = "div[role='button'][aria-haspopup='listbox']";
  static dateInputsInRow = "input[placeholder='mm/dd/yyyy']";

  static dlNumberErrorText = "Please enter DL number";
  static errorHelperText = "p.MuiFormHelperText-root.Mui-error";
  static medCertCheckboxContainer =
    "[data-testid='med-cert-confirmation-checkbox']";
  static cdlExpYearsInputInRow = "input[placeholder='e.g. 10']";

  static proceedButtonText = "Proceed";


  // Upload flow
static uploadDriverListButton = "button:contains('Upload Driver List')";

// Popup 1 — instructions dialog (scoped by heading text)
static uploadInstructionsHeading = "Upload Drivers List";
static useFirstAndLastNameOption = "Use First and Last Name";
static uploadInstructionsProceedButton = "button:contains('Proceed')";

// Popup 2 — file upload dialog (scoped by heading text)
static fileUploadDialogHeading = "Drivers List";
static fileInput = "#agents-nonfleet-drivers-list-file-input";
static reviewAndConfirmButton = "button:contains('Review & Confirm')";

// Popup 3 — confirm import dialog (scoped by heading text)
static confirmImportHeading = "Confirm Import";
static confirmImportSubmitButton = "[data-testid='agents-nonfleet-drivers-list-confirm-import-submit']";
}

export default DriversLocators;
