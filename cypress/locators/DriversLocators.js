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
}

export default DriversLocators;
