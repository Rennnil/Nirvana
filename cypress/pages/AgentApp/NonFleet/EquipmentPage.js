import EquipmentLocators from "../../../locators/AgentApp/NonFleet/EquipmentLocators";
import Helpers from "../../../support/utils/Helpers";
import BasePage from "./BasePage";
import UiAssertions from "../../../Assertions/UiAssertions";

class EquipmentPage {
  // ============================================================
  // MANUAL ENTRY FLOW
  // ============================================================

  static verifyEquipmentHeadingVisible() {
    BasePage.verifyVisible(EquipmentLocators.equipmentHeading, "Equipment");
  }

  static getRow(rowIndex) {
    return cy.get(EquipmentLocators.tableRows).eq(rowIndex);
  }

  static enterVinInRow(rowIndex, vin) {
    cy.log(`Row ${rowIndex}: entering VIN "${vin}"`);
    BasePage.typeInto(this.getRow(rowIndex).find(EquipmentLocators.vinInputInRow), vin, { log: false });
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
          attemptRowSelect(attempt + 1);
        } else if (isEmpty) {
          throw new Error(`Row ${rowIndex}: GVW field remained empty after ${maxRowRetries} attempts`);
        } else {
          cy.log(`Row ${rowIndex}: GVW confirmed set to "${text}"`);
        }
      });
    };

    attemptRowSelect(1);
  }

  static enterStatedValueInRow(rowIndex, value) {
    cy.log(`Row ${rowIndex}: entering Stated Value "${value}"`);
    BasePage.typeInto(cy.get(EquipmentLocators.statedValueInputByIndex(rowIndex)), value, { log: false });
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
    UiAssertions.verifyErrorMessageVisible(EquipmentLocators.errorHelperText, EquipmentLocators.makeErrorText);
  }

  static fillEquipmentRow(rowIndex, vin, statedValue) {
  this.enterVinInRow(rowIndex, vin);
  this.verifyAutoFetchedFieldsInRow(rowIndex);
  this.selectVehicleClassAndGvwBasedOnVehicleType(rowIndex);
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

    // Wait for the Drivers screen to actually be ready before returning control
    cy.get("input[name='driversForm.drivers.0.licenseNumber']", { timeout: 15000 }).should("exist");
  }

  static selectVehicleClassAndGvwBasedOnVehicleType(rowIndex) {
    this.getRow(rowIndex)
      .find(EquipmentLocators.vehicleTypeSelectInRow)
      .invoke("text")
      .then((vehicleTypeText) => {
        const vehicleType = vehicleTypeText.trim();
        cy.log(`Row ${rowIndex}: detected Vehicle Type "${vehicleType}"`);

        let vehicleClassValue;
        let gvwValue;

        if (vehicleType.includes(EquipmentLocators.vehicleTypeTractor)) {
          vehicleClassValue = EquipmentLocators.vehicleClassTruckTractor;
          gvwValue = EquipmentLocators.gvwTractorRange;
        } else if (vehicleType.includes(EquipmentLocators.vehicleTypeTrailer)) {
          vehicleClassValue = EquipmentLocators.vehicleClassDump;
          gvwValue = EquipmentLocators.gvwTrailerRange;
        } else {
          throw new Error(
            `Row ${rowIndex}: unrecognized Vehicle Type "${vehicleType}" — no Vehicle Class/GVW mapping defined`
          );
        }

        cy.log(`Row ${rowIndex}: selecting Vehicle Class "${vehicleClassValue}" and GVW "${gvwValue}"`);

        Helpers.selectMuiDropdownOptionAndVerify(
          EquipmentLocators.vehicleClassSelectByIndex(rowIndex),
          vehicleClassValue
        );

        Helpers.selectMuiDropdownOptionAndVerify(
          EquipmentLocators.gvwSelectByIndex(rowIndex),
          gvwValue
        );
      });
  }


  // ============================================================
  // FILE UPLOAD FLOW
  // ============================================================

  static clickUploadEquipmentListButton() {
    BasePage.clickButtonByText("Upload Equipment List");
  }

  static proceedFromInstructionsPopup() {
    cy.log("Handling upload-instructions popup — clicking Proceed");
    BasePage.clickButtonInDialogByHeading("h5", EquipmentLocators.uploadInstructionsHeading, "Proceed", {
      mustBeEnabled: false,
    });
  }

  static attachEquipmentFile(filePath) {
    BasePage.attachFileInDialog(
      "h2",
      EquipmentLocators.fileUploadDialogHeading,
      EquipmentLocators.fileInput,
      filePath
    );
  }

  static clickReviewAndConfirm() {
    BasePage.clickButtonByText("Review & Confirm", { mustBeEnabled: true });
  }

  static confirmImport() {
    BasePage.confirmImportPopup(
      "h2",
      EquipmentLocators.confirmImportHeading,
      EquipmentLocators.confirmImportSubmitButton
    );
  }

  static uploadEquipmentListFile(filePath) {
    this.clickUploadEquipmentListButton();
    this.proceedFromInstructionsPopup();
    this.attachEquipmentFile(filePath);
    this.clickReviewAndConfirm();
    this.confirmImport();
  }

  static selectVehicleClassAndGvwForUploadedRows(rowCount) {
    for (let index = 0; index < rowCount; index++) {
      this.selectRandomVehicleClassInRow(index);
      this.selectRandomGvwInRow(index);
    }
  }

  static uploadEquipmentListAndProceed(filePath, rowCount) {
    this.uploadEquipmentListFile(filePath);
    // cy.get(EquipmentLocators.tableRows, { timeout: 15000 }).should("have.length", rowCount);
    this.selectVehicleClassAndGvwForUploadedRows(rowCount);
    this.clickProceed();
  }

}

export default EquipmentPage;