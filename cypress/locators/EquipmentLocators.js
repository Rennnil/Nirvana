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
}

export default EquipmentLocators;
