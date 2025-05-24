// components/SubmissionForm.jsx
import { useState } from "react";
import FileUploadSection from "./FileUploadSection";
import SubmitSection from "./SubmitSection";
import CustomAlertDialog from "../../../ui/custom_alert";
import { useTranslation } from "react-i18next";
import { requestLink } from "../../../../api/StudentApi/internshipApi";
import { Tooltip } from "@mui/material";
import { studentAPI } from "../../../../services";
import downloadTemplateFile from "../../../../api/downloadApi";

const SubmissionForm = ({ status, manualApplicationId, onRequestLink, studentStatus, companyStatus }) => {
  const [fileSPR, setFileSPR] = useState(null);
  const [fileSPES, setFileSPES] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { t } = useTranslation();

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const onlySPES = manualApplicationId !== null;

  const handleRequestLink = async () => {
    try {
      await requestLink();
      showAlert(t("linkRequestedSuccessfully"));
      onRequestLink && onRequestLink();
    } catch (err) {
      showAlert(err.response?.data?.message || t("requestLinkFailed"));
    }
  };

  const handleDownload = async (fileName) => {
    try {
      const result = await downloadTemplateFile(studentAPI.defaults.baseURL, fileName);

      if (result.success) {
        
      } else {
        showAlert(result.message || t("templateDownloadFailed"));
        console.error(result.message);
      }
    } catch (error) {
      showAlert(t("templateDownloadFailed"));
      console.error('Download error:', error);
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
          showQuestionMark={studentStatus > 1 && studentStatus !== 2 && status !== 0 && status !== 2}
          disabled={status === 2 || companyStatus === 2}
          showDownloadButton={true}
          downloadTooltip={t("downloadSPRTemplate")}
          onDownload={() => handleDownload('SummerPracticeReportTemplate.docx')}
        />
      )}
      <FileUploadSection
        label={t("uploadSPES")}
        uploadedFile={fileSPES}
        onFileChange={setFileSPES}
        onRemove={() => setFileSPES(null)}
        showQuestionMark={studentStatus > 2 && status !== 0 && status !== 2}
        disabled={status === 2}
        showDownloadButton={true}
        downloadTooltip={t("downloadSPESTemplate")}
        onDownload={() => handleDownload('SummerPracticeSurveyTemplate.docx')}
      />

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