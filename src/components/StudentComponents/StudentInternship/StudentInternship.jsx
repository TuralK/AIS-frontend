import { useState } from "react";
import SubmissionForm from "./components/SubmissionForm";
import FeedbackSection from "./components/FeedbackSection";
import CustomAlertDialog from "../../ui/custom_alert";
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from "lucide-react";

const questions = [
  {
    id: "experience",
    question: "How would you rate your internship experience?",
    type: "radio",
    options: ["Excellent", "Good", "Fair"],
  },
  // ... diğer sorular
];

const StudentInternship = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [answers, setAnswers] = useState({});
  const [downloadError, setDownloadError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { t } = useTranslation();

  const handleSubmit = () => {
    if (!uploadedFile) {
      setErrorMessage(t('pleaseUploadSPR'));
      setDownloadError(true);
      return;
    }
    const allQuestionsAnswered = questions.every(q => answers[q.id] && answers[q.id] !== "");
    if (!allQuestionsAnswered) {
      setErrorMessage(t('pleaseAnswerAllQuestions'));
      setDownloadError(true);
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      {/* Container */}
      <div className={`mx-auto max-w-[1800px] flex transition-all duration-500 items-start ${isFeedbackOpen ? "justify-start" : "justify-center"}`}>
        <div className={`transition-all duration-500 ${isFeedbackOpen ? "w-1/2" : "w-full"}`}>
          <SubmissionForm 
            uploadedFile={uploadedFile} 
            setUploadedFile={setUploadedFile}
            answers={answers}
            setAnswers={setAnswers}
          />
        </div>
        {isFeedbackOpen && (
          <div className="w-1/2 transition-all duration-500">
            <FeedbackSection
              feedback="Örnek geri bildirim..."
              companyStatus="accepted"
              coordinatorStatus="pending"
              score={85}
            />
          </div>
        )}
      </div>

      {/* Butonlar */}
      <div className="mt-4 flex justify-center flex-wrap gap-4">
        <button
          onClick={handleSubmit}
          disabled={isSubmitted}
          className={`w-full sm:w-auto flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white hover:bg-red-700 ${isSubmitted ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <span>{t('submitAll')}</span>
          {isSubmitted && <CheckCircle2 className="h-4 w-4" />}
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setIsFeedbackOpen(prev => !prev)}
        >
          {isFeedbackOpen ? "Kapat" : "Geri Bildirimi Aç"}
        </button>
      </div>

      {/* Uyarı */}
      <CustomAlertDialog
        isOpen={downloadError}
        onClose={() => setDownloadError(false)}
        title={t('error')}
        description={errorMessage}
        onConfirm={() => setDownloadError(false)}
        confirmLabel={t('ok')}
      />
    </div>
  );
};

export default StudentInternship;