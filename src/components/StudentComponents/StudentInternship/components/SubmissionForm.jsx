// components/SubmissionForm.jsx
import { useState } from "react";
import FileUploadSection from "./FileUploadSection";
import SubmitSection from "./SubmitSection";
import CustomAlertDialog from "../../../ui/custom_alert";
import { useTranslation } from "react-i18next";
import { requestLink } from "../../../../api/StudentApi/internshipApi";
import { Tooltip } from "@mui/material";

const SubmissionForm = ({ status, manualApplicationId, onRequestLink }) => {
  const [fileSPR, setFileSPR] = useState(null);
  const [fileSPES, setFileSPES] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { t } = useTranslation();

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const onlySPES = manualApplicationId !== null;

  const handleRequestLink = async () => {
    // validation for company fields
    if (!companyName.trim() || !companyEmail.trim()) {
      showAlert(t("companyNameEmailRequired"));
      return;
    }
    // email format validation
    if (!companyEmail.includes('@')) {
      showAlert(t("invalidEmailFormat"));
      return;
    }

    try {
      await requestLink(companyName, companyEmail);
      showAlert(t("linkRequestedSuccessfully"));
      onRequestLink && onRequestLink();
    } catch (err) {
      showAlert(err.response?.data?.message || t("requestLinkFailed"));
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-5 bg-white rounded-lg shadow-sm p-4 relative border border-gray-200">
      <CustomAlertDialog
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        title={t("error")}
        description={alertMessage}
        confirmLabel={t("ok")}
      />

      {!onlySPES && (
        <FileUploadSection
          label={t("uploadSPR")}
          uploadedFile={fileSPR}
          onFileChange={setFileSPR}
          onRemove={() => setFileSPR(null)}
        />
      )}
      <FileUploadSection
        label={t("uploadSPES")}
        uploadedFile={fileSPES}
        onFileChange={setFileSPES}
        onRemove={() => setFileSPES(null)}
      />

      {onlySPES && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">{t("companyName")}</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1 p-2 border rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">{t("companyEmail")}</label>
            <input
              type="email"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              className="mt-1 p-2 border rounded-lg"
            />
          </div>
        </div>
      )}

      <div className="mt-6 justify-end flex flex-col items-end gap-4">
        <SubmitSection
          uploadedFileSPR={fileSPR}
          uploadedFileSPES={fileSPES}
          status={status}
          isManualApplication={onlySPES}
        />
        {onlySPES && (
          <Tooltip title={t("requestLinkTooltip")} arrow>
            <button
              onClick={handleRequestLink}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {t("requestLink")}
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default SubmissionForm;