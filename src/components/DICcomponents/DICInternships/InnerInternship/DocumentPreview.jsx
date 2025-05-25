import { useState, useEffect } from "react"
import { Button } from "../../../ui/button"
import {  FileText, Download, Eye, Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { adminAPI } from "../../../../services"

const DocumentPreview = ({
  title,
  onDownload,
  documentType,
  documentId,
  isAvailable = false, 
}) => {
  const { t } = useTranslation()
  const [pdfError, setPdfError] = useState(false)
  const [isLoading, setIsLoading] = useState(false) 
  const [iframeLoaded, setIframeLoaded] = useState(false)
  
  const fileUrl = documentId ? `${adminAPI.defaults.baseURL}/serveFile/${documentId}` : null
  
  useEffect(() => {
    if (!isAvailable || !documentId) {
      setIsLoading(false)
      setPdfError(false)
    } else {
      setIsLoading(true)
      setPdfError(false)
      setIframeLoaded(false)
    }
  }, [isAvailable, documentId])

  const handleDownload = () => {
    if (onDownload && isAvailable) {
      onDownload(documentType)
    }
  }

  const handleIframeLoad = () => {
    console.log('Iframe loaded successfully for:', fileUrl)
    setIsLoading(false)
    setPdfError(false)
    setIframeLoaded(true)
  }

  const handleIframeError = () => {
    console.error('Iframe loading error for:', fileUrl)
    setPdfError(true)
    setIsLoading(false)
    setIframeLoaded(false)
  }

  useEffect(() => {
    if (isLoading && isAvailable && documentId) {
      const timeout = setTimeout(() => {
        if (isLoading && !iframeLoaded) {
          console.warn('Iframe loading timeout for:', fileUrl)
          setIsLoading(false)
          setPdfError(true)
        }
      }, 10000) 

      return () => clearTimeout(timeout)
    }
  }, [isLoading, isAvailable, documentId, iframeLoaded, fileUrl])

  return (
    <div className="border rounded-md overflow-hidden mt-10">
      {/* Header with title and action buttons */}
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-800" />
          <div>
            <p className="font-medium">{title}</p>
            <p className="text-xs text-gray-500">
              {!isAvailable ? t("fileNotAvailable") : (
                pdfError ? t("previewError") : 
                isLoading ? t("loading") : 
                t("ready")
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Download Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            disabled={!isAvailable}
            className={`${isAvailable
              ? "bg-red-800 text-white hover:bg-red-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            <Download className="h-4 w-4 mr-1" />
            {t("download")}
          </Button>
        </div>
      </div>

      {/* Document preview area */}
      <div className="p-0 bg-gray-100">
        <div className="aspect-[4/3] bg-white border-y relative">
          
          {/* Document not available state */}
          {!isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="flex flex-col items-center gap-2 text-center p-4">
                <FileText className="h-12 w-12 text-gray-400" />
                <p className="text-gray-500 font-medium">
                  {t("documentNotAvailable") || "Doküman mevcut değil"}
                </p>
                <p className="text-xs text-gray-400">
                  {t("documentNotUploaded") || "Bu doküman henüz yüklenmemiş"}
                </p>
              </div>
            </div>
          )}

          {/* Loading indicator - sadece document varsa göster */}
          {isAvailable && isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                <p className="text-sm text-gray-500">{t("loading") || "Yükleniyor..."}</p>
              </div>
            </div>
          )}
          
          {/* Error state - sadece document varsa ve hata varsa göster */}
          {isAvailable && pdfError && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="flex flex-col items-center gap-2 text-center p-4">
                <FileText className="h-12 w-12 text-gray-400" />
                <p className="text-gray-500 font-medium">
                  {t("previewNotAvailable") || "Önizleme mevcut değil"}
                </p>
                <p className="text-xs text-gray-400">
                  {t("downloadToView") || "Görüntülemek için dosyayı indirin"}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownload}
                  className="mt-2"
                >
                  <Download className="h-4 w-4 mr-1" />
                  {t("download")}
                </Button>
              </div>
            </div>
          )}
          
          {/* Iframe - sadece document varsa ve hata yoksa göster */}
          {isAvailable && !pdfError && fileUrl && (
            <iframe
              src={fileUrl}
              className="w-full h-full border-0"
              title={title}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              style={{ 
                opacity: isLoading ? 0 : 1,
                transition: 'opacity 0.3s ease-in-out'
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default DocumentPreview