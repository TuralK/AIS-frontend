// components/FeedbackSection.jsx
import { useTranslation } from "react-i18next";
import {
  getCompanySupervisorStatus,
  getCoordinatorStatus,
} from "../../../../utils/statusUtils";

const FeedbackSection = ({ internshipData }) => {
  const { t } = useTranslation();

  // Utils fonksiyonları, yalnızca label (Pending/Accepted/… gibi) döner
  const companySupervisorLabel = getCompanySupervisorStatus(internshipData);
  const coordinatorLabel = getCoordinatorStatus(internshipData);

  const {
    companyStatus,
    status,                 
    studentStatus,          
    feedbackToStudent,      
    feedbackContextStudent, 
    score,
  } = internshipData;

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

      {/* Eğer studentStatus === 5 (şirket öğrenciye geri bildirim verdi) ise:
          feedbackToStudent metnini, Company Supervisor blokunun hemen altına yerleştir */}
      {studentStatus === 5 && feedbackToStudent && (
        <div className="mt-2 ml-4 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-3">
          <h4 className="text-sm font-medium text-blue-700">
            {t("feedbackToStudentLabel")}
          </h4>
          <p className="mt-1 text-sm text-gray-700">{feedbackToStudent}</p>
        </div>
      )}

      {/* ========================== */}
      {/* Coordinator Status (Admin) */}
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

      {/* Eğer studentStatus === 4 (admin öğrenciye geri bildirim verdi) ise:
          feedbackToStudent metnini, Coordinator blokunun hemen altına yerleştir */}
      {studentStatus === 4 && feedbackToStudent && (
        <div className="mt-2 ml-4 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-3">
          <h4 className="text-sm font-medium text-blue-700">
            {t("feedbackToStudentLabel")}
          </h4>
          <p className="mt-1 text-sm text-gray-700">{feedbackToStudent}</p>
        </div>
      )}

      {/* ========================== */}
      {/* Score Bölümü */}
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