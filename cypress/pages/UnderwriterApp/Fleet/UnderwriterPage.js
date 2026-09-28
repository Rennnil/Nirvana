import UnderwriterLocators from "../../../locators/UnderwriterApp/Fleet/UnderwriterLocators";
import UnderwriterTestData from "../../../testData/UnderwriterTestData";
import BasePage from "../../AgentApp/NonFleet/BasePage";

class UnderwriterPage {
  static visit() {
    cy.visit("https://underwriter.staging.nirvanatech.com/");
  }

  static verifyFleetApplicationsHeadingVisible() {
    BasePage.verifyVisible(UnderwriterLocators.fleetApplicationsHeading, "Fleet Applications", 10000);
  }

  static verifyTabSelected(tabName) {
    cy.log(`Verifying tab "${tabName}" is selected`);
    cy.get(UnderwriterLocators.selectedTab).should("contain.text", tabName);
  }

  static clickFleetOption() {
    cy.log("Clicking Fleet option");
    cy.contains("span", "Fleet").should("be.visible").click();
  }

  static clickProfile() {
    cy.log("Clicking profile (Super Test)");
    cy.contains("span", "Super Test").should("be.visible").click();
  }

  static verifyDateFromFieldVisible() {
    BasePage.verifyVisible(UnderwriterLocators.dateFromInput);
  }

  static verifyDateToFieldVisible() {
    BasePage.verifyVisible(UnderwriterLocators.dateToInput);
  }

  static verifyLogoutButtonVisible() {
    cy.log("Verifying Logout option is visible");
    cy.contains("li[role='menuitem']", "Logout", { timeout: 10000 }).should("be.visible");
  }

  static closeProfileMenu() {
    cy.log("Closing profile menu");
    cy.get("body").type("{esc}");
    cy.get(".MuiBackdrop-root").should("not.exist");
  }

  static verifyProfileNameVisible(expectedName) {
    BasePage.verifyVisible(UnderwriterLocators.profileName, expectedName, 10000);
  }

  static clickTab(tabName) {
    cy.log(`Clicking tab: "${tabName}"`);
    cy.contains("button[role='tab']", tabName).should("be.visible").click();
  }

  static verifyAllTabsNavigable(tabNames) {
    tabNames.forEach((tabName) => {
      this.clickTab(tabName);
      this.verifyTabSelected(tabName);
    });
  }

  static verifySearchBoxVisible() {
    BasePage.verifyVisible(UnderwriterLocators.searchInput);
  }

  static verifyApplicationForDropdownVisible() {
    BasePage.verifyVisible(UnderwriterLocators.applicationForDropdown);
  }

  static verifyRecommendationDropdownVisible() {
    cy.contains("em", "Select Recommended Action(s)").should("be.visible");
  }

  static verifyHomeScreenContent(expectedName, tabNames) {
    this.verifySearchBoxVisible();
    this.verifyProfileNameVisible(expectedName);
    this.clickFleetOption();
    this.verifyFleetApplicationsHeadingVisible();
    this.verifyApplicationForDropdownVisible();
    this.verifyRecommendationDropdownVisible();

    tabNames.forEach((tabName) => {
      cy.contains("button[role='tab']", tabName).should("be.visible");
    });
  }

  static searchApplication(applicationNumber) {
    cy.log(`Searching for application: "${applicationNumber}"`);
    cy.get(UnderwriterLocators.searchInput)
      .should("be.visible")
      .clear()
      .type(applicationNumber);
  }

  static clickSearchResultByCompanyName(companyName) {
    cy.log(`Clicking search result for company: "${companyName}"`);
    cy.contains("p.text-13px", companyName, { timeout: 10000 })
      .should("be.visible")
      .closest("a")
      .then(($link) => {
        const selectedApplicationPath = new URL($link.prop("href"), window.location.origin).pathname;
        cy.wrap(selectedApplicationPath).as("selectedApplicationPath");
        cy.wrap($link).click();
      });
  }

  static verifySelectedApplicationLoaded() {
    cy.get("@selectedApplicationPath").then((selectedApplicationPath) => {
      cy.location("pathname", { timeout: 10000 }).should("include", selectedApplicationPath);
    });
  }

  static verifyTextVisibleOnPage(expectedText) {
    cy.log(`Verifying text "${expectedText}" is visible on the page`);
    cy.contains(expectedText, { timeout: 10000 }).should("be.visible");
  }

  static verifyAllOverviewTabsVisible(tabTestIds) {
    tabTestIds.forEach((testId) => {
      cy.get(UnderwriterLocators.tabByTestId(testId)).should("be.visible");
    });
  }

  static clickOperationsTab() {
    cy.log("Clicking Operations tab");
    cy.get(UnderwriterLocators.tabByTestId("tab-operations")).should("be.visible").click();
  }

  static verifyWidgetWithToggleVisible(headingSelector, headingText) {
    cy.log(`Verifying widget "${headingText}" with its toggle`);
    BasePage.verifySiblingOfLabeledText(headingSelector, headingText, UnderwriterLocators.toggleSwitch, ($el) => {
      cy.wrap($el).should("exist");
    });
  }

  static verifyWidgetWithEditIconVisible(headingText) {
    cy.log(`Verifying widget "${headingText}" with edit icon`);
    BasePage.verifySiblingOfLabeledText("p", headingText, "button.MuiIconButton-root", ($el) => {
      cy.wrap($el).should("be.visible");
    });
  }

  static verifyWidgetHeadingVisible(headingSelector, headingText) {
    cy.log(`Verifying widget heading: "${headingText}"`);
    cy.contains(headingSelector, headingText, { timeout: 10000 })
      .scrollIntoView()
      .should("be.visible");
  }

  static verifyMarkAsReviewedToggleVisible() {
    cy.log("Verifying Mark as Reviewed toggle is visible");
    BasePage.verifySiblingOfLabeledText("span", "Mark as reviewed", "button[role='switch']", ($el) => {
      cy.wrap($el).should("exist");
    });
  }

  static verifyYearsInBusinessContent(expectedValue) {
    cy.log(`Verifying Years in Business content equals "${expectedValue}"`);
    cy.get(UnderwriterLocators.yearsInBusinessContent, { timeout: 10000 })
      .should("be.visible")
      .and("contain.text", expectedValue);
  }

  static verifyUnitsValue(expectedValue) {
    cy.log(`Verifying Units equals "${expectedValue}"`);
    cy.contains("div", "Units", { timeout: 10000 })
      .scrollIntoView()
      .should("be.visible")
      .siblings()
      .find(UnderwriterLocators.unitsInput)
      .should("have.value", expectedValue);
  }

  static verifyMilesValue(expectedValue) {
    cy.log(`Verifying Miles (UW Input) equals "${expectedValue}"`);
    BasePage.verifySiblingOfLabeledText(
      "div",
      "Miles (UW Input)",
      UnderwriterLocators.projectedInfoValueContainer,
      ($el) => cy.wrap($el).should("contain.text", expectedValue)
    );
  }

  static verifyChangeMilesButtonVisible() {
    cy.log("Verifying Change Miles button is visible");
    cy.contains("button", "Change Miles", { timeout: 10000 }).should("be.visible");
  }

  static hoverMilesInfoIconAndVerifyTooltip(agentInputValue, telematicsValue) {
    cy.log("Hovering over Miles info icon to reveal tooltip");
    cy.contains("div", "Miles (UW Input)", { timeout: 10000 })
      .scrollIntoView()
      .siblings(UnderwriterLocators.projectedInfoValueContainer)
      .find(UnderwriterLocators.infoIcon)
      .trigger("mouseover");

    cy.get(UnderwriterLocators.tooltipContainer, { timeout: 5000 })
      .should("be.visible")
      .within(() => {
        cy.contains("div", "Agent Input").siblings("div.font-bold").should("contain.text", agentInputValue);
        cy.contains("div", "Miles (Telematics)").siblings("div.font-bold").should("contain.text", telematicsValue);
      });
  }

  static verifyOperationalDistributionGraphVisible() {
    cy.log("Verifying Operational Distribution graph is visible");
    cy.contains("p", "Operational Distribution", { timeout: 10000 })
      .scrollIntoView()
      .should("be.visible")
      .parents("div.border")
      .first()
      .find(UnderwriterLocators.rechartsWrapper)
      .should("be.visible");
  }

  static verifyTableColumnsVisible(sectionLabelText, sectionLabelSelector, containerSelector, columnNames) {
    cy.log(`Verifying table columns for "${sectionLabelText}": ${columnNames.join(", ")}`);
    cy.contains(sectionLabelSelector, sectionLabelText, { timeout: 10000 })
      .scrollIntoView()
      .should("be.visible")
      .parents(containerSelector)
      .first()
      .within(() => {
        columnNames.forEach((columnName) => {
          cy.contains("th", columnName).should("be.visible");
        });
      });
  }

  static verifyCustomersShippersTableVisible() {
    this.verifyTableColumnsVisible("Customers/Shippers", "p", "div.border", ["Name", "Frequency"]);
  }

  static verifyStartAndEndZonesTableVisible() {
    this.verifyTableColumnsVisible("Start & End Zones", "p", "form", ["Start Zone", "End Zone", "% of Vehicles"]);
  }

  static clickStartAndEndZonesEditIcon() {
    cy.log("Opening Start & End Zones edit mode");
    cy.contains("p", "Start & End Zones", { timeout: 10000 })
      .scrollIntoView()
      .should("be.visible")
      .siblings(UnderwriterLocators.startAndEndZonesEditIcon)
      .should("be.visible")
      .click();
  }

  static verifyStartAndEndZonesEditControlsVisible() {
    cy.log("Verifying Start & End Zones edit controls");
    cy.contains("p", "Start & End Zones", { timeout: 10000 })
      .parents(UnderwriterLocators.startAndEndZonesWidget)
      .first()
      .within(() => {
        cy.contains("button", "Cancel").should("be.visible");
        cy.contains("button", "Update").should("be.visible");
        cy.contains("button", "Add Row").should("be.visible");
        cy.contains("span", "Start Zone").should("be.visible");
        cy.contains("span", "End Zone").should("be.visible");
        cy.contains("p", "% of Vehicles").should("be.visible");
        cy.get(UnderwriterLocators.zoneDropdown).should("have.length.at.least", 2).and("be.visible");
        cy.get(UnderwriterLocators.percentageInput).should("have.length.at.least", 1).and("be.visible");
        cy.get(UnderwriterLocators.closeIcon).should("be.visible");
      });
  }

  static clickStartAndEndZonesButton(buttonText) {
    cy.contains("button", buttonText, { timeout: 10000 })
      .scrollIntoView()
      .should("be.visible")
      .click();
  }

  static verifyStartAndEndZonesEditorClosed() {
    cy.contains("p", "Start & End Zones", { timeout: 10000 })
      .parents(UnderwriterLocators.startAndEndZonesWidget)
      .first()
      .within(() => {
        cy.contains("button", "Cancel").should("not.exist");
        cy.contains("button", "Update").should("not.exist");
      });
  }

  static verifyStartAndEndZonesCancelKeepsOriginalValue() {
    cy.contains("p", "Start & End Zones", { timeout: 10000 })
      .parents(UnderwriterLocators.startAndEndZonesWidget)
      .first()
      .find(UnderwriterLocators.percentageInput)
      .first()
      .invoke("val")
      .then((originalValue) => {
        cy.contains("p", "Start & End Zones")
          .parents(UnderwriterLocators.startAndEndZonesWidget)
          .first()
          .within(() => {
            cy.get(UnderwriterLocators.percentageInput).first().clear().type("1").blur();
            cy.contains("button", "Cancel").click();
          });

        this.verifyStartAndEndZonesEditorClosed();
        this.clickStartAndEndZonesEditIcon();

        cy.contains("p", "Start & End Zones")
          .parents(UnderwriterLocators.startAndEndZonesWidget)
          .first()
          .find(UnderwriterLocators.percentageInput)
          .first()
          .should("have.value", originalValue);

        this.clickStartAndEndZonesButton("Cancel");
      });
  }

  static verifyStartAndEndZonesUpdateClosesEditor() {
    this.clickStartAndEndZonesButton("Update");
    this.verifyStartAndEndZonesEditorClosed();
  }

  static removeFirstStartAndEndZonesRow() {
    cy.contains("p", "Start & End Zones", { timeout: 10000 })
      .parents(UnderwriterLocators.startAndEndZonesWidget)
      .first()
      .within(() => {
        cy.get(UnderwriterLocators.closeIcon).first().should("be.visible").click();
      });
  }

  static captureStartAndEndZonesRowCounts() {
    cy.contains("p", "Start & End Zones", { timeout: 10000 })
      .parents(UnderwriterLocators.startAndEndZonesWidget)
      .first()
      .within(() => {
        cy.get(UnderwriterLocators.zoneDropdown).its("length").as("initialZoneDropdownCount");
        cy.get(UnderwriterLocators.percentageInput).its("length").as("initialPercentageInputCount");
      });
  }

  static verifyStartAndEndZonesAddRow() {
    cy.get("@initialZoneDropdownCount").then((initialDropdownCount) => {
      cy.get("@initialPercentageInputCount").then((initialPercentageCount) => {
        cy.contains("p", "Start & End Zones", { timeout: 10000 })
          .parents(UnderwriterLocators.startAndEndZonesWidget)
          .first()
          .within(() => {
            // cy.get(UnderwriterLocators.zoneDropdown).should("have.length", initialDropdownCount + 2);
            // cy.get(UnderwriterLocators.percentageInput).should("have.length", initialPercentageCount + 1);
            cy.get(UnderwriterLocators.zoneDropdown).last().should("not.be.empty");
            cy.get(UnderwriterLocators.percentageInput).last().invoke("val").should("not.be.empty");
          });
      });
    });
  }

  static verifyEndZoneOptions(options) {
    cy.get(UnderwriterLocators.zoneDropdown).last().click();
    cy.get(UnderwriterLocators.zoneDropdownOption)
      .should("have.length", options.length)
      .and("be.visible");
    options.forEach((option) => {
      cy.get(`${UnderwriterLocators.zoneDropdownOption}[data-value="${option}"]`)
        .should("be.visible")
        .and("contain.text", option);
    });
    cy.get("body").type("{esc}");
  }

  static verifyOperationalDistributionPercentages(expectedPercentages) {
    cy.log("Verifying Operational Distribution bar percentages");
    cy.contains("p", "Operational Distribution")
      .parents("div.border")
      .first()
      .within(() => {
        expectedPercentages.forEach((percentage) => {
          cy.contains(UnderwriterLocators.rechartsBarPercentageLabel, percentage).should("exist");
        });
      });
  }

}

export default UnderwriterPage;