import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const Question = ({ id, question, type, options = [], scale = 5, answers, setAnswers }) => {
  const handleChange = (e) => {
    const { value, checked } = e.target;
    if (type === "checkbox") {
      const current = answers[id] || [];
      if (checked) {
        setAnswers(prev => ({ ...prev, [id]: [...current, value] }));
      } else {
        setAnswers(prev => ({ ...prev, [id]: current.filter(v => v !== value) }));
      }
    } else {
      setAnswers(prev => ({ ...prev, [id]: type === "rating" ? Number(value) : value }));
    }
  };

  if (type === "radio" || type === "checkbox") {
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-700">{question}</p>
        <div className="space-y-2">
          {options.map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type={type}
                name={id}
                value={option}
                onChange={handleChange}
                checked={type === "radio" ? answers?.[id] === option : (answers?.[id] || []).includes(option)}
                className={`${type === "radio" ? "rounded-full" : "rounded"} border-gray-300 text-primary focus:ring-primary`}
              />
              <span className="text-sm text-gray-600">{option}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (type === "rating") {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-4">
          <span className="text-sm text-gray-700">{question}</span>
        </div>
        <div className="flex gap-4">
          {Array.from({ length: scale }, (_, i) => i + 1).map((num) => (
            <label key={num} className="flex flex-col items-center gap-1">
              <input
                type="radio"
                name={id}
                value={num}
                onChange={handleChange}
                checked={answers?.[id] === num}
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-600">{num}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

const Questionnaire = ({ questions, answers, setAnswers }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#a51c30]/5 p-4 border-b border-gray-200 rounded-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <span className="text-lg font-medium">{t("questionnaire")}</span>
        <ChevronDown className={`h-5 w-5 transform transition-transform ${isExpanded ? "rotate-180" : ""}`} />
      </button>
      {isExpanded && (
        <div className="border-t p-4">
          <div className="space-y-6">
            {questions.map((question) => (
              <Question key={question.id} {...question} answers={answers} setAnswers={setAnswers} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Questionnaire;