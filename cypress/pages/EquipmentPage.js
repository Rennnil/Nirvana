import EquipmentLocators from "../locators/EquipmentLocators";
import Helpers from "../support/Utils/Helpers";
import BasePage from "./BasePage";

class EquipmentPage {
  static verifyEquipmentHeadingVisible() {
    BasePage.verifyVisible(EquipmentLocators.equipmentHeading, "Equipment");
  }

  static getRow(rowIndex) {
    return cy.get(EquipmentLocators.tableRows).eq(rowIndex);
  }

  static enterVinInRow(rowIndex, vin) {
    cy.log(`Row ${rowIndex}: entering VIN "${vin}"`);
    this.getRow(rowIndex)
      .find(EquipmentLocators.vinInputInRow)
      .should("be.visible")
      .clear()
      .type(vin)
      .blur();
  }

  static verifyAutoFetchedFieldsInRow(rowIndex) {
    cy.log(`Row ${rowIndex}: verifying Year/Make/Model/Vehicle Type auto-fetched`);

    BasePage.verifyInputNotEmpty(EquipmentLocators.yearInputByIndex(rowIndex));
    BasePage.verifyInputNotEmpty(EquipmentLocators.makeInputByIndex(rowIndex));
    BasePage.verifyInputNotEmpty(EquipmentLocators.modelInputByIndex(rowIndex));

    this.getRow(rowIndex)
      .find(EquipmentLocators.vehicleTypeSelectInRow)
      .should("not.contain.text", "Select Type");
  }

  static selectRandomVehicleClassInRow(rowIndex) {
    cy.log(`Row ${rowIndex}: waiting for Vehicle Class to become enabled`);

    cy.get(EquipmentLocators.vehicleClassSelectByIndex(rowIndex), { timeout: 10000 })
      .should("not.have.attr", "aria-disabled", "true")
      .should("not.have.class", "Mui-disabled");

    cy.log(`Row ${rowIndex}: selecting random Vehicle Class`);
    Helpers.selectRandomMuiOption(EquipmentLocators.vehicleClassSelectByIndex(rowIndex));

    // Replaces cy.wait(800) — wait until the field actually shows a non-placeholder value
    BasePage.waitUntil(
      EquipmentLocators.vehicleClassSelectByIndex(rowIndex),
      ($el) => {
        const text = $el.text().trim();
        return text !== "" && !/^(select|choose)/i.test(text);
      },
      `Row ${rowIndex}: Vehicle Class shows a selected value`
    );
  }

  static selectRandomGvwInRow(rowIndex, maxRowRetries = 3) {
    cy.log(`Row ${rowIndex}: waiting for GVW to become enabled`);

    cy.get(EquipmentLocators.gvwSelectByIndex(rowIndex), { timeout: 10000 })
      .should("not.have.attr", "aria-disabled", "true")
      .should("not.have.class", "Mui-disabled");

    const attemptRowSelect = (attempt) => {
      cy.log(`Row ${rowIndex}: selecting random GVW (row attempt ${attempt})`);
      Helpers.selectRandomMuiOption(EquipmentLocators.gvwSelectByIndex(rowIndex), 5);

      cy.get(EquipmentLocators.gvwSelectByIndex(rowIndex)).then(($el) => {
        const text = $el.text().trim();
        const isEmpty = text === "" || /^(select|choose)/i.test(text);

        if (isEmpty && attempt < maxRowRetries) {
          cy.log(`Row ${rowIndex}: GVW still empty after attempt ${attempt} — retrying whole selection`);
          // cy.wait(500) removed — Helpers.selectRandomMuiOption already waits
          // for the listbox via retry-based assertions, so no fixed delay is needed
          // before the next attempt.
          attemptRowSelect(attempt + 1);
        } else if (isEmpty) {
          throw new Error(
            `Row ${rowIndex}: GVW field remained empty after ${maxRowRetries} attempts`,
          );
        } else {
          cy.log(`Row ${rowIndex}: GVW confirmed set to "${text}"`);
        }
      });
    };

    attemptRowSelect(1);
  }

  static enterStatedValueInRow(rowIndex, value) {
    cy.log(`Row ${rowIndex}: entering Stated Value "${value}"`);
    cy.get(EquipmentLocators.statedValueInputByIndex(rowIndex))
      .should("be.visible")
      .clear()
      .type(String(value))
      .blur();
  }

  static clickAddEquipment() {
    BasePage.clickButtonByText("Add Equipment");
  }

  static clickProceed() {
    cy.log("Clicking Proceed button on Equipment screen");
    BasePage.clickButtonByText("Proceed");
  }

  static verifyProceedBlockedWithoutData() {
    this.clickProceed();
    cy.log(`Verifying error message: "${EquipmentLocators.makeErrorText}"`);
    cy.contains(EquipmentLocators.errorHelperText, EquipmentLocators.makeErrorText, {
      timeout: 10000,
    }).should("be.visible");
  }

  static fillEquipmentRow(rowIndex, vin, statedValue) {
    this.enterVinInRow(rowIndex, vin);
    this.verifyAutoFetchedFieldsInRow(rowIndex);
    this.selectRandomVehicleClassInRow(rowIndex);
    this.selectRandomGvwInRow(rowIndex);
    this.enterStatedValueInRow(rowIndex, statedValue);
  }

  static fillAllEquipmentRowsAndProceed(vinNumbers, statedValue) {
    vinNumbers.forEach((vin, index) => {
      if (index > 0) {
        this.clickAddEquipment();
        cy.get(EquipmentLocators.tableRows).should("have.length", index + 1);
      }
      this.fillEquipmentRow(index, vin, statedValue);
    });

    this.clickProceed();
  }
}

export default EquipmentPage;