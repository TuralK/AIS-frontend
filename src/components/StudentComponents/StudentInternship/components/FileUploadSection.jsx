// components/FileUploadSection.jsx
import { useRef } from "react";
import { Upload, FileText, X, CheckCircle, Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "@mui/material";

const FileUploadSection = ({
  label,
  uploadedFile,
  onFileChange,
  onRemove,
  showQuestionMark = false,
  disabled = false,
  showDownloadButton = false,
  downloadTooltip = "",
  onDownload = null,
}) => {
  const { t } = useTranslation();
  const inputRef = useRef(null);

  const handleFileUpload = (e) => {
    if (disabled) return;
    const file = e.target.files?.[0];
    if (file?.type === "application/pdf") onFileChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file?.type === "application/pdf") onFileChange(file);
  };

  const handleButtonClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleDownloadClick = (e) => {
    e.stopPropagation();
    if (onDownload) onDownload();
  };

  return (
    <div className="space-y-4 mt-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-gray-800 mt-0 flex items-center gap-1">
            {label}
            {showQuestionMark && (
              <Tooltip title={t("questionMarkTooltip")}>
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 text-yellow-600 text-xs font-bold">
                  ?
                </span>
              </Tooltip>
            )}
          </h3>
          {showDownloadButton && downloadTooltip && onDownload && (
            <Tooltip title={downloadTooltip}>
              <button
                onClick={handleDownloadClick}
                className="w-6 h-6 flex items-center justify-center rounded bg-[#a51c30] text-white hover:bg-white hover:text-[#a51c30] hover:border hover:border-[#a51c30] transition-colors"
                aria-label="Download template"
              >
                <Download className="h-3 w-3" />
              </button>
            </Tooltip>
          )}
        </div>
        {uploadedFile && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-bold text-green-600">
            <CheckCircle className="h-4 w-4" />
            {t("uploaded")}
          </div>
        )}
      </div>

      {uploadedFile ? (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#a51c30]/10">
              <FileText className="h-5 w-5 text-[#a51c30]" />
            </div>
            <div>
              <span className="text-sm font-bold">{uploadedFile.name}</span>
              <p className="text-xs font-bold text-gray-500 mt-0.5">{t("pdfDocument")}</p>
            </div>
          </div>
          <button
            onClick={onRemove}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-200 hover:text-[#a51c30] transition-colors"
            aria-label="Remove file"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <div
            className={`relative cursor-pointer ${disabled ? "opacity-50" : ""}`}
            onClick={handleButtonClick}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
          >
            <div className="flex flex-col items-center justify-center rounded-lg border-dashed border-2 border-gray-300 bg-gray-50 p-8 hover:bg-gray-100 transition-colors">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#a51c30]/10 mb-4">
                <Upload className="h-8 w-8 text-[#a51c30]" />
              </div>
              <div className="text-center">
                <span className="text-base font-bold text-[#a51c30]">{t("clickToUpload")}</span>
                <p className="mt-2 text-sm font-bold text-gray-500">{t("dragDrop")}</p>
              </div>
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".pdf,application/pdf"
                onChange={handleFileUpload}
                disabled={disabled}
              />
            </div>
            {disabled && (
              <div className="absolute inset-0 bg-white bg-opacity-60 cursor-not-allowed rounded-lg" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;