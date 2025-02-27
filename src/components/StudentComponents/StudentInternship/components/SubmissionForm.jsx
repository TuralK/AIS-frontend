import { useState } from "react";
import { Building2, FileText, Upload, X, CheckCircle } from "lucide-react";
import Questionnaire from "./Questionnaire";
import SubmitSection from "./SubmitSection";
import { useTranslation } from "react-i18next";

const questions = [
  {
    id: "experience",
    question: "How would you rate your internship experience?",
    type: "radio",
    options: ["Excellent", "Good", "Fair"],
  },
  // Diğer sorular...
];

const SubmissionForm = () => {
  const [submissionStatus] = useState("Ongoing");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useTranslation();

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const handleRemoveFile = () => {
    if (!isSubmitted) setUploadedFile(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6 relative">
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
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#a51c30]/10 mb-4">
                  <Upload className="h-8 w-8 text-[#a51c30]" />
                </div>
                <div className="text-center">
                  <span className="text-base font-medium text-[#a51c30]">{t("clickToUpload")}</span>
                  <p className="mt-2 text-sm text-gray-500">{t("dragDrop")}</p>
                  <p className="mt-1 text-xs text-gray-400">PDF (Max 10MB)</p>
                </div>
                <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} disabled={isSubmitted} />
              </label>
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