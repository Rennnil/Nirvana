class TestData {
  static nonFleet = {
    operations: {
      firstName: "Chhavi",
      lastName: "Pandey",
      street: "Indiana",
      city: "Indiana",
      state: "Indiana",
      zip: "46001",
      farthestRadiusOption: "201-300 miles",
      primaryOperatingClassSearch: "Agricultural",
      primaryCommoditySearch: "Seeds",
      isDriverOnPolicy: "false",
      allClaimsCount: 0,
    },

    indication: {
      defaultDeductible: "$1,000",
      defaultLimits: "$1,000,000",
      deductibleOption: "$2,500",
      limitsOption: "$750,000",
    },

    review: {
      primaryCommodity: "Seeds",
    },

    upload: {
      equipmentFilePath: "cypress/fixtures/Kishan_Equipment.xlsx",
      equipmentRowCount: 6,
      driversFilePath: "cypress/fixtures/Kishan_Drivers.xlsx",
      driversRowCount: 15,
    },

    popupText: "Please tell us more about the insured",
    category: "Non-fleet",
    equipmentStatedValue: 100000,
  };
}

export default TestData;