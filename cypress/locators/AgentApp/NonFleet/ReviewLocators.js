class ReviewLocators {
  static reviewHeading = "h4.MuiTypography-root.MuiTypography-h4";
  static submitButton = "button:contains('Submit')";
  static successHeading = "h4.MuiTypography-root.MuiTypography-h4";
  static successMessage = "Congratulations! Your application is under review";
  static backToHomeButton = "button:contains('Back to Home')";

  static fieldValueByTestId = (testId) =>
    `[data-testid='${testId}'] p, [data-testid='${testId}'] span`;
  static fieldValueContainer = (testId) => `[data-testid='${testId}']`;
}

export default ReviewLocators;
