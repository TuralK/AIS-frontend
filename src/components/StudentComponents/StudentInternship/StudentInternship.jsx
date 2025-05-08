import { useState } from "react";
import SubmissionForm from "./components/SubmissionForm";
import FeedbackSection from "./components/FeedbackSection";
import { useTranslation } from "react-i18next";

const StudentInternship = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <div
        className={`mx-auto max-w-[1800px] flex transition-all duration-500 items-start ${isFeedbackOpen ? "justify-start" : "justify-center"
          }`}
      >
        <div className={`transition-all duration-500 ${isFeedbackOpen ? "w-1/2" : "w-full"}`}>
          <SubmissionForm />
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

      {/* Geri Bildirimi Aç/Kapat Butonu denemelik olarak duruyor silinecek*/}
      <div className="mt-4 flex justify-center">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setIsFeedbackOpen(prev => !prev)}
        >
          {isFeedbackOpen ? "Kapat" : "Geri Bildirimi Aç"}
        </button>
      </div>
    </div>
  );
};

export default StudentInternship;