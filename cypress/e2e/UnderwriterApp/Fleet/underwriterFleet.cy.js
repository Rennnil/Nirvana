import LoginPage from "../../../pages/AgentApp/NonFleet/LoginPage";
import UnderwriterPage from "../../../pages/UnderwriterApp/Fleet/UnderwriterPage";
import UnderwriterTestData from "../../../testData/UnderwriterTestData";
import UnderwriterLocators from "../../../locators/UnderwriterApp/Fleet/UnderwriterLocators";

describe("Nirvana Underwriter Portal - Fleet Module", () => {
    const email = Cypress.env("agentEmail");
    const password = Cypress.env("agentPassword");
    const expectedName = Cypress.env("agentName");

    before(() => {
        cy.underwriterFreshLogin(email, password, expectedName);
    });

    it("TC01: verify Fleet Applications heading is visible", () => {
        UnderwriterPage.verifyFleetApplicationsHeadingVisible();
    });

    it("TC02: verify 'Ready for Review' tab is selected by default on home screen", () => {
        UnderwriterPage.verifyTabSelected("Ready for Review");
    });

    it("TC03: verify all key UI elements are visible on the home screen", () => {
        UnderwriterPage.verifySearchBoxVisible();
        UnderwriterPage.verifyProfileNameVisible(expectedName);
        UnderwriterPage.clickFleetOption();
        UnderwriterPage.verifyFleetApplicationsHeadingVisible();
        UnderwriterPage.verifyApplicationForDropdownVisible();
        UnderwriterPage.verifyRecommendationDropdownVisible();
        // UnderwriterPage.verifyDateFromFieldVisible();
        // UnderwriterPage.verifyDateToFieldVisible();

        UnderwriterTestData.fleet.tabs.forEach((tabName) => {
            cy.contains("button[role='tab']", tabName).should("be.visible");
        });
    });

    it("TC04: verify Logout button is displayed when clicking profile section", () => {
        UnderwriterPage.clickProfile();
        UnderwriterPage.verifyLogoutButtonVisible();
        UnderwriterPage.closeProfileMenu();
    });

    it("TC05: verify navigation across all application status tabs", () => {
        UnderwriterPage.verifyAllTabsNavigable(UnderwriterTestData.fleet.tabs);
    });

    it("TC06: search application by number, open it, and verify application number and company name", () => {

        UnderwriterPage.searchApplication(UnderwriterTestData.applicationNumber);
        UnderwriterPage.clickSearchResultByCompanyName(UnderwriterTestData.companyName);

        UnderwriterPage.verifyTextVisibleOnPage(UnderwriterTestData.applicationNumber);
        UnderwriterPage.verifyTextVisibleOnPage(UnderwriterTestData.companyName);
    });

    it("TC07: verify Application Overview tabs and Operations screen widgets", () => {
        UnderwriterPage.verifyAllOverviewTabsVisible(UnderwriterTestData.overviewTabs);

        UnderwriterPage.clickOperationsTab();

        UnderwriterPage.verifyMarkAsReviewedToggleVisible();

        UnderwriterPage.verifyWidgetHeadingVisible(UnderwriterLocators.widgetHeadingH2, "Years in Business");
        UnderwriterPage.verifyWidgetHeadingVisible(UnderwriterLocators.widgetHeadingBoldP, "Projected Information");

        UnderwriterPage.verifyWidgetWithEditIconVisible("Terminal Locations");

        UnderwriterPage.verifyWidgetHeadingVisible(UnderwriterLocators.widgetHeadingBoldP, "Radius of Operation");
        UnderwriterPage.verifyWidgetWithEditIconVisible("Operational Distribution");
        UnderwriterPage.verifyWidgetWithEditIconVisible("Start & End Zones");

        UnderwriterPage.verifyWidgetHeadingVisible(UnderwriterLocators.widgetHeadingH2, "Operating Classes");
        UnderwriterPage.verifyWidgetWithEditIconVisible("Commodities");

        UnderwriterPage.verifyWidgetHeadingVisible(UnderwriterLocators.widgetHeadingBoldP, "Fleet History");
        UnderwriterPage.verifyWidgetHeadingVisible(UnderwriterLocators.widgetHeadingBoldP, "Hazard Zones");

    });

    it("TC08: verify Years in Buiness Content", { tags: "@UnderwriterFleet" }, () => {
        UnderwriterPage.verifyWidgetHeadingVisible(UnderwriterLocators.widgetHeadingH2, "Years in Business");
        UnderwriterPage.verifyYearsInBusinessContent("41 years 6 months")
    });

    it("TC09: verify Projected Information Content", () => {
        UnderwriterPage.verifyWidgetHeadingVisible(UnderwriterLocators.widgetHeadingBoldP, "Projected Information");

        UnderwriterPage.verifyMilesValue("-");
        UnderwriterPage.verifyUnitsValue("15");
    })

    it("TC10: verify Projected Information Content with i icon", () => {
        UnderwriterPage.verifyWidgetHeadingVisible(UnderwriterLocators.widgetHeadingBoldP, "Projected Information");

        UnderwriterPage.hoverMilesInfoIconAndVerifyTooltip("15,000 Miles", "Insufficient Data");
        UnderwriterPage.verifyChangeMilesButtonVisible();
    })

    it("TC11: verify Operational Distribution, Customers/Shippers, and Start & End Zones sections", () => {
        UnderwriterPage.verifyWidgetWithEditIconVisible("Operational Distribution");
        UnderwriterPage.verifyOperationalDistributionGraphVisible();

        UnderwriterPage.verifyCustomersShippersTableVisible();

        UnderwriterPage.verifyWidgetWithEditIconVisible("Start & End Zones");
        UnderwriterPage.verifyStartAndEndZonesTableVisible();
    });

    it("TC12: verify Operational Distribution chart percentages", () => {
        UnderwriterPage.verifyOperationalDistributionPercentages(["14%", "34%", "34%", "18%", "0%"]);
    });



});