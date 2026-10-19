import DashboardPage from "../../../pages/AgentApp/NonFleet/DashboardPage";
import FleetApplicationPage from "../../../pages/AgentApp/Fleet/FleetApplicationPage";
import OperationsPage from "../../../pages/AgentApp/NonFleet/OperationsPage";
import DataGenerator from "../../../support/utils/DataGenerator";
import FleetAgentTestData from "../../../testData/FleetAgentAppTestData";

describe("Fleet Agent App Test", () => {
  it("Logs in and creates a fleet application with DOT and agency details", () => {
    cy.loginIfNeeded(
      FleetAgentTestData.emailText,
      FleetAgentTestData.passwordText,
      FleetAgentTestData.agentName,
    );

    DashboardPage.selectCategory(FleetAgentTestData.applicationCategory);
    DashboardPage.verifyNewApplicationButtonVisible();
    DashboardPage.clickNewApplicationButton();
    FleetApplicationPage.verifyDialogVisible();

    FleetApplicationPage.enterDotNumber(
      FleetAgentTestData.application.dotNumber,
    );
    FleetApplicationPage.verifyCompanyNameAutoFetched(
      FleetAgentTestData.application.companyName,
    );
    FleetApplicationPage.enterEffectiveDate(
      DataGenerator.getCurrentFormattedDate(),
    );
    FleetApplicationPage.enterPowerUnits(
      FleetAgentTestData.application.powerUnits,
    );

    FleetApplicationPage.verifyProducerAndMarketerDisabled();
    FleetApplicationPage.selectAgency(FleetAgentTestData.application.agency);
    FleetApplicationPage.selectProducer(
      FleetAgentTestData.application.producer,
    );
    FleetApplicationPage.selectMarketer(
      FleetAgentTestData.application.marketer,
    );

    FleetApplicationPage.clickContinue();
    FleetApplicationPage.clickNoOption();
    OperationsPage.verifyDotNumberVisible(
      FleetAgentTestData.application.dotNumber,
    );
    OperationsPage.verifyCompanyNameVisible(
      FleetAgentTestData.application.companyName,
    );
  });
});
