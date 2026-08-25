const cypressPlugin = require("eslint-plugin-cypress");
const prettierConfig = require("eslint-config-prettier");

module.exports = [
  {
    ignores: [
      "node_modules/**",
      "cypress/report/**",
      "cypress/images-videos/**",
    ],
  },
  {
    files: ["cypress/**/*.js"],
    plugins: {
      cypress: cypressPlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        cy: "readonly",
        Cypress: "readonly",
        expect: "readonly",
        describe: "readonly",
        it: "readonly",
        before: "readonly",
        beforeEach: "readonly",
        after: "readonly",
        afterEach: "readonly",
        Event: "readonly",
        window: "readonly",
        document: "readonly",
      },
    },
    rules: {
      ...cypressPlugin.configs.recommended.rules,
      "no-unused-vars": "warn",
      "no-undef": "error",
      "prefer-const": "warn",
      eqeqeq: "warn",
      "cypress/no-unnecessary-waiting": "warn",
      "cypress/unsafe-to-chain-command": "warn",
    },
  },
  {
    files: ["cypress.config.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: { require: "readonly", module: "readonly", process: "readonly" },
    },
  },
  prettierConfig,
];