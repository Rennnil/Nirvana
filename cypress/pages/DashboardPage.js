import DashboardLocators from "../locators/DashboardLocators";
import Helpers from "../support/Utils/Helpers";
import BasePage from "./BasePage";

class DashboardPage {
  static verifyAgentNameVisible(expectedName) {
    BasePage.verifyVisible(DashboardLocators.agentNameText, expectedName, 10000);
  }

  static openProfileDropdown() {
    BasePage.clickVisible(DashboardLocators.profileDropdown);
  }

  static clickSignOut() {
    BasePage.clickVisible(DashboardLocators.signOutButton);
  }

  static logout() {
    cy.log("Logging out agent");
    this.openProfileDropdown();
    this.clickSignOut();
  }

  static selectCategory(categoryName) {
    cy.log(`Selecting category: ${categoryName}`);
    Helpers.selectMuiDropdownOption(
      DashboardLocators.categorySelect,
      categoryName,
      "listbox",
    );

    cy.get(DashboardLocators.categorySelect)
      .should("contain.text", categoryName)
      .then(($el) => {
        const actualText = $el.text().trim();
        cy.log(`Category select now shows: "${actualText}"`);
        expect(actualText).to.eq(categoryName);
      });
  }

  static verifyNewApplicationButtonVisible() {
    cy.log("Verifying 'New Application' button is visible");
    BasePage.verifyVisible(DashboardLocators.newApplicationButton, null, 10000);
  }

  static clickNewApplicationButton() {
    BasePage.clickVisible(DashboardLocators.newApplicationButton);
  }
}

export default DashboardPage;