// utils/statusUtils.js

/**
 * Determine company supervisor status based on companyStatus, studentStatus, and feedbackContextStudent
 * @param {Object} data - internship data object
 * @param {number} data.companyStatus
 * @param {number} data.studentStatus
 * @param {string|null} data.feedbackContextStudent
 * @returns {string} - status label for company supervisor
 */
export const getCompanySupervisorStatus = (data) => {
  const { companyStatus, studentStatus } = data;

  // If company has given feedback to student
  if (studentStatus === 5) {
    return "Company gave a feedback to student";
  }

  // companyStatus codes: 1,3,4,5 -> accepted
  if ([1, 3, 4, 5].includes(companyStatus)) {
    return "Accepted";
  }

  // companyStatus 2 means form uploaded but not yet approved, consider Pending
  if (companyStatus === 2) {
    return "Report approved by company";
  }

  // default or 0
  return "Pending";
};

/**
 * Determine coordinator status based on status and other relevant fields
 * @param {Object} data - internship data object
 * @param {number} data.status
 * @param {number} data.studentStatus
 * @param {string|null} data.feedbackContextStudent
 * @returns {string} - status label for coordinator
 */
export const getCoordinatorStatus = (data) => {
  const { status, studentStatus, feedbackContextStudent } = data;

  // status === 2 -> Admin approved (approved message, feedback context not needed)
  if (status === 2) {
    return "Approved";
  }

  // status === 1 -> pending, 
  if (status === 1) {
    // if feedbackContextStudent is provided, check its value
    if (feedbackContextStudent) {
      switch (feedbackContextStudent) {
        case "MissingReport":
          return "AdminFeedbackBoth_StudOnlySurvey"; 
          // "Admin gave feedback for both report and survey, student only updated the survey."
        case "MissingSurvey":
          return "AdminFeedbackBoth_StudOnlyReport";
          // "Admin gave feedback for both report and survey, student only updated the report."
        case "Report":
          // Admin only gave feedback on report
          if (studentStatus === 4 || studentStatus === 6) {
            return "AdminFeedbackReport_StudUpdated"; 
            // "Admin gave feedback on report, student updated accordingly."
          }
          break;
        case "Survey":
          if (studentStatus === 4 || studentStatus === 6) {
            return "AdminFeedbackSurvey_StudUpdated";
            // "Admin gave feedback on survey, student updated accordingly."
          }
          break;
        case "Both":
          // Admin gave feedback on both report and survey, student updated both
          return "AdminFeedbackBoth";
        default:
          return "Pending";
      }
    }
    // If no feedbackContextStudent is provided, return Pending
    return "Pending";
  }

  // status === 3 -> Admin rejected
  if (status === 3) {
    return "Rejected";
  }

  // default
  return "Pending";
};