class DashboardLocators {
  static agentNameText =
    "span.MuiTypography-root.MuiTypography-caption.MuiListItemText-primary";
  static profileDropdown =
    "div.MuiButtonBase-root.MuiListItem-root.MuiListItem-gutters.MuiListItem-button[role='button']";
  static signOutButton = "button[component='SignOutButton']";

  static categorySelect =
    ".MuiSelect-root.MuiSelect-select.MuiSelect-selectMenu.MuiSelect-outlined.MuiOutlinedInput-input.MuiInputBase-input";

  static newApplicationButton = "button[data-attr='posthog-create-new-application']";
  static popupContainer = "div[role='dialog']";
}

export default DashboardLocators;