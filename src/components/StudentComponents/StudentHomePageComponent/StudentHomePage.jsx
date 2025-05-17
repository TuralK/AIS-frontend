import React, { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Tooltip } from "../../ui/tooltip"
import { uploadApplicationForm } from "../../../api/StudentApi/internshipApi"
import { FileHelpers } from "../../../utils/filehelper"
import { useMatches } from 'react-router-dom';

const StudentHomePage = () => {
  const matches = useMatches();
  const { t } = useTranslation();
  const currentMatch = matches[matches.length - 1];
  const titleKey = currentMatch?.handle?.titleKey;
  
  React.useEffect(() => {
    const baseTitle = 'AIS';
    document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle;
  }, [titleKey, t]);
  
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const rules = [
    t("summerRule1"), t("summerRule2"), t("summerRule3"), t("summerRule4"), t("summerRule5"),
    t("summerRule6"), t("summerRule7"), t("summerRule8"), t("summerRule9"), t("summerRule10"),
    t("summerRule11"),
  ]

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    setErrorMessage("")
    setSuccessMessage("")

    if (file) {
      if (file.type === "application/pdf") {
        setSelectedFile(file)
      } else {
        setErrorMessage(t("onlyPdfAllowed"))
        setTimeout(() => setErrorMessage(""), 3000)
        e.target.value = ""
      }
    }
  }

  const sendFile = async () => {
    if (!selectedFile) return;
  
    try {
      setIsUploading(true);
      setErrorMessage("");
      setSuccessMessage("");
  
      const response = await uploadApplicationForm(selectedFile);
  
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(t("fileUploaded"));
        setIsSubmitted(true);
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        setErrorMessage(t("tryAgain"));
        setTimeout(() => setErrorMessage(""), 5000);
      }
    } catch (error) {
      console.error("Upload error:", error);
  
      const backendMsg = error.response?.data?.message;
  
      if (backendMsg === "You already have an internship") {
        setErrorMessage(t("haveAnInternship"));
      } else if (backendMsg === "File already exists") {
        setErrorMessage(t("fileAlreadyExists"));
      } else if (error.request) {
        setErrorMessage(t("noResponse"));
      } else {
        setErrorMessage(`${t("requestError")}: ${error.message}`);
      }
  
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setIsUploading(false);
    }
  };
  

  const handleButtonClick = () => {
    if (!selectedFile) {
      fileInputRef.current.click()
    }
  }

  const clearFile = (e) => {
    e.stopPropagation()
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleConfirm = (e) => {
    e.stopPropagation()
    sendFile()
  }

  const truncateFileName = FileHelpers.truncateFileName

  if (isSubmitted) {
    return (
      <div className="relative w-full min-h-screen">
        <div className="text-center p-5">
          <h2 className="mt-7 text-2xl font-medium">{t("summerRegulations")}</h2>
          <table className="mx-auto mt-10 w-[90%] border-collapse bg-[#f1f1f1]">
            <thead>
              <tr>
                <th className="border border-[#ddd] p-2 bg-[#f2f2f2] text-left"></th>
                <th className="border border-[#ddd] p-2 bg-[#f2f2f2] text-left">{t("description")}</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule, index) => (
                <tr key={index}>
                  <td className="border border-[#ddd] p-2 bg-[#f2f2f2] text-left">{index + 1}</td>
                  <td className="border border-[#ddd] p-2 align-top">{rule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="fixed bottom-8 left-8 z-50">
          {successMessage && (
            <div className="p-2 bg-green-100 border border-green-400 text-green-700 rounded shadow-lg max-w-xs">
              {successMessage}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full min-h-screen">
      <div className="text-center p-5">
        <h2 className="mt-7 text-2xl font-medium">{t("summerRegulations")}</h2>
        <table className="mx-auto mt-10 w-[90%] border-collapse bg-[#f1f1f1]">
          <thead>
            <tr>
              <th className="border border-[#ddd] p-2 bg-[#f2f2f2] text-left"></th>
              <th className="border border-[#ddd] p-2 bg-[#f2f2f2] text-left">{t("description")}</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule, index) => (
              <tr key={index}>
                <td className="border border-[#ddd] p-2 bg-[#f2f2f2] text-left">{index + 1}</td>
                <td className="border border-[#ddd] p-2 align-top text-left">{rule}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
        aria-label={t("uploadDocument")}
      />

      <div className="fixed bottom-24 left-8 z-50">
        {errorMessage && (
          <div className="p-2 mb-2 bg-red-100 border border-red-400 text-red-700 rounded shadow-lg max-w-xs">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="p-2 mb-2 bg-green-100 border border-green-400 text-green-700 rounded shadow-lg max-w-xs">
            {successMessage}
          </div>
        )}
      </div>

      <div className="fixed bottom-8 left-8 z-10 flex items-center">
        <Tooltip content={selectedFile ? t("clickToSendFile") : t("clickToSelectFile")}>
          <button
            className={`h-12 rounded-l-full ${selectedFile ? "rounded-r-none" : "rounded-r-full"} 
              bg-[#8B0000] flex items-center justify-center border-none shadow-lg 
              cursor-pointer transition-all duration-300 hover:bg-[#A52A2A]
              ${selectedFile ? "pl-4 pr-3 min-w-[200px] max-w-[300px]" : "w-12"}`}
            onClick={handleButtonClick}
            title={selectedFile ? selectedFile.name : t("uploadDocument")}
            aria-label={selectedFile ? selectedFile.name : t("uploadDocument")}
            disabled={isUploading}
          >
            {!selectedFile ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            ) : (
              <span className="text-white text-sm whitespace-nowrap overflow-hidden">{truncateFileName(selectedFile.name)}</span>
            )}
          </button>
        </Tooltip>

        {selectedFile && (
          <>
            <button
              className="h-12 w-10 bg-gray-400 flex items-center justify-center border-none cursor-pointer hover:bg-gray-500 transition-colors"
              onClick={clearFile}
              aria-label={t("clear")}
              disabled={isUploading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <button
              className="h-12 w-10 rounded-r-full bg-green-500 flex items-center justify-center border-none cursor-pointer hover:bg-green-600 transition-colors"
              onClick={handleConfirm}
              aria-label={t("send")}
              disabled={isUploading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default StudentHomePage
