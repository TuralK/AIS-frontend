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
 * Determine coordinator status based on status and feedbackContextCompany
 * @param {Object} data - internship data object
 * @param {number} data.status
 * @param {string|null} data.feedbackContextCompany
 * @returns {string} - status label for coordinator
 */
// utils/statusUtils.js
export const getCoordinatorStatus = (data) => {
  const { status, studentStatus, feedbackContextStudent } = data;

  // Öncelikle status’a göre genel durum
  if (status === 1) {
    return "Pending"; // student marked internship as finished
  }
  if (status === 2) {
    // Admin onaylamış
    // Eğer öğrencinin geri bildirim eksiklik durumu varsa, özel mesaj döneceğiz
    switch (feedbackContextStudent) {
      case "MissingReport":
        return "AdminFeedbackBoth_StudOnlySurvey"; 
        // Örneğin "Admin gave feedback for both report and survey, student only updated the survey."
      case "MissingSurvey":
        return "AdminFeedbackBoth_StudOnlyReport";
        // Örneğin "Admin gave feedback for both report and survey, student only updated the report."
      case "Report":
        // Admin yalnızca raporla ilgili geri bildirim vermiş, öğrenci durumu 4 veya 6 ise
        if (studentStatus === 4 || studentStatus === 6) {
          return "AdminFeedbackReport_StudUpdated"; 
          // Örneğin "Admin gave feedback on report, student updated accordingly."
        }
        break;
      case "Survey":
        if (studentStatus === 4 || studentStatus === 6) {
          return "AdminFeedbackSurvey_StudUpdated";
          // Örneğin "Admin gave feedback on survey, student updated accordingly."
        }
        break;
      case "Both":
        // Admin her ikisi için de geri bildirim vermiş, burayı tek bir durumda tutabiliriz
        return "AdminFeedbackBoth";
      default:
        return "Approved";
    }
  }
  if (status === 3) {
    return "Rejected"; // admin rejected
  }

  return "Pending";
};
