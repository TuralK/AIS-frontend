// components/FileUploadSection.jsx
import { useRef } from "react";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const FileUploadSection = ({
  label,
  uploadedFile,
  onFileChange,
  onRemove,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const inputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file?.type === "application/pdf") onFileChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.type === "application/pdf") onFileChange(file);
  };

  const handleButtonClick = () => {
    if (inputRef.current) inputRef.current.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-gray-800 mt-0">{label}</h3>
        {uploadedFile && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-medium text-green-600">
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
              <span className="text-sm font-medium">{uploadedFile.name}</span>
              <p className="text-xs text-gray-500 mt-0.5">{t("pdfDocument")}</p>
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
        <div
          className={`relative cursor-pointer ${disabled ? "opacity-70" : ""}`}
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
              <span className="text-base font-medium text-[#a51c30]">{t("clickToUpload")}</span>
              <p className="mt-2 text-sm text-gray-500">{t("dragDrop")}</p>
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
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;