import React, { useEffect, useState } from "react"
import { useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import fetchApplicationRequests from "../../../api/DICApi/applicationsApi.js"
import Loading from "../../LoadingComponent/Loading"
import AnnouncementImage from "../../../assets/office.jpg"

const DICApplications = () => {
  const matches = useMatches();
  const { t } = useTranslation();
  const currentMatch = matches[matches.length - 1];
  const titleKey = currentMatch?.handle?.titleKey;

  React.useEffect(() => {
    const baseTitle = 'AIS';
    document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle;
  }, [titleKey, t]);


  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadApplications = async () => {
      setLoading(true)
      const data = await fetchApplicationRequests()
      if (data) {
        setApplications(data.applications)
      }
      setLoading(false)
    }

    loadApplications()
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear()}`
  }

  if (loading) return <Loading />

  return (
    <div className="container mx-auto px-4">
      <div className="py-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gradient">{t("applicationRequests")}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.length > 0 ? (
            applications.map((application) => (
              <div
                key={application.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative w-full h-48 overflow-hidden group">
                  <img
                    src={application.image || AnnouncementImage}
                    alt={application.Announcement.name}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="absolute top-3 left-3 bg-black/75 text-white px-3 py-1 text-sm rounded">
                    {application.Announcement.announcementName}
                  </span>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h1 className="text-xl font-bold text-gray-800 mb-2">{application.Student.username}</h1>
                    <p className="text-gray-600 font-bold  text-md">
                    {t("id")}: {application.Student.id} 
                    </p>
                    <p className="text-gray-700 font-bold text-md">
                    {t("company")}: {application.Announcement.Company.name} 
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-md font-bold text-gray-700">{t("startDate")} {formatDate(application.Announcement.startDate)}</span>
                    
                    <button
                      onClick={() => navigate(`/admin/application/${application.id}`)}
                      className="inline-flex items-center text-emerald-600 hover:text-emerald-700 hover:underline transition-colors group"
                    >
                      {t("moreDetails")}
                      <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h2 className="col-span-full text-xl font-semibold text-center text-gray-500">{t("noApplication")}</h2>
          )}
        </div>
      </div>
    </div>
  )
}

export default DICApplications