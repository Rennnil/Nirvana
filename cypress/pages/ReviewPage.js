import ReviewLocators from "../locators/ReviewLocators";
import BasePage from "./BasePage";

class ReviewPage {
  static verifyReviewHeadingVisible() {
    BasePage.verifyVisible(ReviewLocators.reviewHeading, "Review", 15000);
  }

  static verifyFieldValue(testId, expectedText) {
    BasePage.verifyVisible(ReviewLocators.fieldValueContainer(testId), expectedText, 10000);
  }

  static verifyOperationsSection({
    effectiveDate,
    producer,
    businessOwnerName,
    primaryOperatingClass,
    farthestRadius,
    allClaims,
    primaryCommodity,
  }) {
    this.verifyFieldValue(
      "review-section-operations-field-effective-date-value",
      effectiveDate,
    );
    this.verifyFieldValue(
      "review-section-operations-field-producer-value",
      producer,
    );
    this.verifyFieldValue(
      "review-section-operations-field-business-owner-value",
      businessOwnerName,
    );
    this.verifyFieldValue(
      "review-section-operations-field-primary-operating-class-value",
      primaryOperatingClass,
    );
    this.verifyFieldValue(
      "review-section-operations-field-farthest-radius-of-operations-value",
      farthestRadius,
    );
    this.verifyFieldValue(
      "review-section-operations-field-all-claims-value",
      String(allClaims),
    );
    this.verifyFieldValue(
      "review-section-operations-field-primary-commodity-value",
      primaryCommodity,
    );
  }

  static verifyEquipmentSection(vinNumbers) {
    cy.log("Verifying Equipment section contains all VIN numbers");
    cy.get(ReviewLocators.fieldValueContainer("review-section-equipment"))
      .should("be.visible")
      .within(() => {
        vinNumbers.forEach((vin) => {
          cy.contains("td", vin).should("be.visible");
        });
      });
  }

  static verifyDriversSection(cdlNumbers) {
    cy.log("Verifying Drivers section contains all CDL numbers");
    cy.get(ReviewLocators.fieldValueContainer("review-section-drivers"))
      .should("be.visible")
      .within(() => {
        cdlNumbers.forEach((cdl) => {
          cy.contains("td", cdl).should("be.visible");
        });
      });
  }

  static verifyIndicationSection({
    deductibleValue,
    limitsValue,
    telematicsEmail,
    planName,
  }) {
    this.verifyFieldValue(
      "review-section-indication-field-deductibles-value",
      deductibleValue,
    );
    this.verifyFieldValue(
      "review-section-indication-field-limits-value",
      limitsValue,
    );
    this.verifyFieldValue(
      "review-section-indication-field-eld-telematics-connection-value",
      telematicsEmail,
    );
    cy.get(
      ReviewLocators.fieldValueContainer(
        "review-section-indication-field-eld-telematics-connection-value",
      ),
    ).should("contain.text", "Link Generated");
    this.verifyFieldValue(
      "review-section-indication-field-plan-selected-value",
      planName,
    );
  }

  static clickSubmit() {
    BasePage.clickButtonByText("Submit");
  }

  static verifySuccessMessage() {
    cy.log(`Verifying success message: "${ReviewLocators.successMessage}"`);
    cy.contains(ReviewLocators.successHeading, ReviewLocators.successMessage, {
      timeout: 15000,
    }).should("be.visible");
  }

  static clickBackToHome() {
    BasePage.clickButtonByText("Back to Home");
  }

  static submitAndVerifySuccess() {
    this.clickSubmit();
    this.verifySuccessMessage();
    this.clickBackToHome();
  }
}

export default ReviewPage;