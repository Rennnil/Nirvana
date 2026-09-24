describe("Allure Reporting - Diagnostic", () => {
  it("DIAG01: intentionally failing test to verify screenshot/video attachment", () => {
    cy.visit("/");
    cy.log(
      "This test is intentionally designed to fail for Allure diagnostic purposes",
    );

    cy.get("h1.this-element-does-not-exist-on-purpose", {
      timeout: 4000,
    }).should("be.visible");
  });
});
