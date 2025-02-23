import { useState } from "react"
import { Building2, FileText, Upload, X } from "lucide-react"
import Questionnaire from "./Questionnaire"
import { useTranslation } from 'react-i18next';

const questions = [
  {
    id: "experience",
    question: "How would you rate your internship experience?",
    type: "radio",
    options: ["Excellent", "Good", "Fair"],
  },
  // ... diğer sorular buraya eklenebilir
]

const SubmissionForm = () => {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [submissionStatus] = useState("Ongoing")
  const { t, i18n } = useTranslation();

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
  }

  return (
    <div className="h-full space-y-6 overflow-y-auto p-6">
      {/* Status Indicator */}
      <div className="flex justify-end">
        <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-1 text-sm text-green-600">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          {submissionStatus}
        </div>
      </div>

      {/* Company and Internship Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 rounded-lg border p-4">
          <div className="text-sm text-gray-500">{t('company')}</div>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold">Tech Solutions Inc.</h2>
          </div>
        </div>

        <div className="space-y-2 rounded-lg border p-4">
          <div className="text-sm text-gray-500">{t('internshipName')}</div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold">Software Development Intern</h2>
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">{t('uploadSPR')}</h3>
          {uploadedFile && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1 text-sm text-green-600">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              {t('uploaded')}
            </div>
          )}
        </div>

        {uploadedFile ? (
          <div className="flex items-center justify-between rounded-lg border border-dashed p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-400" />
              <span className="text-sm">{uploadedFile.name}</span>
            </div>
            <button
              onClick={handleRemoveFile}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-8 hover:bg-gray-50">
            <Upload className="mb-2 h-8 w-8 text-gray-400" />
            <div className="text-center">
              <span className="text-sm font-medium text-primary">{t('clickToUpload')}</span>
              <p className="mt-1 text-xs text-gray-500">{t('dragDrop')}</p>
            </div>
            <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
          </label>
        )}
      </div>

      {/* Questionnaire Section */}
      <Questionnaire questions={questions} />
    </div>
  )
}

export default SubmissionForm;