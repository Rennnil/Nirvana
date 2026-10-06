# Cypress Test Automation Rules

Apply these rules whenever a prompt asks to create, extend, or repair Cypress test cases, specs, page objects, locators, fixtures, test data, or custom commands in this repository. Before editing, inspect the closest existing spec and its page object, locator, support, fixture, and test-data files. Follow their conventions unless a rule below requires a correction.

## Project Structure

- Put end-to-end specs under `cypress/e2e/`, grouped by application and workflow.
- Put page-object classes and reusable UI actions under `cypress/pages/`.
- Keep selectors in the matching `cypress/locators/` area. Page objects consume locator definitions; specs should use page-object methods rather than querying the DOM directly.
- Put shared Cypress commands in `cypress/support/commands.js` and shared utilities in `cypress/support/utils/`.
- Put stable reusable input data in `cypress/fixtures/`. Put generated or scenario-specific data in the existing `cypress/testData/` factories/helpers. Never put credentials or secrets in fixtures or source files.
- Reuse existing assertions and helpers in `cypress/Assertions/` where appropriate. Keep scenario intent and outcome assertions visible in the spec.

## Test Design and Assertions

- Write tests around a named user workflow and observable outcomes. Cover relevant success, validation/error, and state-transition behavior for the requested scenario; do not add unrelated assertions.
- Assert meaningful UI and/or API results after actions, including persisted status or data when the workflow requires it. Assert both positive and negative outcomes when relevant.
- Prefer Cypress retryable queries and assertions. Synchronize on visible state or intercepted requests/responses; do not use arbitrary `cy.wait(number)` delays.
- Use `cy.intercept()` aliases for important network behavior and assert the relevant request or response where it strengthens the scenario.
- Keep test cases independent where practical. Respect the repository's Cypress `testIsolation` configuration and explicitly handle application state where a scenario depends on state created by another step.
- Avoid brittle assertions tied to incidental styling, DOM structure, or implementation details when a role, label, text, status, or stable test id expresses the expected behavior.

## Page Objects and Locators

- Use the Page Object Model: specs describe the workflow; page objects encapsulate page actions and queries; locator modules own selectors.
- Define selectors once as named constants or locator functions in the relevant locator module. Do not scatter raw CSS/XPath selectors or repeated accessible queries through specs and page objects.
- Make locator functions parameterized for dynamic values (for example, a company name, VIN, coverage, or option label). Escape interpolated values where selector syntax requires it.
- Prefer accessible queries by role, label, or name, then stable `data-testid` selectors. Avoid brittle positional/index-based selection.
- Do not select dropdown options by a numeric index. Open the intended dropdown, then select and assert the option by its parameterized visible value or accessible name. Scope repeated controls to their label, row, dialog, or other stable parent. Use an index only when no semantic scoping is possible, document why, and assert the target context.
- In page-object classes, use `static` locator properties and reusable helper/action methods when they do not require instance state, consistent with the existing `CompanyDataPage` and `UWRatingPage` pattern.
- When a requested workflow includes a UI interaction, implement it as a descriptive page-object method (for example, `clickProfile()`), rather than leaving the raw Cypress chain in the spec. The method should use the matching locator definition, apply the needed visibility/actionability checks, and accept a parameter when the target text or value varies between scenarios. Keep one-off assertions about scenario outcomes visible in the spec.
- Keep selectors out of reusable business flows and keep page objects focused; avoid duplicating the same interaction in multiple specs.

## Test Data

- Use the installed `@faker-js/faker` package for unique names, emails, addresses, and other suitable dynamic values. Use a factory/helper rather than generating unrelated values inline throughout a spec.
- Keep generated values valid for the application domain and satisfy dependent fields (for example, address and state/ZIP combinations). Assert or constrain generated values where the system accepts only a defined set.
- Use a fixed Faker seed only when deterministic reproduction is needed; make the seed and generated scenario easy to identify when debugging. Do not replace required business fixtures with unconstrained random values.
- Use fixture files for stable scenario inputs, not secrets or runtime-generated unique data.

## Reuse and Custom Commands

- Add a custom command only for a repeated, broadly useful Cypress action or setup flow. Register it in `cypress/support/commands.js` and ensure it is loaded by the support entry point.
- Keep page-specific interactions in page objects and domain-specific test-data construction in factories. Avoid helper layers that merely forward a single call or hide assertions.
- Reuse existing commands, intercept patterns, selectors, factories, and assertion helpers before creating new ones.

## Quality, Formatting, and Reporting

- Use the repository's existing ESLint flat configuration (`eslint.config.js`) and Prettier integration. Keep code lint-clean and formatted; do not add a competing lint or formatting configuration without a demonstrated gap.
- Use `npm run lint` to check Cypress JavaScript and `npm run format` to format it. Run the narrowest relevant check after changes, then run broader checks when the change crosses shared files.
- Add or update lint rules only when needed for a concrete quality issue; preserve Cypress-specific recommended rules and the Prettier compatibility config.
- Preserve the existing Cypress Allure reporter setup in `cypress.config.js`. New specs should produce useful Allure results through the configured reporter; add suite/feature/severity metadata or attachments when they materially improve report triage.
- Run tests with the existing Cypress scripts. The Cypress configuration generates the Allure report after a run; do not duplicate that setup in individual specs.

## Parallel Execution

- Parallelize only independent spec files or CI shards when the execution environment supports it. Do not run dependent tests concurrently or share mutable users, applications, records, or cleanup targets between workers.
- Generate unique test data per test/worker and ensure setup, teardown, and report-result collection are safe under concurrency.
- This repository's current GitHub Actions workflow runs Cypress in a single job. Do not claim parallel execution is enabled or add Cypress Cloud `--parallel` flags unless recording/configuration and the execution plan are explicitly set up. If parallelization is requested, explain the required CI/runtime changes and preserve reliable Allure result aggregation.

## Implementation Workflow

- Before changing files, inspect the nearest existing implementation and identify the smallest files needed for the requested scenario.
- Keep changes scoped to the requested workflow. Do not rewrite unrelated tests or configuration.
- After editing, run the relevant lint/test command when available and report any checks that could not be run.