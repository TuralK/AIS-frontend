// components/SubmitSection.jsx
import { useState } from "react";
import axios from "axios";
import { CheckCircle2 } from "lucide-react";
import CustomAlertDialog from "../../../ui/custom_alert";
import { useTranslation } from "react-i18next";

const SubmitSection = ({
  uploadedFileSPR,
  uploadedFileSPES,
  status,
  isManualApplication,
}) => {
  const { t } = useTranslation();

  // Hata ve başarı için ayrı state’ler
  const [submissionError, setSubmissionError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async () => {
    if (status === 4) return;

    const requests = [];

    if (isManualApplication) {
      if (uploadedFileSPES) {
        const form = new FormData();
        form.append("internshipFile", uploadedFileSPES);
        form.append("fileType", "ManualSurvey");

        requests.push(
          axios
            .post(
              "http://localhost:3004/internship/internshipFile",
              form,
              {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
              }
            )
            .then((res) => {
              if (res.status !== 200) throw new Error("Bad status: " + res.status);
              return res;
            })
        );
      }
    } else {
      if (uploadedFileSPR) {
        const form = new FormData();
        form.append("Report", uploadedFileSPR);

        requests.push(
          axios
            .post(
              "http://localhost:3004/internship/internshipFile",
              form,
              {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
              }
            )
            .then((res) => {
              if (res.status !== 200) throw new Error("Bad status: " + res.status);
              return res;
            })
        );
      }
      if (uploadedFileSPES) {
        const form = new FormData();
        form.append("internshipFile", uploadedFileSPES);
        form.append("fileType", "Survey");

        requests.push(
          axios
            .post(
              "http://localhost:3004/internship/internshipFile",
              form,
              {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
              }
            )
            .then((res) => {
              if (res.status !== 200) throw new Error("Bad status: " + res.status);
              return res;
            })
        );
      }
    }

    
    if (requests.length === 0) {
      setErrorMessage(t("noFilesToUpload"));
      setSubmissionError(true);
      return;
    }

    try {
      await Promise.all(requests);
      
      setSuccessMessage(t("uploadSuccess")); 
      setSuccessOpen(true);
    } catch (err) {
      const msgFromServer = err.response?.data?.message;
      setErrorMessage(msgFromServer || t("uploadFailed"));
      setSubmissionError(true);
    }
  };

  return (
    <>
      <button
        onClick={handleSubmit}
        className="w-full sm:w-auto flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white hover:bg-red-700"
      >
        <span>{t("submit")}</span>
      </button>

      <CustomAlertDialog
        isOpen={submissionError}
        onClose={() => setSubmissionError(false)}
        title={t("error")}
        description={errorMessage}
        confirmLabel={t("ok")}
      />

      <CustomAlertDialog
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
        title={t("submissionSuccess")}
        description={successMessage}
        confirmLabel={t("ok")}
      />
    </>
  );
};

export default SubmitSection;