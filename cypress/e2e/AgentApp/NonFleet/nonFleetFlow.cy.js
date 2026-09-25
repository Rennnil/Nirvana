// import LoginPage from "../../../pages/AgentApp/NonFleet/LoginPage";
// import DashboardPage from "../../../pages/AgentApp/NonFleet/DashboardPage";
// import InsuredDetailsPage from "../../../pages/AgentApp/NonFleet/InsuredDetailsPage";
// import DataGenerator from "../../../support/utils/DataGenerator";
// import OperationsPage from "../../../pages/AgentApp/NonFleet/OperationsPage";
// import EquipmentPage from "../../../pages/AgentApp/NonFleet/EquipmentPage";
// import DriversPage from "../../../pages/AgentApp/NonFleet/DriversPage";
// import IndicationPage from "../../../pages/AgentApp/NonFleet/IndicationPage";
// import ReviewPage from "../../../pages/AgentApp/NonFleet/ReviewPage";
// import TestData from "../../../testData/TestData";


// // describe("Nirvana Agent Portal - Non-Fleet Flow", () => {
// //   const email = Cypress.env("agentEmail");
// //   const password = Cypress.env("agentPassword");
// //   const expectedName = Cypress.env("Super Test");
// //   const category = TestData.nonFleet.category;

// //   let operationsData = {};
// //   let equipmentVins = [];
// //   let driversCdlNumbers = [];
// //   let selectedOperatingClass = "";
// //   let selectedPlanName = "";

// //   let insuredDetails;
// //   let fetchedCompanyName;

// //   before(() => {
// //     cy.fixture("AgentApp/NonFleet/nonFleetInsuredData").then((fixtureData) => {
// //       insuredDetails = {
// //         ...fixtureData,
// //         effectiveDate: DataGenerator.getCurrentFormattedDate(),
// //         powerUnits: DataGenerator.getPowerUnitsCount(),
// //       };
// //       cy.log(`Loaded insured details: ${JSON.stringify(insuredDetails)}`);
// //     });

// //     cy.loginIfNeeded(email, password, expectedName);
// //   });

// //   it("TC01: display dashboard with agent name after login", { tags: "@NonFleet" }, () => {
// //     DashboardPage.verifyAgentNameVisible(expectedName);
// //   });

// //   it("TC02: select Non-Fleet category from dropdown", { tags: "@NonFleet" }, () => {
// //     DashboardPage.selectCategory(category);
// //   });

// //   it("TC03: verify New Application button is visible and click it", { tags: "@NonFleet" }, () => {
// //     DashboardPage.verifyNewApplicationButtonVisible();
// //     DashboardPage.clickNewApplicationButton();
// //   });

// //   it("TC04: verify popup text after clicking New Application", { tags: "@NonFleet" }, () => {
// //     InsuredDetailsPage.verifyPopupVisible(TestData.nonFleet.popupText);
// //   });

// //   it("TC05: fill insured details and continue", () => {
// //     InsuredDetailsPage.fillInsuredDetails(insuredDetails).then((companyName) => {
// //       fetchedCompanyName = companyName;
// //       cy.log(`Captured company name for later verification: "${companyName}"`);
// //     });
// //     InsuredDetailsPage.clickContinue();
// //   });

// //   it("TC06: select 'No' on the follow-up popup", { tags: "@NonFleet" }, () => {
// //     InsuredDetailsPage.clickNoOption();
// //   });

// //   it("TC07: verify Operations screen with correct DOT and company name", () => {
// //     cy.wrap(null).then(() => {
// //       expect(fetchedCompanyName, "Company name should have been captured in TC05").to.exist;
// //       OperationsPage.verifyOperationsScreen(insuredDetails.dotNumber, fetchedCompanyName);
// //     });
// //   });

// //   it("TC08: should NOT proceed to Equipment screen without filling Operations form", () => {
// //     OperationsPage.verifyProceedBlockedWithoutData();
// //   });

// //   it("TC09: verify prefilled data and fill Operations form completely", { tags: "@NonFleet" }, () => {
// //     OperationsPage.verifyEffectiveDate(insuredDetails.effectiveDate);
// //     OperationsPage.verifyProducer(insuredDetails.producer);
// //     OperationsPage.verifyCoverageCheckboxState("Auto Liability", true);

// //     operationsData = TestData.nonFleet.operations;

// //     OperationsPage.fillOperationsForm({
// //       ...operationsData,
// //       dob: DataGenerator.getRandomDob(),
// //     }).then((capturedClass) => {
// //       selectedOperatingClass = capturedClass;
// //       cy.log(`Captured selected operating class: "${selectedOperatingClass}"`);
// //     });

// //     OperationsPage.clickProceed();
// //     OperationsPage.handleSsnPopupIfPresent();
// //   });

// //   it("TC10: should NOT proceed without filling Equipment details and show 'Please enter make' error", () => {
// //     EquipmentPage.verifyEquipmentHeadingVisible();
// //     EquipmentPage.verifyProceedBlockedWithoutData();
// //   });

// //   it("TC11: fill all 5 equipment rows and proceed", { tags: "@NonFleet" }, () => {
// //     cy.fixture("AgentApp/NonFleet/equipmentVinData").then((vinData) => {
// //       equipmentVins = vinData.vinNumbers;
// //       EquipmentPage.fillAllEquipmentRowsAndProceed(vinData.vinNumbers, TestData.nonFleet.equipmentStatedValue);
// //     });
// //   });

// //   it("TC12: should NOT proceed without filling Drivers details and show 'Please enter DL number' error", () => {
// //     DriversPage.verifyProceedBlockedWithoutData();
// //   });

// //   it("TC13: fill all driver rows and proceed", { tags: "@NonFleet" }, () => {
// //     cy.fixture("AgentApp/NonFleet/driversCdlData").then((cdlData) => {
// //       driversCdlNumbers = cdlData.drivers.map((d) => d.cdlNumber);
// //       DriversPage.fillAllDriverRowsAndProceed(
// //         cdlData.drivers,
// //         () => DataGenerator.getRandomDobForDriver(),
// //         () => DataGenerator.getRandomDateOfHire(),
// //       );
// //     });
// //   });

// //   it("TC14: should NOT proceed without connecting telematics and show error", { tags: "@NonFleet" }, () => {
// //     IndicationPage.verifyIndicationHeadingVisible();
// //     IndicationPage.verifyProceedBlockedWithoutTelematics();
// //   });

// //   it("TC15: verify default Deductible and Limits values", { tags: "@NonFleet" }, () => {
// //     IndicationPage.verifyDefaultDeductibleAndLimits(
// //       TestData.nonFleet.indication.defaultDeductible,
// //       TestData.nonFleet.indication.defaultLimits
// //     );
// //   });

// //   it("TC16: update Deductible/Limits, connect telematics, select plan, and proceed", { tags: "@NonFleet" }, () => {
// //     IndicationPage.completeIndicationScreen(TestData.nonFleet.indication).then((capturedPlan) => {
// //       selectedPlanName = capturedPlan;
// //       cy.log(`Captured selected plan: "${selectedPlanName}"`);
// //     });
// //   });

// //   it("TC17: verify Review screen heading", () => {
// //     ReviewPage.verifyReviewHeadingVisible();
// //   });

// //   it("TC18: verify all entered details and submit application", { tags: "@NonFleet" }, () => {
// //     ReviewPage.verifyOperationsSection({
// //       effectiveDate: insuredDetails.effectiveDate,
// //       producer: insuredDetails.producer,
// //       businessOwnerName: `${operationsData.firstName} ${operationsData.lastName}`,
// //       primaryOperatingClass: selectedOperatingClass,
// //       farthestRadius: operationsData.farthestRadiusOption,
// //       allClaims: operationsData.allClaimsCount,
// //       primaryCommodity: TestData.nonFleet.review.primaryCommodity,
// //     });

// //     ReviewPage.verifyEquipmentSection(equipmentVins);
// //     ReviewPage.verifyDriversSection(driversCdlNumbers);

// //     ReviewPage.verifyIndicationSection({
// //       deductibleValue: TestData.nonFleet.indication.deductibleOption,
// //       limitsValue: TestData.nonFleet.indication.limitsOption,
// //       telematicsEmail: Cypress.env("agentEmail"),
// //       planName: selectedPlanName,
// //     });

// //     ReviewPage.submitAndVerifySuccess();
// //   });

// //   it("TC19: log out from the application", () => {
// //     DashboardPage.verifyAgentNameVisible(expectedName);
// //     DashboardPage.logout();
// //     cy.url().should("include", "/login");
// //   });
// // });


// describe("Nirvana Agent Portal - Non-Fleet Flow", () => {
//   const email = Cypress.env("agentEmail");
//   const password = Cypress.env("agentPassword");
//   const expectedName = Cypress.env("Super Test");
//   const category = TestData.nonFleet.category;

//   let operationsData = {};
//   let equipmentVins = [];
//   let driversCdlNumbers = [];
//   let selectedOperatingClass = "";
//   let selectedPlanName = "";

//   let insuredDetails;
//   let fetchedCompanyName;

//   before(() => {
//     cy.fixture("AgentApp/NonFleet/nonFleetInsuredData").then((fixtureData) => {
//       insuredDetails = {
//         ...fixtureData,
//         effectiveDate: DataGenerator.getCurrentFormattedDate(),
//         powerUnits: DataGenerator.getPowerUnitsCount(),
//       };
//     });

//     cy.loginIfNeeded(email, password, expectedName);
//   });

//   it("TC01: Complete Non-Fleet End-to-End Flow", { tags: "@NonFleet" }, () => {

//     // Dashboard
//     DashboardPage.verifyAgentNameVisible(expectedName);

//     // Select Category
//     DashboardPage.selectCategory(category);

//     // New Application
//     DashboardPage.verifyNewApplicationButtonVisible();
//     DashboardPage.clickNewApplicationButton();

//     // Popup Verification
//     InsuredDetailsPage.verifyPopupVisible(TestData.nonFleet.popupText);

//     // Fill Insured Details
//     InsuredDetailsPage.fillInsuredDetails(insuredDetails).then((companyName) => {
//       fetchedCompanyName = companyName;
//     });

//     InsuredDetailsPage.clickContinue();
//     InsuredDetailsPage.clickNoOption();

//     // Operations Screen Validation
//     OperationsPage.verifyOperationsScreen(
//       insuredDetails.dotNumber,
//       fetchedCompanyName
//     );

//     // Negative Validation
//     OperationsPage.verifyProceedBlockedWithoutData();

//     // Verify Prefilled Data
//     OperationsPage.verifyEffectiveDate(insuredDetails.effectiveDate);
//     OperationsPage.verifyProducer(insuredDetails.producer);
//     OperationsPage.verifyCoverageCheckboxState("Auto Liability", true);

//     // Fill Operations
//     operationsData = TestData.nonFleet.operations;

//     OperationsPage.fillOperationsForm({
//       ...operationsData,
//       dob: DataGenerator.getRandomDob(),
//     }).then((capturedClass) => {
//       selectedOperatingClass = capturedClass;
//     });

//     OperationsPage.clickProceed();
//     OperationsPage.handleSsnPopupIfPresent();

//     // Equipment Negative Validation
//     EquipmentPage.verifyEquipmentHeadingVisible();
//     EquipmentPage.verifyProceedBlockedWithoutData();

//     // Fill Equipment
//     cy.fixture("AgentApp/NonFleet/equipmentVinData").then((vinData) => {
//       equipmentVins = vinData.vinNumbers;

//       EquipmentPage.fillAllEquipmentRowsAndProceed(
//         vinData.vinNumbers,
//         TestData.nonFleet.equipmentStatedValue
//       );
//     });

//     // Drivers Negative Validation
//     DriversPage.verifyProceedBlockedWithoutData();

//     // Fill Drivers
//     cy.fixture("AgentApp/NonFleet/driversCdlData").then((cdlData) => {
//       driversCdlNumbers = cdlData.drivers.map(
//         (d) => d.cdlNumber
//       );

//       DriversPage.fillAllDriverRowsAndProceed(
//         cdlData.drivers,
//         () => DataGenerator.getRandomDobForDriver(),
//         () => DataGenerator.getRandomDateOfHire()
//       );
//     });

//     // Indication Negative Validation
//     IndicationPage.verifyIndicationHeadingVisible();
//     IndicationPage.verifyProceedBlockedWithoutTelematics();

//     // Verify Defaults
//     IndicationPage.verifyDefaultDeductibleAndLimits(
//       TestData.nonFleet.indication.defaultDeductible,
//       TestData.nonFleet.indication.defaultLimits
//     );

//     // Complete Indication
//     IndicationPage.completeIndicationScreen(
//       TestData.nonFleet.indication
//     ).then((capturedPlan) => {
//       selectedPlanName = capturedPlan;
//     });

//     // Review Page
//     ReviewPage.verifyReviewHeadingVisible();

//     ReviewPage.verifyOperationsSection({
//       effectiveDate: insuredDetails.effectiveDate,
//       producer: insuredDetails.producer,
//       businessOwnerName: `${operationsData.firstName} ${operationsData.lastName}`,
//       primaryOperatingClass: selectedOperatingClass,
//       farthestRadius: operationsData.farthestRadiusOption,
//       allClaims: operationsData.allClaimsCount,
//       primaryCommodity: TestData.nonFleet.review.primaryCommodity,
//     });

//     ReviewPage.verifyEquipmentSection(equipmentVins);

//     ReviewPage.verifyDriversSection(driversCdlNumbers);

//     ReviewPage.verifyIndicationSection({
//       deductibleValue: TestData.nonFleet.indication.deductibleOption,
//       limitsValue: TestData.nonFleet.indication.limitsOption,
//       telematicsEmail: Cypress.env("agentEmail"),
//       planName: selectedPlanName,
//     });

//     // Submit Application
//     ReviewPage.submitAndVerifySuccess();

//     // Logout
//     DashboardPage.verifyAgentNameVisible(expectedName);
//     DashboardPage.logout();

//     cy.url().should("include", "/login");
//   });
// });