import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import CustomAlertDialog from "../../../ui/custom_alert";
import { useTranslation } from "react-i18next";

const SubmitSection = ({ uploadedFile, answers, questions, isSubmitted, setIsSubmitted }) => {
  const { t } = useTranslation();
  const [submissionError, setSubmissionError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = () => {
    if (!uploadedFile) {
      setErrorMessage(t("pleaseUploadSPR"));
      setSubmissionError(true);
      return;
    }
    const allQuestionsAnswered = questions.every(
      (q) => answers[q.id] && answers[q.id] !== ""
    );
    if (!allQuestionsAnswered) {
      setErrorMessage(t("pleaseAnswerAllQuestions"));
      setSubmissionError(true);
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <>
      <button
        onClick={handleSubmit}
        disabled={isSubmitted}
        className={`w-full sm:w-auto flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white hover:bg-red-700 ${
          isSubmitted ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <span>{t("submitAll")}</span>
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