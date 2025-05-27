// components/FeedbackSection.jsx
import { useTranslation } from "react-i18next";
import {
  getCompanySupervisorStatus,
  getCoordinatorStatus,
  getCurrentStatus,
} from "../../../../utils/statusUtils";

const FeedbackSection = ({ internshipData, latestStudentFeedbacks }) => {
  const { t } = useTranslation();

  const companySupervisorLabel = getCompanySupervisorStatus(internshipData);
  const coordinatorLabel = getCoordinatorStatus(internshipData);
  const studentLabel = getCurrentStatus(internshipData);

  const {
    studentStatus,
    score,
    status,
  } = internshipData;



  return (
    <div className="flex h-full flex-col mt-10 space-y-3">
      {/* ========================== */}
      {/* Current Status */}
      {/* ========================== */}
      <div className="flex items-center justify-between rounded-lg border bg-background p-4">
        <span className="text-sm font-medium">{t("currentStatus")}</span>
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
          <span className="text-sm">{t(studentLabel)}</span>
        </div>
      </div>

      


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
          <span className="text-sm">{t(companySupervisorLabel)}</span>
        </div>
      </div>

      

      {/* Company Feedbacks */}
      {latestStudentFeedbacks
        .filter((feedback) => feedback.author === "company")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort to show latest first
        .map((feedback) => (
          <div key={feedback._id} className="rounded-lg border bg-blue-50 p-4">
            <h4 className="text-sm font-medium text-blue-700">
              {t("feedbackFromCompanySupervisor")}
            </h4>
            <p className="mt-1 text-sm text-gray-700">{feedback.content}</p>
          </div>
        ))}

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
          <span className="text-sm">{t(coordinatorLabel)}</span>
        </div>
      </div>

      {/* Coordinator Feedbacks */}
      {latestStudentFeedbacks
        .filter((feedback) => feedback.author === "admin")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort to show latest first
        .map((feedback) => (
          <div key={feedback._id} className="rounded-lg border bg-blue-50 p-4">
            <h4 className="text-sm font-medium text-blue-700">
              {t("feedbackFromCoordinator")}
            </h4>
            <p className="mt-1 text-sm text-gray-700">{feedback.content}</p>
          </div>
        ))}

      


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