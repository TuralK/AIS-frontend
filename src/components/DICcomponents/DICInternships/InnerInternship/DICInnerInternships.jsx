"use client"

import React, { useEffect, useState } from "react"
import { useParams, useNavigate, useSearchParams, useMatches } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { Button } from "../../../ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "../../../ui/card"
import { Textarea } from "../../../ui/text_area"
import { toast } from "../../../ui/use-toast"
import { Skeleton } from "../../../ui/skeleton"
import { FileText, Building, User, X, AlertCircle, CheckCircle } from "lucide-react"
import { fetchInternshipDetails, downloadDocument, evaluateInternship } from "../../../../api/DICApi/internshipDetailApi"
import DocumentPreview from "./DocumentPreview"

const DICInnerInternships = () => {
  const matches = useMatches()
  const { t } = useTranslation()
  const currentMatch = matches[matches.length - 1]
  const titleKey = currentMatch?.handle?.titleKey
  const [searchParams] = useSearchParams()

  React.useEffect(() => {
    const baseTitle = "IMS"
    document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle
  }, [titleKey, t])

  const { id } = useParams()
  const [application, setApplication] = useState(null)
  const [linkRequests, setLinkRequests] = useState(null)
  const [studentFeedbackVisible, setStudentFeedbackVisible] = useState(false)
  const [companyFeedbackVisible, setCompanyFeedbackVisible] = useState(false)
  const [studentFeedback, setStudentFeedback] = useState("")
  const [companyFeedback, setCompanyFeedback] = useState("")
  const [documents, setDocuments] = useState([])
  const [applicationId, setApplicationId] = useState()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [latestStudentFeedbacks, setLatestStudentFeedbacks] = useState([])
  const [latestCompanyFeedbacks, setLatestCompanyFeedbacks] = useState([])

  const isManualApplication = searchParams.get("manual") === "true"

  // Get document data from the documents array
  const getDocumentById = (fileType) => {
    if (!documents || documents.length === 0) return { isAvailable: false, id: null }
    const document = documents.find(doc => doc.fileType === fileType)
    return {
      isAvailable: !!document,
      id: document?.id || null
    }
  }

  const studentReportData = getDocumentById('Report')
  const evaluationFormData = getDocumentById('Survey')  
  const companyFormData = getDocumentById('CompanyForm')

  // Helper: get latest feedback by cycleId
  const getLatestFeedback = (feedbackArray) => {
    if (!feedbackArray || feedbackArray.length === 0) return null
    return feedbackArray.reduce((latest, current) =>
      current.cycleId > latest.cycleId ? current : latest
    , feedbackArray[0])
  }

  const latestStudentFeedback = getLatestFeedback(latestStudentFeedbacks)
  const latestCompanyFeedback = getLatestFeedback(latestCompanyFeedbacks)

  useEffect(() => {
    const loadApplicationDetails = async () => {
      try {
        setIsLoading(true)
        const res = await fetchInternshipDetails(id)
        console.log("Fetched application details:", res)
        
        setDocuments(res.documents)

        let applicationData = null
        if (res.internship.application) {
          applicationData = res.internship.application
          setApplicationId(res.internship.applicationId)
        } else {
          applicationData = res.internship
          setApplicationId(applicationData.manualApplicationId)
        }

        setApplication(applicationData)

        if (res.latestStudentFeedbacks) {
          setLatestStudentFeedbacks(res.latestStudentFeedbacks)
        }
        if (res.latestCompanyFeedbacks) {
          setLatestCompanyFeedbacks(res.latestCompanyFeedbacks)
        }
      } catch (error) {
        console.error("Error in loadApplicationDetails:", error)
        toast({
          title: t("error"),
          description: t("failedToFetchDetails"),
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadApplicationDetails()
  }, [id, isManualApplication])

  const toggleStudentFeedback = () => {
    setStudentFeedbackVisible(!studentFeedbackVisible)
  }

  const toggleCompanyFeedback = () => {
    setCompanyFeedbackVisible(!companyFeedbackVisible)
  }

  const handleStudentFeedbackSubmit = async () => {
    setIsSubmitting(true)
    try {
      await evaluateInternship(id, {
        status: "FeedbackToStudent",
        feedbackToStudent: studentFeedback,
        feedbackContextStudent: "Survey",
        feedbackToCompany: null,
        feedbackContextCompany: null,
      })
      toast({ title: t("success"), description: t("studentFeedbackSent") })
      setStudentFeedbackVisible(false)
      setStudentFeedback("")
    } catch (error) {
      toast({ title: t("error"), description: t("failedToSendFeedback"), variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCompanyFeedbackSubmit = async () => {
    setIsSubmitting(true)
    try {
      await evaluateInternship(id, {
        status: "FeedbackToCompany",
        feedbackToStudent: null,
        feedbackContextStudent: null,
        feedbackToCompany: companyFeedback,
        feedbackContextCompany: "CompanyForm",
      })
      toast({ title: t("success"), description: t("companyFeedbackSent") })
      setCompanyFeedbackVisible(false)
      setCompanyFeedback("")
    } catch (error) {
      toast({ title: t("error"), description: t("failedToSendFeedback"), variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleApprove = async () => {
    setIsSubmitting(true)
    try {
      await evaluateInternship(id, {
        status: "Approved",
        feedbackToStudent: null,
        feedbackContextStudent: null,
        feedbackToCompany: null,
        feedbackContextCompany: null,
      })
      toast({ title: t("success"), description: t("internshipApprovedMessage") })
      navigate("/admin/internships")
    } catch (error) {
      toast({ title: t("error"), description: t("failedToApprove"), variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    setIsSubmitting(true)
    try {
      await evaluateInternship(id, {
        status: "Rejected",
        feedbackToStudent: null,
        feedbackContextStudent: null,
        feedbackToCompany: null,
        feedbackContextCompany: null,
      })
      toast({ title: t("success"), description: t("internshipRejectedMessage") })
      navigate("/admin/internships")
    } catch (error) {
      toast({ title: t("error"), description: t("failedToReject"), variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDocumentDownload = async (documentType) => {
    try {
      let documentData = null
      let fileName = null
      switch (documentType) {
        case 'studentReport':
          fileName = 'Report'
          documentData = studentReportData
          break
        case 'evaluationForm':
          fileName = 'Survey'
          documentData = evaluationFormData
          break
        case 'companyForm':
          fileName = 'CompanyForm'
          documentData = companyFormData
          break
        default:
          documentData = { isAvailable: false }
      }

      if (!documentData.isAvailable || !documentData.id) {
        toast({
          title: t("error"),
          description: t("documentNotAvailable"),
          variant: "destructive",
        })
        return
      }

      const applicationype = isManualApplication ? "Manual" : "Application"
      console.log(`ID: ${applicationId}, Type: ${applicationype}, FileName: ${fileName}`)
      await downloadDocument(applicationId, applicationype, fileName)
      
      toast({
        title: t("success"),
        description: t("documentDownloaded"),
      })
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: t("error"),
        description: t("downloadFailed"),
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border max-w-7xl mx-auto">
        <div className="p-6">
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-6" />
          <div className="grid lg:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="bg-white rounded-lg shadow-sm border max-w-7xl mx-auto p-8">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">{t("applicationNotFound")}</h2>
          <p className="text-gray-500">{t("applicationNotFoundDescription")}</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            {t("goBack")}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="bg-white rounded-lg shadow-lg border max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 p-6 flex justify-center items-center rounded-t-lg border-b-2 border-gray-200">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-600" />
            {t("internshipOverview")}
            {isManualApplication && (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm ml-3 font-medium">
                {t("manual")}
              </span>
            )}
          </h3>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 p-6">
          {/* Student Section */}
          <Card className="border-2 border-blue-100 shadow-lg">
            <CardHeader className="bg-blue-50 border-b-2 border-blue-100">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex flex-col items-center">
                  {application.Student?.logoUrl ? (
                    <div className="w-20 h-20 rounded-lg border-2 border-blue-200 flex items-center justify-center bg-white shadow-sm">
                      <img
                        src={application.Student.logoUrl}
                        alt="Student Logo"
                        className="max-w-full max-h-full p-2"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 border-2 border-blue-200 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
                      <span className="text-blue-800 font-bold text-xl">
                        {application.Student?.username?.charAt(0) || "S"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-blue-800 mb-2">
                    <User className="h-5 w-5" />
                    {application.Student?.username || t("unknownStudent")}
                  </h2>
                  <p className="text-sm text-gray-600 mb-1">{application.Student?.email || t("notAvailable")}</p>
                  <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block">
                    {t("id")}: {application.Student?.id || application.studentId}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Documents Stack */}
              <div className="space-y-4 mb-6">
                <DocumentPreview
                  title={t("studentReport")}
                  documentType="studentReport"
                  documentId={studentReportData.id}
                  onDownload={handleDocumentDownload}
                  isAvailable={studentReportData.isAvailable}
                />
                <DocumentPreview
                  title={t("evaluationForm")}
                  documentType="evaluationForm"
                  documentId={evaluationFormData.id}
                  onDownload={handleDocumentDownload}
                  isAvailable={evaluationFormData.isAvailable}
                />
              </div>

              {studentFeedbackVisible && (
                <div className="mt-6 space-y-3">
                  {/* Display Latest Student Feedback if available */}
                  {latestStudentFeedback && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-bold text-blue-800">
                          {t("previousFeedback")} (Cycle ID: {latestStudentFeedback.cycleId})
                        </h5>
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          {new Date(latestStudentFeedback.createdAt || latestStudentFeedback.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-blue-700 bg-blue-100 p-3 rounded border italic">
                        "{latestStudentFeedback.feedback || latestStudentFeedback.message || latestStudentFeedback.content}"
                      </p>
                    </div>
                  )}
                  
                  {/* New Feedback Input */}
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <label className="text-sm font-medium text-red-800 block mb-2">{t("newRejectionFeedback")}</label>
                    <Textarea
                      placeholder={t("enterStudentFeedback")}
                      className="min-h-[100px] border-red-300 focus:border-red-500"
                      value={studentFeedback}
                      onChange={(e) => setStudentFeedback(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-end p-6 pt-4 bg-gray-50 border-t mt-4">
              {!studentFeedbackVisible ? (
                <Button
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 font-medium"
                  onClick={toggleStudentFeedback}
                >
                  <X className="h-4 w-4 mr-2" /> {t("reject")}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    onClick={toggleStudentFeedback}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleStudentFeedbackSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t("processing") : t("sendFeedback")}
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>

          {/* Company Section */}
          <Card className="border-2 border-green-100 shadow-lg">
            <CardHeader className="bg-green-50 border-b-2 border-green-100">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-green-800 mb-2">
                    <Building className="h-5 w-5" />
                    {isManualApplication || !application.Application
                      ? t("manualApplication")
                      : application.Application?.Announcement?.Company?.name || t("unknownCompany")}
                  </h2>
                  {!isManualApplication && application.Application?.Announcement && (
                    <p className="text-sm text-gray-600 mb-2">
                      {application.Application.Announcement.description || t("noDescription")}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Company Form */}
              <div className="mb-6 mt-4">
                <DocumentPreview
                  title={t("companyForm")}
                  documentType="companyForm"
                  documentId={companyFormData.id}
                  onDownload={handleDocumentDownload}
                  isAvailable={companyFormData.isAvailable}
                />
              </div>

              {companyFeedbackVisible && (
                <div className="mt-6 space-y-3">
                  {/* Display Latest Company Feedback if available */}
                  {latestCompanyFeedback && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-bold text-green-800">
                          {t("previousFeedback")} (Cycle ID: {latestCompanyFeedback.cycleId})
                        </h5>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                          {new Date(latestCompanyFeedback.createdAt || latestCompanyFeedback.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-green-700 bg-green-100 p-3 rounded border italic">
                        "{latestCompanyFeedback.feedback || latestCompanyFeedback.message || latestCompanyFeedback.content}"
                      </p>
                    </div>
                  )}
                  
                  {/* New Feedback Input */}
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <label className="text-sm font-medium text-red-800 block mb-2">{t("newRejectionFeedback")}</label>
                    <Textarea
                      placeholder={t("enterCompanyFeedback")}
                      className="min-h-[100px] border-red-300 focus:border-red-500"
                      value={companyFeedback}
                      onChange={(e) => setCompanyFeedback(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-end p-6 pt-4 bg-gray-50 border-t mt-4">
              {!companyFeedbackVisible ? (
                <Button
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 font-medium"
                  onClick={toggleCompanyFeedback}
                >
                  <X className="h-4 w-4 mr-2" /> {t("reject")}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    onClick={toggleCompanyFeedback}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleCompanyFeedbackSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t("processing") : t("sendFeedback")}
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-200 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-lg">
          <div className="flex flex-col sm:flex-row justify-end items-center gap-4">
            <Button
              onClick={handleReject}
              disabled={isSubmitting}
              className="sm:mr-4 w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <X className="h-5 w-5 mr-2" />
              )}
              {isSubmitting ? t("processing") : t("reject")}
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white font-bold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <CheckCircle className="h-5 w-5 mr-2" />
              )}
              {isSubmitting ? t("processing") : t("approve")}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default DICInnerInternships