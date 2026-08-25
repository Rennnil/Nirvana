class BasePage {
  /**
   * Verify an element is visible, optionally asserting its text content.
   */
  static verifyVisible(selector, expectedText = null, timeout = 10000) {
    cy.log(`Verifying visible: ${selector}${expectedText ? ` (expects "${expectedText}")` : ""}`);
    const chain = cy.get(selector, { timeout }).should("be.visible");
    if (expectedText !== null) {
      return chain.and("contain.text", expectedText);
    }
    return chain;
  }

  /**
   * Type into an input: wait visible, clear, type, blur.
   */
  static typeInto(selector, value, { blur = true, delay = 0, log = true } = {}) {
    if (log) cy.log(`Typing "${value}" into: ${selector}`);
    let chain = cy.get(selector).should("be.visible").clear().type(String(value), { delay });
    if (blur) chain = chain.blur();
    return chain;
  }

  /**
   * Click any element after asserting it's visible (and optionally enabled).
   */
  static clickVisible(selector, { force = false, mustBeEnabled = false } = {}) {
    cy.log(`Clicking: ${selector}`);
    let chain = cy.get(selector).should("be.visible");
    if (mustBeEnabled) chain = chain.and("be.enabled");
    return chain.click({ force });
  }

  /**
   * Click a button located by its visible text (cy.contains pattern used everywhere).
   */
  static clickButtonByText(buttonText, { timeout = 10000, force = false } = {}) {
    cy.log(`Clicking button with text: "${buttonText}"`);
    return cy
      .contains("button", buttonText, { timeout })
      .should("be.visible")
      .click({ force });
  }

  /**
   * Assert an input's raw value equals expected.
   */
  static verifyInputValue(selector, expectedValue) {
    cy.log(`Verifying input value at "${selector}" equals "${expectedValue}"`);
    return cy.get(selector).should("have.value", String(expectedValue));
  }

  /**
   * Assert an input's value is non-empty (for auto-fetched/auto-filled fields).
   */
  static verifyInputNotEmpty(selector, timeout = 10000) {
    cy.log(`Verifying input at "${selector}" is not empty`);
    return cy.get(selector, { timeout }).invoke("val").should("not.be.empty");
  }

  /**
   * Retry-based "element no longer exists" check — replaces cy.wait() before
   * asserting a popup/listbox/dropdown has closed. Cypress retries the .should()
   * internally until it passes or times out, so this waits out real animations
   * instead of guessing a fixed delay.
   */
  static verifyElementGone(selector, timeout = 5000) {
    return cy.get("body", { timeout }).should(($body) => {
      expect($body.find(selector).length, `"${selector}" should no longer exist`).to.eq(0);
    });
  }

  /**
   * Retry-based "element eventually appears" check with a custom condition callback.
   * Useful for anything that needs to settle before proceeding (e.g. a field that
   * enables/disables based on async state) without a fixed cy.wait().
   */
  static waitUntil(selector, conditionFn, description = "condition to be met", timeout = 10000) {
    cy.log(`Waiting until: ${description}`);
    return cy.get(selector, { timeout }).should(($el) => {
      expect(conditionFn($el), description).to.be.true;
    });
  }

  /**
   * Check a checkbox (MUI-style: click the span wrapper, verify the real input is checked).
   */
  static checkMuiCheckbox(triggerSelector, verifyInputSelector) {
    cy.log(`Checking MUI checkbox: ${triggerSelector}`);
    cy.get(triggerSelector).should("be.visible").click();
    if (verifyInputSelector) {
      cy.get(verifyInputSelector).should("be.checked");
    }
  }
}

export default BasePage;