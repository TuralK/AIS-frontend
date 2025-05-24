import React, { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Tooltip } from "../../ui/tooltip"
import { uploadManualApplicationForm } from "../../../api/StudentApi/internshipApi"
import { FileHelpers } from "../../../utils/filehelper"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"

const FileUploadButton = ({ onUploadSuccess, isVisible = true }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadError, setUploadError] = useState("")
  const [modalError, setModalError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isCompanyModalOpen, setCompanyModalOpen] = useState(false)
  const [companyName, setCompanyName] = useState("")
  const [companyEmail, setCompanyEmail] = useState("")

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    setUploadError("")
    setSuccessMessage("")

    if (file) {
      if (file.type === "application/pdf") {
        setSelectedFile(file)
      } else {
        setUploadError(t("onlyPdfAllowed"))
        setTimeout(() => setUploadError(""), 3000)
        e.target.value = ""
      }
    }
  }

  const sendFile = async () => {
    if (!selectedFile) return;
  
    try {
      setIsUploading(true);
      setUploadError("");
      setModalError("");
      setSuccessMessage("");
  
      const response = await uploadManualApplicationForm(selectedFile, companyName, companyEmail);
  
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(t("fileUploaded"));
        setTimeout(() => setSuccessMessage(""), 5000);
        
        if (onUploadSuccess) {
          onUploadSuccess();
        }

        setCompanyModalOpen(false);
        setCompanyName("");
        setCompanyEmail("");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setUploadError(t("tryAgain"));
        setTimeout(() => setUploadError(""), 5000);
      }
    } catch (error) {
      console.error("Upload error:", error);
  
      const backendMsg = error.response?.data?.message;
      let errorMsg = "";
  
      if (backendMsg === "You already have an internship") {
        errorMsg = t("haveAnInternship");
      } else if (backendMsg === "File already exists") {
        errorMsg = t("fileAlreadyExists");
      } else if (error.request) {
        errorMsg = t("noResponse");
      } else {
        errorMsg = `${t("requestError")}: ${error.message}`;
      }

      setUploadError(errorMsg);
      setTimeout(() => setUploadError(""), 5000);
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
    if (selectedFile) {
      setModalError("") 
      setCompanyModalOpen(true)
    }
  }

  const handleCompanySubmit = () => {
    if (!companyName.trim()) {
      setModalError(t("companyNameEmailRequired")); 
      setTimeout(() => setModalError(""), 3000);
      return;
    }

    if (!companyEmail.trim()) {
      setModalError(t("companyNameEmailRequired")); 
      setTimeout(() => setModalError(""), 3000);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(companyEmail)) {
      setModalError(t("validEmail")); 
      setTimeout(() => setModalError(""), 3000);
      return;
    }

    sendFile();
  }

  const getInputClassName = (fieldType) => {
    const baseClass = "w-full";
    if (modalError) {
      if (fieldType === "companyName" && !companyName.trim()) {
        return `${baseClass} border-red-500 focus:border-red-500`;
      }
      if (fieldType === "companyEmail" && (!companyEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyEmail))) {
        return `${baseClass} border-red-500 focus:border-red-500`;
      }
    }
    return baseClass;
  }

  const truncateFileName = FileHelpers.truncateFileName

  return (
    <>
      {isVisible && (
        <>
          <Input
            type="file"
            id="fileUploadInput"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf"
            onChange={handleFileChange}
          />

          <div className="fixed bottom-24 left-8 z-50">
            {uploadError && (
              <div className="p-2 mb-2 bg-red-100 border border-red-400 text-red-700 rounded shadow-lg max-w-xs">
                {uploadError}
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
        </>
      )}

      {/* Company Info Modal */}
      <Dialog open={isCompanyModalOpen} onOpenChange={setCompanyModalOpen}>
        <DialogContent>
          <DialogHeader errorMessage={modalError}>
            <DialogTitle>{t('companyInfo')}</DialogTitle>
          </DialogHeader>
                             
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('companyName')}
              </label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder={t('enterCompanyName')}
                className={getInputClassName("companyName")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('companyEmail')}
              </label>
              <Input
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                placeholder={t('enterCompanyEmail')}
                className={getInputClassName("companyEmail")}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setCompanyModalOpen(false);
                setCompanyName("");
                setCompanyEmail("");
                setModalError(""); // Modal kapanırken modal error'ı temizle
              }}
              className="bg-gray-200 hover:bg-gray-500 hover:text-white"
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={handleCompanySubmit}
              disabled={isUploading}
              className="bg-[#8B0000] hover:bg-[#A52A2A] text-white"
            >
              {t('submit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default FileUploadButton