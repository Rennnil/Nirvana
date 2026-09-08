import OperationsLocators from "../locators/OperationsLocators";
import Helpers from "../support/utils/Helpers";
import BasePage from "./BasePage";
import UiAssertions from "../Assertions/UiAssertions";

class OperationsPage {
  static verifyOperationsHeadingVisible() {
    BasePage.verifyVisible(OperationsLocators.operationsHeading, "Operations", 10000);
  }

  static verifyDotNumberVisible(dotNumber) {
    const expectedText = `DOT: ${dotNumber}`;
    cy.log(`Verifying DOT number is visible: "${expectedText}"`);
    cy.contains("p.MuiTypography-body2", expectedText, { timeout: 10000 })
      .should("be.visible")
      .then(($el) => {
        UiAssertions.verifyExactText($el, expectedText);
      });
  }

  static verifyCompanyNameVisible(expectedCompanyName) {
    cy.log(`Verifying company name is visible: "${expectedCompanyName}"`);
    cy.contains("p.MuiTypography-body2", expectedCompanyName, { timeout: 10000 })
      .should("be.visible")
      .then(($el) => {
        UiAssertions.verifyExactText($el, expectedCompanyName);
      });
  }

  static verifyOperationsScreen(dotNumber, expectedCompanyName) {
    this.verifyDotNumberVisible(dotNumber);
    this.verifyCompanyNameVisible(expectedCompanyName);
    this.verifyOperationsHeadingVisible();
  }

  static verifyEffectiveDate(expectedDate) {
    cy.log(`Verifying effective date matches: "${expectedDate}"`);
    cy.get(OperationsLocators.effectiveDateInput).filter(":visible").first().should("have.value", expectedDate);
  }

  static verifyProducer(expectedProducer) {
    cy.log(`Verifying producer matches: "${expectedProducer}"`);
    cy.get(OperationsLocators.producerSelect).filter(":visible").first().should("contain.text", expectedProducer);
  }

  static toggleCoverageCheckbox(coverageName) {
    cy.log(`Toggling coverage checkbox: "${coverageName}"`);
    cy.contains("p.MuiTypography-body1", coverageName)
      .should("be.visible")
      .parents(".jss41, [class*='w-\\[500px\\]']")
      .first()
      .within(() => {
        cy.get("span.MuiCheckbox-root").click();
      });
  }

  static verifyCoverageCheckboxState(coverageName, shouldBeChecked) {
    cy.log(`Verifying coverage "${coverageName}" checked state: ${shouldBeChecked}`);
    cy.contains("p.MuiTypography-body1", coverageName)
      .parents(".jss41, [class*='w-\\[500px\\]']")
      .first()
      .within(() => {
        cy.get("input[type='checkbox']").should(
          shouldBeChecked ? "be.checked" : "not.be.checked"
        );
      });
  }

  static enterBusinessOwnerName(firstName, lastName) {
    BasePage.typeInto(OperationsLocators.businessOwnerFirstNameInput, firstName, { blur: false });
    BasePage.typeInto(OperationsLocators.businessOwnerLastNameInput, lastName, { blur: false });
  }

  static enterDateOfBirth(dobString) {
    cy.log(`Entering date of birth: ${dobString}`);
    cy.contains("p.MuiFormHelperText-root", "Date of Birth")
      .parents(".MuiGrid-item")
      .first()
      .find("input[type='tel']")
      .should("be.visible")
      .clear()
      .type(dobString)
      .blur();
  }

  static enterStreet(streetName) {
    cy.log(`Entering street: "${streetName}"`);
    cy.contains("p.MuiFormHelperText-root", "Street")
      .parents(".MuiGrid-item")
      .first()
      .find("input[placeholder='Search for a place']")
      .should("be.visible")
      .clear()
      .type(streetName, { delay: 100 })
      .blur();
  }

  static enterCity(cityName) {
    BasePage.typeAndVerify(OperationsLocators.businessOwnerCityInput, cityName);
  }

  static selectState(stateName) {
    cy.log(`Selecting state: "${stateName}"`);

    cy.contains("p.MuiFormHelperText-root", "State")
      .filter(":visible")
      .first()
      .parents(".MuiGrid-item")
      .first()
      .find("div[role='button'][aria-haspopup='listbox']")
      .as("stateDropdown");

    cy.get("@stateDropdown").scrollIntoView({ offset: { top: -200, left: 0 } });
    cy.get("@stateDropdown").should("be.visible").click({ force: true });

    cy.get("ul[role='listbox']", { timeout: 10000 }).should("exist");

    cy.get(`li[data-value='${stateName}']`, { timeout: 10000 })
      .should("exist")
      .then(($el) => {
        $el[0].scrollIntoView({ block: "center", inline: "center" });
      });

    cy.get(`li[data-value='${stateName}']`).click({ force: true });

    // Retry-based close check — waits out the transition instead of a fixed delay
    cy.get("body", { timeout: 5000 }).should(($body) => {
      expect($body.find("ul[role='listbox']").length, "listbox should close").to.eq(0);
    });

    cy.get("@stateDropdown").should("contain.text", stateName);
  }

  static enterZipCode(zipCode) {
    cy.log(`Entering zip code: "${zipCode}"`);
    cy.contains("p.MuiFormHelperText-root", "Zip code")
      .parents(".MuiGrid-item")
      .first()
      .find("input[placeholder='eg. 12345']")
      .should("be.visible")
      .clear()
      .type(zipCode)
      .blur();

    cy.contains("p.MuiFormHelperText-root", "Zip code")
      .parents(".MuiGrid-item")
      .first()
      .find("input[placeholder='eg. 12345']")
      .should("have.value", zipCode);
  }

  static fillBusinessOwnerAddress({ street, city, state, zip }) {
    this.enterStreet(street);
    this.enterCity(city);
    this.selectState(state);
    this.enterZipCode(zip);
  }

  static selectDriverOnPolicy(value) {
    cy.log(`Selecting "Is business owner a driver on policy": ${value}`);
    cy.get(OperationsLocators.driverOnPolicyRadioByValue(value))
      .should("exist")
      .check({ force: true });

    cy.get(OperationsLocators.driverOnPolicyRadioByValue(value)).should("be.checked");
  }

  static selectFarthestRadiusOfOperations(optionText) {
    cy.log(`Selecting Farthest Radius of Operations: "${optionText}"`);
    Helpers.selectOptionNearLabel("Farthest Radius of Operations", optionText);
  }

  static toggleTerminalLocationCheckbox() {
    cy.log("Toggling Terminal Location checkbox");
    cy.contains("span.MuiFormControlLabel-label", OperationsLocators.terminalLocationCheckboxLabel)
      .parents("label.MuiFormControlLabel-root")
      .first()
      .find("span.MuiCheckbox-root")
      .click();
  }

  static enterAllClaims(count) {
    BasePage.typeAndVerify(OperationsLocators.allClaimsInput, count);
  }

  static enterPrimaryOperatingClassAndSelectFirst(searchText) {
    cy.log(`Entering Primary Operating Class search text: "${searchText}"`);
    cy.get(OperationsLocators.primaryOperatingClassInput)
      .should("be.visible")
      .clear()
      .type(searchText, { delay: 100 });

    cy.get(OperationsLocators.autocompleteListbox, { timeout: 10000 })
      .find("li")
      .should("have.length.greaterThan", 0);

    let selectedText = "";
    cy.get(OperationsLocators.autocompleteListbox)
      .find("li")
      .first()
      .then(($option) => {
        selectedText = $option.text().trim();
      });

    cy.get(OperationsLocators.autocompleteListbox).find("li").first().click();

    return cy.wrap(null).then(() => selectedText);
  }

  static enterPrimaryCommodityAndSelectFirst(searchText) {
    cy.log(`Entering Primary Commodity search text: "${searchText}"`);

    cy.contains("p.MuiFormHelperText-root", "Commodity")
      .should("exist")
      .then(($label) => {
        cy.wrap($label)
          .parent()
          .find("input[placeholder='Select']")
          .should("be.visible")
          .scrollIntoView()
          .clear()
          .type(searchText, { delay: 100 });
      });

    cy.get(OperationsLocators.autocompleteListbox, { timeout: 10000 })
      .find("li")
      .should("have.length.greaterThan", 0);

    cy.get(OperationsLocators.autocompleteListbox).find("li").first().click();
  }

  static clickProceed() {
    cy.log("Clicking Proceed button");
    BasePage.clickVisible(OperationsLocators.proceedButton);
  }

  static verifyProceedBlockedWithoutData() {
    this.clickProceed();
    cy.log("Verifying app did NOT navigate away from Operations screen");
    this.verifyOperationsHeadingVisible();
    UiAssertions.verifyUrlIncludes("/non-fleet/application");
    UiAssertions.verifyUrlNotIncludes("/equipment");
  }

  static fillOperationsForm({
    firstName,
    lastName,
    dob,
    street,
    city,
    state,
    zip,
    isDriverOnPolicy,
    farthestRadiusOption,
    allClaimsCount,
    primaryOperatingClassSearch,
    primaryCommoditySearch,
  }) {
    this.toggleCoverageCheckbox("Auto Physical Damage");
    this.toggleCoverageCheckbox("General Liability");

    this.enterBusinessOwnerName(firstName, lastName);
    this.enterDateOfBirth(dob);
    this.fillBusinessOwnerAddress({ street, city, state, zip });
    this.selectDriverOnPolicy(isDriverOnPolicy);
    this.selectFarthestRadiusOfOperations(farthestRadiusOption);
    this.toggleTerminalLocationCheckbox();
    this.enterAllClaims(allClaimsCount);

    let capturedOperatingClass = "";

    return this.enterPrimaryOperatingClassAndSelectFirst(primaryOperatingClassSearch)
      .then((selectedOperatingClass) => {
        capturedOperatingClass = selectedOperatingClass;
        return this.enterPrimaryCommodityAndSelectFirst(primaryCommoditySearch);
      })
      .then(() => {
        return capturedOperatingClass;
      });
  }

  static handleSsnPopupIfPresent(timeout = 8000) {
    cy.get("body", { timeout }).should(($body) => {
      const popupExists = $body.find(OperationsLocators.ssnPopupDialog).length > 0;

      const headingText = $body
        .find(OperationsLocators.operationsHeading)
        .first()
        .text()
        .trim();

      const navigatedAway = headingText !== "" && headingText !== "Operations";

      expect(
        popupExists || navigatedAway,
        "popup shown or navigated away from Operations screen"
      ).to.be.true;
    });

    cy.get("body").then(($body) => {
      const popupExists = $body.find(OperationsLocators.ssnPopupDialog).length > 0;

      if (popupExists) {
        cy.log("SSN popup appeared — clicking Skip");
        cy.get(OperationsLocators.ssnPopupDialog)
          .should("be.visible")
          .within(() => {
            cy.contains("button", "Skip").should("be.visible").click();
          });
        cy.get(OperationsLocators.ssnPopupDialog).should("not.exist");
      } else {
        cy.log("SSN popup did not appear — continuing");
      }
    });
  }
}

export default OperationsPage;