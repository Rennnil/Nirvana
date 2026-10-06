import LoginPage from "../../../pages/AgentApp/NonFleet/LoginPage";
import UnderwriterPage from "../../../pages/UnderwriterApp/Fleet/UnderwriterPage";
import UnderwriterTestData from "../../../testData/UnderwriterTestData";
import UnderwriterLocators from "../../../locators/UnderwriterApp/Fleet/UnderwriterLocators";

describe("Nirvana Underwriter Portal - Fleet Module", () => {
    const email = Cypress.env("agentEmail");
    const password = Cypress.env("agentPassword");
    const expectedName = Cypress.env("Super Test");

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
        UnderwriterPage.verifyHomeScreenContent(expectedName, UnderwriterTestData.fleet.tabs);
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

        UnderwriterPage.verifySelectedApplicationLoaded();
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

    it("TC13: verify Start & End Zones edit controls", () => {
        UnderwriterPage.clickStartAndEndZonesEditIcon();
        UnderwriterPage.verifyStartAndEndZonesEditControlsVisible();
        UnderwriterPage.clickStartAndEndZonesButton("Cancel");
    });

    it("TC14: verify Cancel closes editor without saving changes", () => {
        UnderwriterPage.clickStartAndEndZonesEditIcon();
        UnderwriterPage.verifyStartAndEndZonesCancelKeepsOriginalValue();
    });

    it("TC15: verify Update closes Start & End Zones editor", () => {
        UnderwriterPage.clickStartAndEndZonesEditIcon();
        UnderwriterPage.verifyStartAndEndZonesUpdateClosesEditor();
    });

    it("TC16: verify Add Row adds a predefined Start & End Zones row", () => {
        UnderwriterPage.clickStartAndEndZonesEditIcon();
        UnderwriterPage.removeFirstStartAndEndZonesRow();
        UnderwriterPage.captureStartAndEndZonesRowCounts();
        UnderwriterPage.clickStartAndEndZonesButton("Add Row");
        UnderwriterPage.verifyStartAndEndZonesAddRow();
        UnderwriterPage.clickStartAndEndZonesButton("Cancel");
    });

    it("TC17: verify End Zone dropdown options", () => {
        UnderwriterPage.clickStartAndEndZonesEditIcon();
        UnderwriterPage.removeFirstStartAndEndZonesRow();
        UnderwriterPage.clickStartAndEndZonesButton("Add Row");
        UnderwriterPage.verifyEndZoneOptions([
            "40 - Pacific Coast (CA, OR, WA)",
            "41 - Mountain Zone (AZ, CO, ID, MT, NM, NV, UT, WY)",
            "42 - Midwest (IA, KS, MN, MO, ND, NE, SD, WI)",
            "43 - Southwest (AR, OK, TX)",
            "44 - North Central (IL, IN, MI, OH)",
            "45 - Mideast (KY, TN, WV)",
            "46 - Gulf Zone (AL, LA, MS)",
            "47 - Southeast (FL, GA, NC, SC, VA)",
            "48 - Eastern Zone (DC, DE, MD, NJ, NY, PA)",
            "49 - New England (CT, ME, NH, VT)",
        ]);
        UnderwriterPage.clickStartAndEndZonesButton("Cancel");
    });

    it("TC18: verify Operational Distribution edit details", () => {
        UnderwriterPage.openOperationalDistributionEditor();
        UnderwriterPage.verifyOperationalDistributionEditorDetails();
        UnderwriterPage.clickOperationalDistributionEditorButton("Cancel");
        // UnderwriterPage.operationalDistributionWidget().within(() => {
        //     cy.contains("button", "Cancel").should("not.exist");
        //     cy.contains("button", "Update").should("not.exist");
        // });
    });

    it("TC19: verify Cancel discards Operational Distribution percentage changes", () => {
        UnderwriterPage.openOperationalDistributionEditor();
        UnderwriterPage.changeOperationalDistributionPercentages();
        UnderwriterPage.clickOperationalDistributionEditorButton("Cancel");
        // UnderwriterPage.operationalDistributionWidget().within(() => {
        //     cy.contains("button", "Cancel").should("not.exist");
        //     cy.contains("button", "Update").should("not.exist");
        // });

        UnderwriterPage.openOperationalDistributionEditor();
        cy.get("@originalOperationalDistributionPercentages").then((originalValues) => {
            UnderwriterPage.verifyOperationalDistributionEditorPercentages(originalValues);
        });
        UnderwriterPage.clickOperationalDistributionEditorButton("Cancel");
    });

    it("TC20: verify Update applies Operational Distribution percentages to the graph", () => {
        UnderwriterPage.openOperationalDistributionEditor();
        UnderwriterPage.changeOperationalDistributionPercentages();
        UnderwriterPage.clickOperationalDistributionEditorButton("Update");
        // UnderwriterPage.operationalDistributionWidget().within(() => {
        //     cy.contains("button", "Cancel").should("not.exist");
        //     cy.contains("button", "Update").should("not.exist");
        // });

        cy.get("@updatedOperationalDistributionPercentages").then((percentages) => {
            UnderwriterPage.verifyOperationalDistributionUpdatedBarPercentages([
                `${percentages[0]}%`,
                `${percentages[1]}%`,
                `${percentages[2]}%`,
                `${percentages[3]}%`,
            ]);
        });

    });

    it("TC21: verify Commodities editor columns and maximum of 10 commodity rows", () => {
        UnderwriterPage.openCommoditiesEditor();
        UnderwriterPage.verifyCommoditiesEditorDetails();
        UnderwriterPage.clickCommoditiesEditorButton("Cancel");
    });

    it("TC22: verify Commodity Category dropdown options", () => {
        UnderwriterPage.openCommoditiesEditor();
        UnderwriterPage.openFirstCommodityCategoryDropdown();
        UnderwriterPage.verifyCommodityCategoryOptions();
        cy.get("body").type("{esc}");
        UnderwriterPage.clickCommoditiesEditorButton("Cancel");
    });

});