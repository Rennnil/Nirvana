class ApiEndpoints {
  static me = "**/me";
  static agentDetails = "**/agent_details";
  static createApplication = "**/nonfleet/application";
  static zipDecode = "**/zipcode/*/decode";
  static decodeVins = "**/utils/decode_vins";

  static creditReportStatus = (applicationId) =>
    `**/nonfleet/applications/${applicationId}/credit_report/status`;

  static quoteSubmit = (applicationId) =>
    `**/nonfleet/application/${applicationId}/quote/submit`;

  static consentLink = "**/telematics/application/consent-link";

  static consentEmail = (applicationId) =>
    `**/application/${applicationId}/telematics_consent_request_email`;

  static finalSubmit = (applicationId) =>
    `**/nonfleet/application/${applicationId}/submit`;
}

export default ApiEndpoints;