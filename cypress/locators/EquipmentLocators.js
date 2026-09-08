class EquipmentLocators {
  static equipmentHeading = "h4.MuiTypography-root.MuiTypography-h4";
  static addEquipmentButton = "button:contains('Add Equipment')";
  static proceedButton =
    "button.MuiButtonBase-root.MuiButton-root.MuiButton-containedPrimary";
  static tableRows = "table tbody tr";

  static vinInputInRow = "input[placeholder='Please enter VIN']";
  static yearInputByIndex = (i) =>
    `[data-testid='equipment-year-input-${i}'] input`;
  static makeInputByIndex = (i) =>
    `input[name='equipmentsForm.vehicles.${i}.make']`;
  static modelInputByIndex = (i) =>
    `input[name='equipmentsForm.vehicles.${i}.model']`;
  static vehicleTypeSelectInRow = "div[role='button'][aria-haspopup='listbox']";
  static vehicleClassSelectByIndex = (i) =>
    `[data-testid='equipment-class-select-${i}'] div[role='button']`;
  static gvwSelectByIndex = (i) =>
    `[data-testid='equipment-gvw-select-${i}'] div[role='button']`;
  static statedValueInputByIndex = (i) =>
    `[data-testid='equipment-stated-value-input-${i}'] input`;

  static makeErrorText = "Please enter make";
  static errorHelperText = "p.MuiFormHelperText-root.Mui-error";


  // Upload flow
  static uploadEquipmentListButton = "button:contains('Upload Equipment List')";

  // Popup 1 — instructions dialog (scoped by heading text)
  static uploadInstructionsHeading = "Upload equipment list";
  static uploadInstructionsProceedButton = "button:contains('Proceed')";

  // Popup 2 — file upload dialog (scoped by heading text)
  static fileUploadDialogHeading = "Equipments List";
  static fileInput = "#agents-nonfleet-equipment-list-file-input";
  static reviewAndConfirmButton = "button:contains('Review & Confirm')";

  // Popup 3 — confirm import dialog (scoped by heading text)
  static confirmImportHeading = "Confirm Import";
  static confirmImportSubmitButton = "[data-testid='agents-nonfleet-equipment-list-confirm-import-submit']";
}

export default EquipmentLocators;
