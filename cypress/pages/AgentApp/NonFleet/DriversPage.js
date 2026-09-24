import DriversLocators from "../../../locators/AgentApp/NonFleet/DriversLocators";
import Helpers from "../../../support/utils/Helpers";
import { faker } from "@faker-js/faker";
import DataGenerator from "../../../support/utils/DataGenerator";
import BasePage from "./BasePage";
import UiAssertions from "../../../Assertions/UiAssertions";

class DriversPage {
  // ============================================================
  // MANUAL ENTRY FLOW
  // ============================================================

  static getRow(rowIndex) {
    return cy.get(DriversLocators.driverRowByIndex(rowIndex));
  }

  static enterCdlNumberInRow(rowIndex, cdlNumber) {
    cy.log(`Row ${rowIndex}: entering CDL Number "${cdlNumber}"`);
    BasePage.typeInto(
      this.getRow(rowIndex).find(DriversLocators.cdlNumberInputByIndex(rowIndex)),
      cdlNumber,
      { log: false }
    );
  }

  static enterFirstNameInRow(rowIndex, firstName) {
    cy.log(`Row ${rowIndex}: entering First Name "${firstName}"`);
    BasePage.typeInto(cy.get(DriversLocators.firstNameInputByIndex(rowIndex)), firstName, { log: false });
  }

  static enterLastNameInRow(rowIndex, lastName) {
    cy.log(`Row ${rowIndex}: entering Last Name "${lastName}"`);
    BasePage.typeInto(cy.get(DriversLocators.lastNameInputByIndex(rowIndex)), lastName, { log: false });
  }

  static selectStateInRow(rowIndex, stateValue) {
    cy.log(`Row ${rowIndex}: selecting License State "${stateValue}"`);
    this.getRow(rowIndex)
      .find(DriversLocators.stateSelectInRow)
      .then(($el) => {
        Helpers.selectScrollableOptionByValue($el, stateValue);
      });

    this.getRow(rowIndex)
      .find(DriversLocators.stateSelectInRow)
      .should(($el) => {
        const text = $el.text().trim();
        expect(text, "State field should show a selected value, not placeholder").to.not.eq("State");
        expect(text, "State field should not be empty").to.not.eq("");
      });
  }

  static enterDobInRow(rowIndex, dobString) {
    cy.log(`Row ${rowIndex}: entering Date of Birth "${dobString}"`);
    BasePage.typeInto(this.getRow(rowIndex).find(DriversLocators.dateInputsInRow).eq(0), dobString, { log: false });
  }

  static enterDohInRow(rowIndex, dohString) {
    cy.log(`Row ${rowIndex}: entering Date of Hire "${dohString}"`);
    BasePage.typeInto(this.getRow(rowIndex).find(DriversLocators.dateInputsInRow).eq(1), dohString, { log: false });
  }

  static enterCdlExpYearsInRow(rowIndex, years) {
    cy.log(`Row ${rowIndex}: entering Years of CDL Experience "${years}"`);
    BasePage.typeInto(this.getRow(rowIndex).find(DriversLocators.cdlExpYearsInputInRow), years, { log: false });
  }

  static clickAddDriver() {
    BasePage.clickButtonByText("Add Driver");
  }

  static clickProceed() {
    cy.log("Clicking Proceed button on Drivers screen");
    BasePage.clickButtonByText(DriversLocators.proceedButtonText, { timeout: 10000 });
  }

  static verifyProceedBlockedWithoutData() {
  cy.log("Ensuring CDL Number field is empty before testing validation");

  cy.get(DriversLocators.cdlNumberInputByIndex(0)).should("be.visible");
  cy.get(DriversLocators.cdlNumberInputByIndex(0)).clear();
  cy.get(DriversLocators.cdlNumberInputByIndex(0)).blur();

  this.clickProceed();
  UiAssertions.verifyErrorMessageVisible(DriversLocators.errorHelperText, DriversLocators.dlNumberErrorText);
}

  static checkMedCertConfirmation() {
    BasePage.checkMuiCheckbox(
      `${DriversLocators.medCertCheckboxContainer} span.MuiCheckbox-root`,
      `${DriversLocators.medCertCheckboxContainer} input[type='checkbox']`,
    );
  }

  static fillAllDriverRowsAndProceed(drivers, dobGenerator, dohGenerator) {
    drivers.forEach((driver, index) => {
      if (index > 0) {
        this.clickAddDriver();
        cy.get(DriversLocators.driverRowByIndex(index)).should("exist");
      }

      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const cdlExpYears = DataGenerator.getRandomCdlExpYears();
      const dob = dobGenerator();
      const doh = dohGenerator();

      this.enterCdlNumberInRow(index, driver.cdlNumber);
      this.enterFirstNameInRow(index, firstName);
      this.enterLastNameInRow(index, lastName);
      this.selectStateInRow(index, driver.state);
      this.enterCdlExpYearsInRow(index, cdlExpYears);
      this.enterDobInRow(index, dob);
      this.enterDohInRow(index, doh);

      cy.log(
        `Row ${index} completed: CDL ${driver.cdlNumber} (${driver.state}), ${firstName} ${lastName}, CDL Exp: ${cdlExpYears} yrs, DOB: ${dob}, DOH: ${doh}`
      );
    });

    this.checkMedCertConfirmation();
    this.clickProceed();
  }

  // ============================================================
  // FILE UPLOAD FLOW
  // ============================================================

  static clickUploadDriverListButton() {
    BasePage.clickButtonByText("Upload Driver List");
  }

  static selectFirstAndLastNameOption() {
    cy.log("Selecting 'Use First and Last Name' option");
    BasePage.clickInDialogByHeading(
      "h5",
      DriversLocators.uploadInstructionsHeading,
      "p",
      DriversLocators.useFirstAndLastNameOption
    );
  }

  static proceedFromInstructionsPopup() {
    cy.log("Handling upload-instructions popup — clicking Proceed");
    BasePage.clickButtonInDialogByHeading("h5", DriversLocators.uploadInstructionsHeading, "Proceed");
  }

  static attachDriversFile(filePath) {
    BasePage.attachFileInDialog(
      "h2",
      DriversLocators.fileUploadDialogHeading,
      DriversLocators.fileInput,
      filePath
    );
  }

  static clickReviewAndConfirm() {
    BasePage.clickButtonByText("Review & Confirm", { mustBeEnabled: true });
  }

  static confirmImport() {
    BasePage.confirmImportPopup(
      "h2",
      DriversLocators.confirmImportHeading,
      DriversLocators.confirmImportSubmitButton
    );
  }

  static uploadDriverListFile(filePath) {
    this.clickUploadDriverListButton();
    this.selectFirstAndLastNameOption();
    this.proceedFromInstructionsPopup();
    this.attachDriversFile(filePath);
    this.clickReviewAndConfirm();
    this.confirmImport();
  }

  static uploadDriverListAndProceed(filePath, rowCount) {
    this.uploadDriverListFile(filePath);
    cy.get(DriversLocators.driverRowByIndex(rowCount - 1), { timeout: 15000 }).should("exist");
    this.checkMedCertConfirmation();
    this.clickProceed();
  }
}

export default DriversPage;