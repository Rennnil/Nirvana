import DriversLocators from "../locators/DriversLocators";
import Helpers from "../support/utils/Helpers";
import { faker } from "@faker-js/faker";
import DataGenerator from "../support/utils/DataGenerator";
import BasePage from "./BasePage";

class DriversPage {
  static getRow(rowIndex) {
    return cy.get(DriversLocators.driverRowByIndex(rowIndex));
  }

  static enterCdlNumberInRow(rowIndex, cdlNumber) {
    cy.log(`Row ${rowIndex}: entering CDL Number "${cdlNumber}"`);
    this.getRow(rowIndex)
      .find(DriversLocators.cdlNumberInputByIndex(rowIndex))
      .should("be.visible")
      .clear()
      .type(cdlNumber)
      .blur();
  }

  static enterFirstNameInRow(rowIndex, firstName) {
    cy.log(`Row ${rowIndex}: entering First Name "${firstName}"`);
    cy.get(DriversLocators.firstNameInputByIndex(rowIndex))
      .should("be.visible")
      .clear()
      .type(firstName)
      .blur();
  }

  static enterLastNameInRow(rowIndex, lastName) {
    cy.log(`Row ${rowIndex}: entering Last Name "${lastName}"`);
    cy.get(DriversLocators.lastNameInputByIndex(rowIndex))
      .should("be.visible")
      .clear()
      .type(lastName)
      .blur();
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
    this.getRow(rowIndex)
      .find(DriversLocators.dateInputsInRow)
      .eq(0)
      .should("be.visible")
      .clear()
      .type(dobString)
      .blur();
  }

  static enterDohInRow(rowIndex, dohString) {
    cy.log(`Row ${rowIndex}: entering Date of Hire "${dohString}"`);
    this.getRow(rowIndex)
      .find(DriversLocators.dateInputsInRow)
      .eq(1)
      .should("be.visible")
      .clear()
      .type(dohString)
      .blur();
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
    cy.get(DriversLocators.cdlNumberInputByIndex(0)).clear().blur();

    this.clickProceed();
    cy.log(`Verifying error message: "${DriversLocators.dlNumberErrorText}"`);
    cy.contains(DriversLocators.errorHelperText, DriversLocators.dlNumberErrorText, {
      timeout: 10000,
    }).should("be.visible");
  }

  static enterCdlExpYearsInRow(rowIndex, years) {
    cy.log(`Row ${rowIndex}: entering Years of CDL Experience "${years}"`);
    this.getRow(rowIndex)
      .find(DriversLocators.cdlExpYearsInputInRow)
      .should("be.visible")
      .clear()
      .type(String(years))
      .blur();
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
}

export default DriversPage;