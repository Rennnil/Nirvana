import LoginPage from "../../pages/LoginPage";
import DashboardPage from "../../pages/DashboardPage";
import InsuredDetailsPage from "../../pages/InsuredDetailsPage";
import DataGenerator from "../../support/utils/DataGenerator";
import OperationsPage from "../../pages/OperationsPage";
import EquipmentPage from "../../pages/EquipmentPage";
import DriversPage from "../../pages/DriversPage";
import IndicationPage from "../../pages/IndicationPage";
import ReviewPage from "../../pages/ReviewPage";
import TestData from "../../testData/TestData";

describe("Nirvana Agent Portal - Non-Fleet Flow", () => {
  const email = Cypress.env("agentEmail");
  const password = Cypress.env("agentPassword");
  const expectedName = Cypress.env("agentName");
  const category = TestData.nonFleet.category;

  let operationsData = {};
  let equipmentVins = [];
  let driversCdlNumbers = [];
  let selectedOperatingClass = "";
  let selectedPlanName = "";

  let insuredDetails;
  let fetchedCompanyName;

  before(() => {
    cy.fixture("nonFleetInsuredData").then((fixtureData) => {
      insuredDetails = {
        ...fixtureData,
        effectiveDate: DataGenerator.getCurrentFormattedDate(),
        powerUnits: DataGenerator.getPowerUnitsCount(),
      };
      cy.log(`Loaded insured details: ${JSON.stringify(insuredDetails)}`);
    });

    cy.loginIfNeeded(email, password, expectedName);
  });

  it("TC01: display dashboard with agent name after login", { tags: "@NonFleet" }, () => {
    DashboardPage.verifyAgentNameVisible(expectedName);
  });

  it("TC02: select Non-Fleet category from dropdown", { tags: "@NonFleet" }, () => {
    DashboardPage.selectCategory(category);
  });

  it("TC03: verify New Application button is visible and click it", { tags: "@NonFleet" }, () => {
    DashboardPage.verifyNewApplicationButtonVisible();
    DashboardPage.clickNewApplicationButton();
  });

  it("TC04: verify popup text after clicking New Application", { tags: "@NonFleet" }, () => {
    InsuredDetailsPage.verifyPopupVisible(TestData.nonFleet.popupText);
  });

  it("TC05: fill insured details and continue", { tags: "@NonFleet" }, () => {
    InsuredDetailsPage.fillInsuredDetails(insuredDetails).then(
      (companyName) => {
        fetchedCompanyName = companyName;
        cy.log(`Captured company name for later verification: "${companyName}"`);
      },
    );
    InsuredDetailsPage.clickContinue();
  });

  it("TC06: select 'No' on the follow-up popup", { tags: "@NonFleet" }, () => {
    InsuredDetailsPage.clickNoOption();
  });

  it("TC07: verify Operations screen with correct DOT and company name", () => {
    cy.wrap(null).then(() => {
      expect(fetchedCompanyName, "Company name should have been captured in TC05").to.exist;
      OperationsPage.verifyOperationsScreen(insuredDetails.dotNumber, fetchedCompanyName);
    });
  });

  it("TC08: should NOT proceed to Equipment screen without filling Operations form", () => {
    OperationsPage.verifyProceedBlockedWithoutData();
  });

  it("TC09: verify prefilled data and fill Operations form completely", { tags: "@NonFleet" }, () => {
    OperationsPage.verifyEffectiveDate(insuredDetails.effectiveDate);
    OperationsPage.verifyProducer(insuredDetails.producer);
    OperationsPage.verifyCoverageCheckboxState("Auto Liability", true);

    operationsData = TestData.nonFleet.operations;

    OperationsPage.fillOperationsForm({
      ...operationsData,
      dob: DataGenerator.getRandomDob(),
    }).then((capturedClass) => {
      selectedOperatingClass = capturedClass;
      cy.log(`Captured selected operating class: "${selectedOperatingClass}"`);
    });

    OperationsPage.clickProceed();
  });

  it("TC10: should NOT proceed without filling Equipment details and show 'Please enter make' error", () => {
    EquipmentPage.verifyEquipmentHeadingVisible();
    EquipmentPage.verifyProceedBlockedWithoutData();
  });

  it("TC11: fill all 5 equipment rows and proceed", { tags: "@NonFleet" }, () => {
    cy.fixture("equipmentVinData").then((vinData) => {
      equipmentVins = vinData.vinNumbers;
      EquipmentPage.fillAllEquipmentRowsAndProceed(vinData.vinNumbers, TestData.nonFleet.equipmentStatedValue);
    });
  });

  it("TC12: should NOT proceed without filling Drivers details and show 'Please enter DL number' error", () => {
    DriversPage.verifyProceedBlockedWithoutData();
  });

  it("TC13: fill all driver rows and proceed", { tags: "@NonFleet" }, () => {
    cy.fixture("driversCdlData").then((cdlData) => {
      driversCdlNumbers = cdlData.drivers.map((d) => d.cdlNumber);
      DriversPage.fillAllDriverRowsAndProceed(
        cdlData.drivers,
        () => DataGenerator.getRandomDobForDriver(),
        () => DataGenerator.getRandomDateOfHire(),
      );
    });
  });

  it("TC14: should NOT proceed without connecting telematics and show error", { tags: "@NonFleet" }, () => {
    IndicationPage.verifyIndicationHeadingVisible();
    IndicationPage.verifyProceedBlockedWithoutTelematics();
  });

  it("TC15: verify default Deductible and Limits values", { tags: "@NonFleet" }, () => {
    IndicationPage.verifyDefaultDeductibleAndLimits("$1,000", "$1,000,000");
  });

  it("TC16: update Deductible/Limits, connect telematics, select plan, and proceed", { tags: "@NonFleet" }, () => {
    IndicationPage.completeIndicationScreen(TestData.nonFleet.indication).then((capturedPlan) => {
      selectedPlanName = capturedPlan;
      cy.log(`Captured selected plan: "${selectedPlanName}"`);
    });
  });

  it("TC17: verify Review screen heading", () => {
    ReviewPage.verifyReviewHeadingVisible();
  });

  it("TC18: verify all entered details and submit application", { tags: "@NonFleet" }, () => {
    ReviewPage.verifyOperationsSection({
      effectiveDate: insuredDetails.effectiveDate,
      producer: insuredDetails.producer,
      businessOwnerName: `${operationsData.firstName} ${operationsData.lastName}`,
      primaryOperatingClass: selectedOperatingClass,
      farthestRadius: operationsData.farthestRadiusOption,
      allClaims: operationsData.allClaimsCount,
      primaryCommodity: TestData.nonFleet.review.primaryCommodity,
    });

    ReviewPage.verifyEquipmentSection(equipmentVins);
    ReviewPage.verifyDriversSection(driversCdlNumbers);

    ReviewPage.verifyIndicationSection({
      deductibleValue: TestData.nonFleet.indication.deductibleOption,
      limitsValue: TestData.nonFleet.indication.limitsOption,
      telematicsEmail: Cypress.env("agentEmail"),
      planName: selectedPlanName,
    });

    ReviewPage.submitAndVerifySuccess();
  });

  it("TC19: log out from the application", () => {
    cy.wait(1000);
    DashboardPage.logout();
    cy.url().should("include", "/login");
  });
});