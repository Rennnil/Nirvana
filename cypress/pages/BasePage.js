class BasePage {
  static verifyVisible(selector, expectedText = null, timeout = 10000) {
    cy.log(`Verifying visible: ${selector}${expectedText ? ` (expects "${expectedText}")` : ""}`);
    const chain = cy.get(selector, { timeout }).should("be.visible");
    if (expectedText !== null) {
      return chain.and("contain.text", expectedText);
    }
    return chain;
  }

  /**
   * Type into an input. Accepts either a selector string (cy.get) or an
   * already-built Cypress chain (e.g. a row scoped with .find()), so this
   * works for both page-level inputs and per-row inputs in tables.
   */
  static typeInto(selectorOrChain, value, { blur = true, delay = 0, log = true } = {}) {
    if (log) {
      cy.log(`Typing "${value}" into: ${typeof selectorOrChain === "string" ? selectorOrChain : "element"}`);
    }
    const base = typeof selectorOrChain === "string" ? cy.get(selectorOrChain) : selectorOrChain;
    let chain = base.should("be.visible").clear().type(String(value), { delay });
    if (blur) chain = chain.blur();
    return chain;
  }

  /**
   * Type a value and immediately verify it stuck — common pattern for
   * fields that re-render their own value after typing.
   */
  static typeAndVerify(selector, value, options = {}) {
    this.typeInto(selector, value, options);
    return this.verifyInputValue(selector, value);
  }

  static clickVisible(selectorOrChain, { force = false, mustBeEnabled = false } = {}) {
    cy.log(`Clicking: ${typeof selectorOrChain === "string" ? selectorOrChain : "element"}`);
    const base = typeof selectorOrChain === "string" ? cy.get(selectorOrChain) : selectorOrChain;
    let chain = base.should("be.visible");
    if (mustBeEnabled) chain = chain.and("be.enabled");
    return chain.click({ force });
  }

  static clickButtonByText(buttonText, { timeout = 10000, force = false, mustBeEnabled = false } = {}) {
    cy.log(`Clicking button with text: "${buttonText}"`);
    let chain = cy.contains("button", buttonText, { timeout }).should("be.visible");
    if (mustBeEnabled) chain = chain.and("not.be.disabled");
    return chain.click({ force });
  }

  static verifyInputValue(selectorOrChain, expectedValue) {
    cy.log(`Verifying input value equals "${expectedValue}"`);
    const base = typeof selectorOrChain === "string" ? cy.get(selectorOrChain) : selectorOrChain;
    return base.should("have.value", String(expectedValue));
  }

  static verifyInputNotEmpty(selector, timeout = 10000) {
    cy.log(`Verifying input at "${selector}" is not empty`);
    return cy.get(selector, { timeout }).invoke("val").should("not.be.empty");
  }

  static verifyElementGone(selector, timeout = 5000) {
    return cy.get("body", { timeout }).should(($body) => {
      expect($body.find(selector).length, `"${selector}" should no longer exist`).to.eq(0);
    });
  }

  static waitUntil(selector, conditionFn, description = "condition to be met", timeout = 10000) {
    cy.log(`Waiting until: ${description}`);
    return cy.get(selector, { timeout }).should(($el) => {
      expect(conditionFn($el), description).to.be.true;
    });
  }

  static checkMuiCheckbox(triggerSelector, verifyInputSelector) {
    cy.log(`Checking MUI checkbox: ${triggerSelector}`);
    cy.get(triggerSelector).should("be.visible").click();
    if (verifyInputSelector) {
      cy.get(verifyInputSelector).should("be.checked");
    }
  }

  /**
   * Click a button inside a dialog identified by its heading text — used
   * across upload-flow popups that all share generic role='dialog' markup
   * with no unique id/testid to target directly.
   */
  static clickButtonInDialogByHeading(headingSelector, headingText, buttonText, { timeout = 10000, mustBeEnabled = true } = {}) {
    cy.log(`Clicking "${buttonText}" inside dialog headed "${headingText}"`);
    cy.contains(headingSelector, headingText, { timeout })
      .should("be.visible")
      .parents("div[role='dialog']")
      .first()
      .within(() => {
        let chain = cy.contains("button", buttonText).should("be.visible");
        if (mustBeEnabled) chain = chain.and("not.be.disabled");
        chain.click();
      });
  }

  /**
   * Click any element (not necessarily a button) inside a dialog, scoped by
   * its heading text — e.g. selecting a radio/card option before Proceed.
   */
  static clickInDialogByHeading(headingSelector, headingText, targetSelector, targetText, { timeout = 10000 } = {}) {
    cy.log(`Clicking "${targetText}" (${targetSelector}) inside dialog headed "${headingText}"`);
    cy.contains(headingSelector, headingText, { timeout })
      .should("be.visible")
      .parents("div[role='dialog']")
      .first()
      .within(() => {
        cy.contains(targetSelector, targetText).should("be.visible").click();
      });
  }

  
  /**
 * Attach a file to a hidden file input inside a dialog identified by its
 * heading, then wait for the dialog's confirm button to become enabled.
 * Shared by any "upload list" flow (Equipment, Drivers, etc.) that follows
 * the same dialog → file input → enabled-button pattern.
 */
  static attachFileInDialog(
    dialogHeadingSelector,
    dialogHeadingText,
    fileInputSelector,
    filePath,
    confirmButtonText = "Review & Confirm",
    timeout = 10000
  ) {
    cy.log(`Attaching file in dialog headed "${dialogHeadingText}": ${filePath}`);
    cy.contains(dialogHeadingSelector, dialogHeadingText, { timeout }).should("be.visible");

    cy.get(fileInputSelector).selectFile(filePath, { force: true });

    cy.contains("button", confirmButtonText, { timeout })
      .should("be.visible")
      .and("not.be.disabled");
  }

  /**
   * Handle a "Confirm Import" style popup: wait for its heading, click the
   * given submit button (by selector, since these usually have a stable
   * data-testid), then wait for the popup to fully close.
   */
  static confirmImportPopup(
    headingSelector,
    headingText,
    submitButtonSelector,
    timeout = 10000
  ) {
    cy.log(`Handling "${headingText}" popup — clicking submit`);
    cy.contains(headingSelector, headingText, { timeout }).should("be.visible");

    cy.get(submitButtonSelector).should("be.visible").and("not.be.disabled").click();

    cy.contains(headingSelector, headingText).should("not.exist");
  }


}

export default BasePage;