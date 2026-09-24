class UnderwriterLocators {
  static fleetApplicationsHeading = "p.mb-2.font-bold.text-28px.text-secondary-dark";
  static fleetOption = "span:contains('Fleet')";
  static profileTrigger = "span.text-sm.font-medium";
  static profileName = "span.text-sm.font-medium";
  static logoutButton = "li[role='menuitem']:contains('Logout')";

  static tabByName = (tabName) => `button[role='tab']:contains('${tabName}')`;
  static selectedTab = "button[role='tab'][aria-selected='true']";

  static searchInput = "input[placeholder='Search...']";
  static applicationForDropdown = "input[aria-autocomplete='list']";
  static recommendationDropdown = "div[role='button'][aria-haspopup='listbox']";
  static DateFrom = "input[placeholder='From']"
  static DateTo = "input[placeholder='To']"

  static searchResultRow = "div[role='row']";
  static searchResultCompanyName = "div[role='row'] p.text-13px";

  static screenTabs = "div[role='tablist'] button[role='tab']";
  static tabByTestId = (testId) => `button[data-testid='${testId}']`;

  static widgetHeadingH2 = "h2.text-xl.font-semibold.text-tw-primary";
  static widgetHeadingBoldP = "p.text-base.font-bold.tracking-tight.text-text-primary";

  static toggleSwitch = "button[role='switch']";
  static editIconButton = "button.MuiIconButton-root svg[stroke='currentColor']";

  static yearsInBusinessContent = "p.text-4xl.font-medium";
  static projectedInfoValueContainer = "div.flex.items-center.font-bold";
  static unitsInput = "input[inputmode='numeric']";

  static tooltipContainer = "div.w-64.p-4";
  static infoIcon = "svg[data-testid='InfoOutlinedIcon']";

  static rechartsWrapper = "div.recharts-wrapper";
  static tableV8Container = "div[data-testid='table-v8-container']";

  static rechartsBarPercentageLabel = "g.recharts-label-list text.recharts-label tspan";

}

export default UnderwriterLocators;