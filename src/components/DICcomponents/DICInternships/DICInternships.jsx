"use client"

import React, { useEffect, useState } from "react"
import fetchInternships from "../../../api/DICApi/internshipsApi.js"
import Loading from "../../LoadingComponent/Loading"
import { useMatches } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { User, Building, CheckCircle, XCircle, Clock, FileText } from "lucide-react"

const DICInternships = () => {
  const matches = useMatches()
  const { t } = useTranslation()
  const currentMatch = matches[matches.length - 1]
  const titleKey = currentMatch?.handle?.titleKey

  React.useEffect(() => {
    const baseTitle = "IMS"
    document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle
  }, [titleKey, t])

  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadInternships = async () => {
      setLoading(true)
      try {
        const data = await fetchInternships()
        console.log("Fetched internships:", data)
        if (data && Array.isArray(data)) {
          setInternships(data)
        } else {
          setInternships([])
        }
      } catch (error) {
        console.error("Error fetching internships:", error)
        setInternships([])
      } finally {
        setLoading(false)
      }
    }

    loadInternships()
  }, [])

  const getStatusBadge = (status, isApprovedByCompany, isApprovedByDIC) => {
    if (isApprovedByDIC === true) {
      return { text: t("approved"), color: "bg-green-500", icon: CheckCircle }
    } else if (isApprovedByDIC === false) {
      return { text: t("rejected"), color: "bg-red-500", icon: XCircle }
    } else if (isApprovedByCompany === true) {
      return { text: t("companyApproved"), color: "bg-blue-500", icon: Clock }
    } else if (isApprovedByCompany === false) {
      return { text: t("companyRejected"), color: "bg-orange-500", icon: XCircle }
    } else {
      return { text: t("pending"), color: "bg-gray-500", icon: Clock }
    }
  }

  const getApplicationType = (item) => {
    return item.manualApplicationId ? "manual" : "regular"
  }

  const getCompanyName = (item) => {
    if (item.Application?.Announcement?.Company?.name) {
      return item.Application.Announcement.Company.name
    }
    return t("manualApplication")
  }

  const handleItemClick = (item) => {
    const isManual = item.manualApplicationId ? true : false
    // Pass the manual flag as a query parameter
    navigate(`/admin/internship/${item.id}?manual=${isManual}`)
  }

  if (loading) return <Loading />

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">{t("internshipTitle")}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {internships.length > 0 ? (
          internships.map((item) => {
            const statusBadge = getStatusBadge(item.status, item.isApprovedByCompany, item.isApprovedByDIC)
            const applicationType = getApplicationType(item)
            const StatusIcon = statusBadge.icon

            return (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer overflow-hidden"
                onClick={() => handleItemClick(item)}
              >
                <div className="p-6">
                  {/* Header with Student Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {item.Student?.username || t("unknownStudent")}
                        </h3>
                        <p className="text-sm text-gray-500"> {t("id")} {item.Student?.id || item.studentId}</p>
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${applicationType === "manual" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}
                    >
                      {applicationType === "manual" ? t("manual") : t("regular")}
                    </div>
                  </div>

                  {/* Student Details */}
                  <div className="space-y-2 mb-4">
                    {item.Student?.email && <p className="text-sm text-gray-600 truncate">📧 {item.Student.email}</p>}
                    {item.Student?.year && (
                      <p className="text-sm text-gray-600">
                        🎓 {t("year")}: {item.Student.year}
                      </p>
                    )}
                  </div>

                  {/* Company Info */}
                  <div className="flex items-center space-x-2 mb-4">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700 truncate">{getCompanyName(item)}</span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex items-center space-x-2 px-3 py-1 rounded-full text-white text-xs font-medium ${statusBadge.color}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      <span>{statusBadge.text}</span>
                    </div>

                    {/* Feedback Indicators */}
                    <div className="flex space-x-1">
                      {item.feedbackToStudent && (
                        <div className="w-2 h-2 bg-blue-400 rounded-full" title={t("studentFeedbackExists")}></div>
                      )}
                      {item.feedbackToCompany && (
                        <div className="w-2 h-2 bg-green-400 rounded-full" title={t("companyFeedbackExists")}></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hover Effect Indicator */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <span>{t("moreDetails")}</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-500 mb-2">{t("noInternships")}</h2>
            <p className="text-gray-400">{t("noInternshipsDescription")}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DICInternships