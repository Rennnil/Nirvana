import LoginPage from "../../../pages/AgentApp/NonFleet/LoginPage";
import DashboardPage from "../../../pages/AgentApp/NonFleet/DashboardPage";
import InsuredDetailsPage from "../../../pages/AgentApp/NonFleet/InsuredDetailsPage";
import DataGenerator from "../../../support/utils/DataGenerator";
import OperationsPage from "../../../pages/AgentApp/NonFleet/OperationsPage";
import EquipmentPage from "../../../pages/AgentApp/NonFleet/EquipmentPage";
import DriversPage from "../../../pages/AgentApp/NonFleet/DriversPage";
import IndicationPage from "../../../pages/AgentApp/NonFleet/IndicationPage";
import ReviewPage from "../../../pages/AgentApp/NonFleet/ReviewPage";
import TestData from "../../../testData/TestData";
import ApiEndpoints from "../../Assertions/ApiEndpoints";
import ApiAssertions from "../../Assertions/ApiAssertions";

describe("Nirvana Agent Portal - Non-Fleet Flow (API Verification)", () => {
    const email = Cypress.env("agentEmail");
    const password = Cypress.env("agentPassword");
    const expectedName = Cypress.env("agentName");
    const category = TestData.nonFleet.category;

    let operationsData = {};
    let insuredDetails;
    let fetchedCompanyName;
    let applicationId;
    let selectedOperatingClass = "";
    let selectedPlanName = "";

    before(() => {
        cy.fixture("nonFleetInsuredData").then((fixtureData) => {
            insuredDetails = {
                ...fixtureData,
                effectiveDate: DataGenerator.getCurrentFormattedDate(),
                powerUnits: DataGenerator.getPowerUnitsCount(),
            };
            cy.log(`Loaded insured details: ${JSON.stringify(insuredDetails)}`);
        });

        cy.intercept("GET", ApiEndpoints.me).as("meCall");
        cy.intercept("GET", ApiEndpoints.agentDetails).as("agentDetailsCall");

        cy.loginIfNeeded(email, password, expectedName);

        cy.wait("@meCall").then((interception) => {
            ApiAssertions.verifyStatus(interception, 200);
            ApiAssertions.verifyResponseHasProperty(interception, "id");
            ApiAssertions.verifyResponseHasProperty(interception, "email");
            ApiAssertions.verifyResponseHasProperty(interception, "name");
            ApiAssertions.verifyResponseHasProperty(interception, "defaultAgencyId");
            ApiAssertions.verifyResponseHasProperty(interception, "userType");
            expect(interception.response.body.roles).to.have.property("agencyRoles").that.is.an("array");
            expect(interception.response.body.roles).to.have.property("nirvanaRoles").that.is.an("array");
        });

        cy.wait("@agentDetailsCall").then((interception) => {
            ApiAssertions.verifyStatus(interception, 200);
            ApiAssertions.verifyResponseHasProperty(interception, "isDetailsComplete", true);
        });
    });

    it("TC01: display dashboard with agent name after login", { tags: "@ApiVerification" }, () => {
        DashboardPage.verifyAgentNameVisible(expectedName);
    });

    it("TC02: select Non-Fleet category from dropdown", { tags: "@ApiVerification" }, () => {
        DashboardPage.selectCategory(category);
    });

    it("TC03: verify New Application button is visible and click it", { tags: "@ApiVerification" }, () => {
        DashboardPage.verifyNewApplicationButtonVisible();
        DashboardPage.clickNewApplicationButton();
    });

    it("TC04: verify popup text after clicking New Application", { tags: "@ApiVerification" }, () => {
        InsuredDetailsPage.verifyPopupVisible(TestData.nonFleet.popupText);
    });

    it("TC05: fill insured details and continue", { tags: "@ApiVerification" }, () => {
        InsuredDetailsPage.fillInsuredDetails(insuredDetails).then((companyName) => {
            fetchedCompanyName = companyName;
            cy.log(`Captured company name for later verification: "${companyName}"`);
        });
        InsuredDetailsPage.clickContinue();
    });

    it("TC06: select 'No' on the follow-up popup and verify application creation API", { tags: "@ApiVerification" }, () => {
        cy.intercept("POST", ApiEndpoints.createApplication).as("createApplication");

        InsuredDetailsPage.clickNoOption();

        cy.wait("@createApplication").then((interception) => {
            ApiAssertions.verifyStatus(interception, 201);

            ApiAssertions.verifyRequestHasProperty(interception, "dotNumber", Number(insuredDetails.dotNumber));
            ApiAssertions.verifyRequestHasProperty(interception, "companyName", fetchedCompanyName);
            ApiAssertions.verifyRequestHasProperty(interception, "numberOfPowerUnits", insuredDetails.powerUnits);
            ApiAssertions.verifyRequestHasProperty(interception, "effectiveDate");
            expect(interception.request.body.producerID).to.be.a("string").and.not.be.empty;

            ApiAssertions.verifyResponseHasProperty(interception, "applicationID");
            expect(interception.response.body.applicationID).to.be.a("string").and.not.be.empty;

            applicationId = interception.response.body.applicationID;
            cy.log(`Captured application ID: ${applicationId}`);
        });
    });

    it("TC07: verify Operations screen with correct DOT and company name", { tags: "@ApiVerification" }, () => {
        cy.wrap(null).then(() => {
            expect(fetchedCompanyName, "Company name should have been captured in TC05").to.exist;
            OperationsPage.verifyOperationsScreen(insuredDetails.dotNumber, fetchedCompanyName);
        });
    });

    it("TC08: should NOT proceed to Equipment screen without filling Operations form", { tags: "@ApiVerification" }, () => {
        OperationsPage.verifyProceedBlockedWithoutData();
    });

    it("TC09: verify prefilled data, fill Operations form completely, and verify update API", { tags: "@ApiVerification" }, () => {
        OperationsPage.verifyEffectiveDate(insuredDetails.effectiveDate);
        OperationsPage.verifyProducer(insuredDetails.producer);
        OperationsPage.verifyCoverageCheckboxState("Auto Liability", true);

        operationsData = TestData.nonFleet.operations;

        cy.intercept("GET", ApiEndpoints.zipDecode).as("zipDecode");
        cy.intercept("GET", ApiEndpoints.creditReportStatus(applicationId)).as("creditReportStatus");

        OperationsPage.fillOperationsForm({
            ...operationsData,
            dob: DataGenerator.getRandomDob(),
        }).then((capturedClass) => {
            selectedOperatingClass = capturedClass;
            cy.log(`Captured selected operating class: "${selectedOperatingClass}"`);
        });

        cy.wait("@zipDecode").then((interception) => {
            ApiAssertions.verifyStatus(interception, 200);
            ApiAssertions.verifyResponseHasProperty(interception, "cityName");
            ApiAssertions.verifyResponseHasProperty(interception, "countyName");
            ApiAssertions.verifyResponseHasProperty(interception, "stateCode");
            ApiAssertions.verifyResponseHasProperty(interception, "stateName");
        });

        OperationsPage.clickProceed();

        cy.wait("@creditReportStatus").then((interception) => {
            ApiAssertions.verifyStatus(interception, 200);
            ApiAssertions.verifyResponseHasProperty(interception, "status", "Success");
        });

        OperationsPage.handleSsnPopupIfPresent();
    });

    it("TC10: should NOT proceed without filling Equipment details and show 'Please enter make' error", { tags: "@ApiVerification" }, () => {
        EquipmentPage.verifyEquipmentHeadingVisible();
        EquipmentPage.verifyProceedBlockedWithoutData();
    });

    it("TC11: upload equipment list, verify VIN decode API, and proceed", { tags: "@ApiVerification" }, () => {
        cy.intercept("POST", ApiEndpoints.decodeVins).as("decodeVins");

        EquipmentPage.uploadEquipmentListAndProceed(
            TestData.nonFleet.upload.equipmentFilePath,
            TestData.nonFleet.upload.equipmentRowCount
        );

        cy.wait("@decodeVins").then((interception) => {
            ApiAssertions.verifyStatus(interception, 200);
            ApiAssertions.verifyRequestBodyIsArrayOfLength(interception, TestData.nonFleet.upload.equipmentRowCount);

            ApiAssertions.verifyEachResponseArrayItemHasProperty(interception, "vin");
            ApiAssertions.verifyEachResponseArrayItemHasProperty(interception, "hasDecodingError", false);

            ApiAssertions.verifyResponseBodyIsArrayOfLength(interception, TestData.nonFleet.upload.equipmentRowCount);
        });
    });

    it("TC12: should NOT proceed without filling Drivers details and show 'Please enter DL number' error", { tags: "@ApiVerification" }, () => {
        DriversPage.verifyProceedBlockedWithoutData();
    });

    it("TC13: upload drivers list, verify quote submit API, and proceed", { tags: "@ApiVerification" }, () => {
        cy.intercept("POST", ApiEndpoints.quoteSubmit(applicationId)).as("quoteSubmit");

        DriversPage.uploadDriverListAndProceed(
            TestData.nonFleet.upload.driversFilePath,
            TestData.nonFleet.upload.driversRowCount
        );

        cy.wait("@quoteSubmit", { timeout: 20000 }).then((interception) => {
            ApiAssertions.verifyStatus(interception, 201);
            ApiAssertions.verifyApplicationIdMatches(interception, applicationId);
            ApiAssertions.verifyResponseHasProperty(interception, "appStatus", "AppStateQuoteGenerating");
        });
    });

    it("TC14: should NOT proceed without connecting telematics and show error", { tags: "@ApiVerification" }, () => {
        IndicationPage.verifyIndicationHeadingVisible();
        IndicationPage.verifyProceedBlockedWithoutTelematics();
    });

    it("TC15: verify default Deductible and Limits values", { tags: "@ApiVerification" }, () => {
        IndicationPage.verifyDefaultDeductibleAndLimits(
            TestData.nonFleet.indication.defaultDeductible,
            TestData.nonFleet.indication.defaultLimits
        );
    });

    it("TC16: update Deductible/Limits, connect telematics, select plan, verify APIs, and proceed", { tags: "@ApiVerification" }, () => {
        cy.intercept("POST", ApiEndpoints.consentLink).as("consentLink");
        cy.intercept("POST", ApiEndpoints.consentEmail(applicationId)).as("consentEmail");

        IndicationPage.completeIndicationScreen(TestData.nonFleet.indication).then((capturedPlan) => {
            selectedPlanName = capturedPlan;
            cy.log(`Captured selected plan: "${selectedPlanName}"`);
        });

        cy.wait("@consentLink").then((interception) => {
            ApiAssertions.verifyStatus(interception, 201);

            ApiAssertions.verifyRequestHasProperty(interception, "applicationId", applicationId);
            ApiAssertions.verifyRequestHasProperty(interception, "programType", "ProgramTypeNonFleetAdmitted");
            ApiAssertions.verifyRequestNestedProperty(
                interception,
                (body) => body.insuredInformation,
                "email",
                Cypress.env("agentEmail")
            );

            ApiAssertions.verifyResponseHasProperty(interception, "link");
            ApiAssertions.verifyResponsePropertyIncludes(interception, "link", "telematics/connect");
        });

        cy.wait("@consentEmail").then((interception) => {
            ApiAssertions.verifyStatus(interception, 200);

            ApiAssertions.verifyRequestHasProperty(interception, "completed", true);
            ApiAssertions.verifyRequestHasProperty(interception, "programType", "ProgramTypeNonFleetAdmitted");
            ApiAssertions.verifyRequestNestedProperty(
                interception,
                (body) => body.email.to[0],
                "email",
                Cypress.env("agentEmail")
            );

            ApiAssertions.verifyResponseHasProperty(interception, "completed", true);
            ApiAssertions.verifyResponseHasProperty(interception, "completedAt");
        });
    });

    it("TC17: verify Review screen heading", { tags: "@ApiVerification" }, () => {
        ReviewPage.verifyReviewHeadingVisible();
    });

    it("TC18: verify all entered details and submit application", { tags: "@ApiVerification" }, () => {
        ReviewPage.verifyOperationsSection({
            effectiveDate: insuredDetails.effectiveDate,
            producer: insuredDetails.producer,
            businessOwnerName: `${operationsData.firstName} ${operationsData.lastName}`,
            primaryOperatingClass: selectedOperatingClass,
            farthestRadius: operationsData.farthestRadiusOption,
            allClaims: operationsData.allClaimsCount,
            primaryCommodity: TestData.nonFleet.review.primaryCommodity,
        });

        ReviewPage.verifyIndicationSection({
            deductibleValue: TestData.nonFleet.indication.deductibleOption,
            limitsValue: TestData.nonFleet.indication.limitsOption,
            telematicsEmail: Cypress.env("agentEmail"),
            planName: selectedPlanName,
        });

        cy.intercept("POST", ApiEndpoints.finalSubmit(applicationId)).as("finalSubmit");

        ReviewPage.clickSubmit();

        cy.wait("@finalSubmit", { timeout: 20000 }).then((interception) => {
            ApiAssertions.verifyStatus(interception, 200);
            ApiAssertions.verifyApplicationIdMatches(interception, applicationId);
            ApiAssertions.verifyResponseHasProperty(interception, "appStatus", "AppStateUnderUWReview");
        });

        ReviewPage.verifySuccessMessage();
        ReviewPage.clickBackToHome();
    });

    it("TC19: log out from the application", { tags: "@ApiVerification" }, () => {
        DashboardPage.verifyAgentNameVisible(expectedName);
        DashboardPage.logout();
        cy.url().should("include", "/login");
    });
});