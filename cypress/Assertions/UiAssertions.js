class UiAssertions {
  /**
   * Verify a validation/error message is visible under a given selector,
   * containing the expected text. Used across every "blocked without data"
   * negative test (Operations, Equipment, Drivers, Indication).
   */
  static verifyErrorMessageVisible(errorSelector, expectedText, timeout = 10000) {
    cy.log(`Verifying error message: "${expectedText}"`);
    cy.contains(errorSelector, expectedText, { timeout }).should("be.visible");
  }

  /**
   * Verify the current URL includes an expected path fragment.
   */
  static verifyUrlIncludes(expectedFragment) {
    cy.url().should("include", expectedFragment);
  }

  /**
   * Verify the current URL does NOT include a given path fragment —
   * used to confirm navigation was blocked (e.g. still on Operations,
   * not Equipment).
   */
  static verifyUrlNotIncludes(unexpectedFragment) {
    cy.url().should("not.include", unexpectedFragment);
  }

  /**
   * Verify a jQuery element's trimmed text exactly equals an expected value.
   * Used for exact-match checks after a raw `.then(($el) => ...)` callback.
   */
  static verifyExactText($el, expectedText) {
    const actualText = $el.text().trim();
    expect(actualText, `expected text to equal "${expectedText}"`).to.eq(expectedText);
  }
}

export default UiAssertions;