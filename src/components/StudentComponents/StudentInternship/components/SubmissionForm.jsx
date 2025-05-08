// components/SubmissionForm.jsx
import { useState } from "react";
import FileUploadSection from "./FileUploadSection";
import SubmitSection from "./SubmitSection";
import CustomAlertDialog from "../../../ui/custom_alert";
import { useTranslation } from "react-i18next";
import { requestLink } from "../../../../api/StudentApi/internshipApi";

const SubmissionForm = ({ status, manualApplicationId, onRequestLink }) => {
  const [fileSPR, setFileSPR] = useState(null);
  const [fileSPES, setFileSPES] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { t } = useTranslation();

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const onlySPES = manualApplicationId != null && status === 1;

  const handleRequestLink = async () => {
    try {
      await requestLink(manualApplicationId);
      showAlert(t("linkRequestedSuccessfully"));
    } catch (err) {
      showAlert(err.response?.data?.message || t("requestLinkFailed"));
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6 relative">
      <CustomAlertDialog
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        title={t("error")}
        description={alertMessage}
        confirmLabel={t("ok")}
      />

      <FileUploadSection
        label={t("uploadSPR")}
        uploadedFile={fileSPR}
        onFileChange={setFileSPR}
        onRemove={() => setFileSPR(null)}
        isSubmitted={isSubmitted}
        disabled={onlySPES || status === 2 || status === 4}
      />
      <FileUploadSection
        label={t("uploadSPES")}
        uploadedFile={fileSPES}
        onFileChange={setFileSPES}
        onRemove={() => setFileSPES(null)}
        isSubmitted={isSubmitted}
        disabled={status === 3 || status === 4}
      />

      <div className="mt-6 justify-end flex flex-col items-end gap-4">
        <SubmitSection
          uploadedFileSPR={fileSPR}
          uploadedFileSPES={fileSPES}
          isSubmitted={isSubmitted}
          setIsSubmitted={setIsSubmitted}
          status={status}
        />
        {onlySPES && (
          <button
            onClick={handleRequestLink}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            {t("requestLink")}
          </button>
        )}
      </div>
    </div>
  );
};

export default SubmissionForm;
