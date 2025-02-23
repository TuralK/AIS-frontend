import { useState } from "react"
import { ChevronDown } from "lucide-react"

const Question = ({ id, question, type, options = [], scale = 5 }) => {
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
                className={`${
                  type === "radio" ? "rounded-full" : "rounded"
                } border-gray-300 text-primary focus:ring-primary`}
              />
              <span className="text-sm text-gray-600">{option}</span>
            </label>
          ))}
        </div>
      </div>
    )
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
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-600">{num}</span>
            </label>
          ))}
        </div>
      </div>
    )
  }

  return null
}

const Questionnaire = ({ questions, title = "Questionnaire" }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="rounded-lg border bg-white">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <span className="text-lg font-medium">{title}</span>
        <ChevronDown className={`h-5 w-5 transform transition-transform ${isExpanded ? "rotate-180" : ""}`} />
      </button>
      {isExpanded && (
        <div className="border-t p-4">
          <div className="space-y-6">
            {questions.map((question) => (
              <Question key={question.id} {...question} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Questionnaire;