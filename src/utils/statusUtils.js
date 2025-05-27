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
  const { companyStatus, studentStatus, feedbackContextStudent } = data;

  if (studentStatus === 4 && feedbackContextStudent === 'SurveyMissing') {
    return "Pending";
  }

  if ((studentStatus === 6 || studentStatus === 7) && (feedbackContextStudent === 'Both' || feedbackContextStudent === 'Report')) {
    return "Pending";
  }
  if (studentStatus === 7 && feedbackContextStudent === 'ReportAfterAdmin') {
    return "Pending";
  } 
  // If company has given feedback to student
  if (studentStatus === 5) {
    return "Company gave a feedback to student";
  }

  // companyStatus codes: 1,3 -> accepted
  if ([1, 3].includes(companyStatus)) {
    return "Accepted";
  }

  // companyStatus 2 means form uploaded but not yet approved, consider Pending


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
  if (status === 3) {
    return "Rejected";
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
          if (studentStatus === 4) {
            return "AdminFeedbackReport_StudNotUpdated";
            // "Admin gave feedback on report, student updated accordingly."
          } else if (studentStatus === 6) {
            return "AdminFeedbackReport_StudUpdated";
          }
          break;
        case "Survey":
          if (studentStatus === 4) {
            return "AdminFeedbackSurvey_StudNotUpdated";
            // "Admin gave feedback on survey, student updated accordingly."
          } else if (studentStatus === 6) {
            return "AdminFeedbackSurvey_StudUpdated";
          }
          break;
        case "Both":
          if (studentStatus === 3) {
            return "Pending";
          }
          if (studentStatus === 4) {
            return "AdminFeedbackBoth"
          }
          if (studentStatus === 6) {
            return "Pending"
          }
          return "AdminFeedbackBoth";
        default:
          return "Pending";
      }
    }
    // If no feedbackContextStudent is provided, return Pending
    return "Pending";
  }

  // default
  return "Pending";
};

export const getCurrentStatus = (data) => {
  const { status, studentStatus, feedbackContextStudent } = data;

  if (studentStatus === 6 && feedbackContextStudent === 'SurveyMissing') {
    return "Report is updated, but survey is missing.";
  }

  if (studentStatus === 6 && feedbackContextStudent === 'ReportMissing') {
    return "Survey is updated, but report is missing.";
  }

  if(studentStatus === 0) {
    return "No file is uploaded yet.";
  }
  if(studentStatus === 1) {
    return "Report is uploaded.";
  }
  if(studentStatus === 2) {
    return "Survey is uploaded.";
  }
  if(studentStatus === 3) {
    return "Necessary files are uploaded.";
  }

}