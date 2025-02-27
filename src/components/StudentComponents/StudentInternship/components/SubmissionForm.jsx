import { useState, useRef } from "react";
import { Building2, FileText, Upload, X, CheckCircle } from "lucide-react";
import Questionnaire from "./Questionnaire";
import SubmitSection from "./SubmitSection";
import { useTranslation } from "react-i18next";
import CustomAlertDialog from "../../../ui/custom_alert";

const questions = [
  {
    id: "experience",
    question: "How would you rate your internship experience?",
    type: "radio",
    options: ["Excellent", "Good", "Fair"],
  }
  // Diğer sorular...
];

const SubmissionForm = () => {
  const [submissionStatus] = useState("Ongoing");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { t } = useTranslation();
  const inputRef = useRef(null);

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setUploadedFile(file);
    } else if (file) {
      showAlert(t("only_pdf_allowed"));
    }
  };

  const handleRemoveFile = () => {
    if (!isSubmitted) setUploadedFile(null);
  };

  // Validate that file is PDF
  const validateFile = (file) => {
    return file.type === "application/pdf";
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0] && !isSubmitted) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setUploadedFile(file);
      } else {
        showAlert(t("only_pdf_allowed"));
      }
    }
  };

  // Handle button click to trigger file input
  const handleButtonClick = () => {
    if (!isSubmitted && inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6 relative">
      {/* Custom Alert Dialog */}
      <CustomAlertDialog
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        title={t("error")}
        description={alertMessage}
        confirmLabel={t("ok")}
      />

      {/* Status Bar */}
      <div className="flex justify-end p-4 border-b">
        <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-1.5 text-sm font-medium text-green-600">
          <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
          {submissionStatus}
        </div>
      </div>

      <div className="p-6 space-y-8 relative">
        {/* Company and Internship Info */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2 rounded-lg border border-gray-200 p-5 transition-all hover:shadow-md">
            <div className="text-sm font-medium text-gray-500">{t("company")}</div>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#a51c30]/10">
                <Building2 className="h-5 w-5 text-[#a51c30]" />
              </div>
              <h2 className="text-lg font-semibold">Tech Solutions Inc.</h2>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-gray-200 p-5 transition-all hover:shadow-md">
            <div className="text-sm font-medium text-gray-500">{t("internshipName")}</div>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#a51c30]/10">
                <FileText className="h-5 w-5 text-[#a51c30]" />
              </div>
              <h2 className="text-lg font-semibold">Software Development Intern</h2>
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="space-y-4 relative">
          {/* Selective blur overlay for file upload section */}
          {isSubmitted && (
            <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[0.5px] rounded-lg pointer-events-none"></div>
          )}
          
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-800">{t("uploadSPR")}</h3>
            {uploadedFile && (
              <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-medium text-green-600">
                <CheckCircle className="h-4 w-4" />
                {t("uploaded")}
              </div>
            )}
          </div>

          <div className={isSubmitted ? "pointer-events-none" : ""}>
            {uploadedFile ? (
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#a51c30]/10">
                    <FileText className="h-5 w-5 text-[#a51c30]" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">{uploadedFile.name}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{t('pdfDocument')}</p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="rounded-full p-2 text-gray-400 hover:bg-gray-200 hover:text-[#a51c30] transition-colors"
                  aria-label="Remove file"
                  disabled={isSubmitted}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div 
                className={`relative ${isSubmitted ? "pointer-events-none opacity-70" : ""}`}
                onDragEnter={handleDrag}
              >
                <div 
                  className={`flex flex-col items-center justify-center rounded-lg border-2 ${dragActive ? "border-[#a51c30] bg-[#a51c30]/5" : "border-dashed border-gray-300 bg-gray-50"} p-8 hover:bg-gray-100 transition-colors cursor-pointer`}
                  onClick={handleButtonClick}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#a51c30]/10 mb-4">
                    <Upload className="h-8 w-8 text-[#a51c30]" />
                  </div>
                  <div className="text-center">
                    <span className="text-base font-medium text-[#a51c30]">{t("clickToUpload")}</span>
                    <p className="mt-2 text-sm text-gray-500">{t("dragDrop") || "veya dosyayı buraya sürükleyip bırakın"}</p>
                  </div>
                  <input 
                    ref={inputRef}
                    type="file" 
                    className="hidden" 
                    accept=".pdf,application/pdf" 
                    onChange={handleFileUpload} 
                    disabled={isSubmitted} 
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Questionnaire Section */}
        <div className="mt-8 border border-gray-200 rounded-lg overflow-hidden relative">
          {/* Selective blur overlay for questionnaire section */}
          {isSubmitted && (
            <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[0.5px] rounded-lg pointer-events-none"></div>
          )}
          
          <div className={`p-6 ${isSubmitted ? "pointer-events-none" : ""}`}>
            <Questionnaire questions={questions} answers={answers} setAnswers={setAnswers} disabled={isSubmitted} />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 justify-end flex">
          <SubmitSection 
            uploadedFile={uploadedFile} 
            answers={answers} 
            questions={questions} 
            isSubmitted={isSubmitted}
            setIsSubmitted={setIsSubmitted}
          />
        </div>
      </div>
    </div>
  );
};

export default SubmissionForm;