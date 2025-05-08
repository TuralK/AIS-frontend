// components/SubmitSection.jsx
import { useState } from "react";
import axios from "axios";
import { CheckCircle2 } from "lucide-react";
import CustomAlertDialog from "../../../ui/custom_alert";
import { useTranslation } from "react-i18next";

const SubmitSection = ({
  uploadedFileSPR,
  uploadedFileSPES,
  isSubmitted,
  setIsSubmitted,
  status,  // 2: SPR kapalı, 3: SPES kapalı, 4: tümü kapalı
}) => {
  const { t } = useTranslation();
  const [submissionError, setSubmissionError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    if (status === 4) return;

    const requests = [];

    if (status !== 2 && uploadedFileSPR) {
      const reportData = new FormData();
      reportData.append("Report", uploadedFileSPR);
      requests.push(
        axios.post(
          "http://localhost:3004/internship/uploadReport",
          reportData,
          { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
        )
      );
    }

    if (status !== 3 && uploadedFileSPES) {
      const surveyData = new FormData();
      surveyData.append("Survey", uploadedFileSPES);
      requests.push(
        axios.post(
          "http://localhost:3004/internship/uploadSurvey",
          surveyData,
          { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
        )
      );
    }

    if (requests.length === 0) {
      setErrorMessage(t("noFilesToUpload"));
      setSubmissionError(true);
      return;
    }

    try {
      await Promise.all(requests);
      setIsSubmitted(true);
    } catch (err) {
      // Eğer back-end { message: "..." } dönüyorsa message'ı al, değilse data'yı string'e çevir
      const data = err.response?.data;
      const msg =
        typeof data === "object"
          ? data.message || JSON.stringify(data)
          : data || err.message || t("uploadFailed");

      setErrorMessage(msg);
      setSubmissionError(true);
    }
  };

  const disabled = isSubmitted || status === 4;

  return (
    <>
      <button
        onClick={handleSubmit}
        disabled={disabled}
        className={`w-full sm:w-auto flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white hover:bg-red-700 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <span>{t("submit")}</span>
        {isSubmitted && <CheckCircle2 className="h-4 w-4" />}
      </button>

      <CustomAlertDialog
        isOpen={submissionError}
        onClose={() => setSubmissionError(false)}
        title={t("error")}
        description={errorMessage}
        onConfirm={() => setSubmissionError(false)}
        confirmLabel={t("ok")}
      />
    </>
  );
};

export default SubmitSection;