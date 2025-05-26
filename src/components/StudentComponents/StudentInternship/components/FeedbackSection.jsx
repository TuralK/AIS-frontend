// components/FeedbackSection.jsx
import { useTranslation } from "react-i18next";
import {
  getCompanySupervisorStatus,
  getCoordinatorStatus,
} from "../../../../utils/statusUtils";

const FeedbackSection = ({ internshipData, latestStudentFeedbacks }) => {
  const { t } = useTranslation();

  const companySupervisorLabel = getCompanySupervisorStatus(internshipData);
  const coordinatorLabel = getCoordinatorStatus(internshipData);

  const {
    studentStatus,
    score,
    status,
  } = internshipData;

  // En son feedback'i bul (createdAt'e göre)
  const getLatestFeedback = () => {
    if (!latestStudentFeedbacks || latestStudentFeedbacks.length === 0) {
      return null;
    }
    
    return latestStudentFeedbacks.reduce((latest, current) => {
      const latestDate = new Date(latest.createdAt);
      const currentDate = new Date(current.createdAt);
      return currentDate > latestDate ? current : latest;
    });
  };

  const latestFeedback = getLatestFeedback();

  // Company feedback'i kontrol et
  const showCompanyFeedback = () => {
    return studentStatus === 5 && 
           latestFeedback && 
           latestFeedback.author === "company";
  };

  // Coordinator feedback'i kontrol et
  const showCoordinatorFeedback = () => {
    return status === 1 && 
           latestFeedback && 
           latestFeedback.author === "admin";
  };

  return (
    <div className="flex h-full flex-col mt-10 space-y-3">
      {/* ========================== */}
      {/* Company Supervisor Status */}
      {/* ========================== */}
      <div className="flex items-center justify-between rounded-lg border bg-background p-4">
        <span className="text-sm font-medium">{t("companySupervisorStatus")}</span>
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              companySupervisorLabel === "Accepted"
                ? "bg-green-500"
                : companySupervisorLabel === "Pending"
                ? "bg-yellow-500"
                : "bg-blue-500"
            }`}
          />
          <span className="text-sm capitalize">{t(companySupervisorLabel)}</span>
        </div>
      </div>

      {showCompanyFeedback() && (
        <div className="rounded-lg border bg-blue-50 p-4">
          <h4 className="text-sm font-medium text-blue-700">
            {t("feedbackFromCompanySupervisor")}
          </h4>
          <p className="mt-1 text-sm text-gray-700">{latestFeedback.content}</p>
        </div>
      )}

      {/* ========================== */}
      {/* Coordinator Status */}
      {/* ========================== */}
      <div className="flex items-center justify-between rounded-lg border bg-background p-4">
        <span className="text-sm font-medium">{t("coordinatorStatus")}</span>
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              coordinatorLabel === "Approved"
                ? "bg-green-500"
                : coordinatorLabel === "Rejected"
                ? "bg-red-500"
                : coordinatorLabel === "Finished"
                ? "bg-blue-500"
                : "bg-yellow-500"
            }`}
          />
          <span className="text-sm capitalize">{t(coordinatorLabel)}</span>
        </div>
      </div>

      {showCoordinatorFeedback() && (
        <div className="rounded-lg border bg-blue-50 p-4">
          <h4 className="text-sm font-medium text-blue-700">
            {t("feedbackFromCoordinator")}
          </h4>
          <p className="mt-1 text-sm text-gray-700">{latestFeedback.content}</p>
        </div>
      )}

      {/* ========================== */}
      {/* Score Section */}
      {/* ========================== */}
      <div className="flex mt-5 items-center justify-between rounded-lg border bg-background p-4">
        <span className="text-sm font-medium">{t("score")}</span>
        <span className="text-lg font-semibold text-primary">
          {score === null || score === undefined ? "-" : `${score}/100`}
        </span>
      </div>
    </div>
  );
};

export default FeedbackSection;