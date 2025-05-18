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
    return "Form uploaded, awaiting approval";
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
export const getCoordinatorStatus = (data) => {
  const { status, feedbackContextCompany } = data;

  switch (status) {
    case 1:
      return "Pending"; // student marked internship as finished
    case 2:
      return "Approved"; // admin approved
    case 3:
      return "Rejected"; // admin rejected
    default:
      return "Pending";
  }
};
