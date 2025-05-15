"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import axios from "axios"
import { motion } from "framer-motion"
import CompanyTestimonialCard from "./CompanyCard"
import { fetchCompanyRequests } from "../../../api/DICApi/getCompanyRequests"
import Loading from "../../LoadingComponent/Loading"
import { useMatches } from 'react-router-dom';

const CompanyTestimonialCards = () => {
  const matches = useMatches();
  const { t } = useTranslation();
  const currentMatch = matches[matches.length - 1];
  const titleKey = currentMatch?.handle?.titleKey;

  React.useEffect(() => {
    const baseTitle = 'AIS';
    document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle;
  }, [titleKey, t]);


  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCard, setActiveCard] = useState(null)

  useEffect(() => {
    const getCompanyRequests = async () => {
      try {
        const data = await fetchCompanyRequests()
        setCompanies(data)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch company requests")
        setLoading(false)
      }
    }

    getCompanyRequests()
  }, [])

  const updateCompanyRequest = async (companyId, isApproved) => {
    try {
      const response = await axios.put(
        `http://localhost/admin/company/${companyId}`,
        {
          isApproved: isApproved,
        },
        {
          withCredentials: true,
        },
      )

      if (response.data.message) {
        alert(response.data.message)
        setCompanies(companies.filter((company) => company.id !== companyId))
        setActiveCard(null)
      } else {
        alert("Action failed: " + (response.data.errors || "Unknown error"))
      }
    } catch (error) {
      console.error("Error processing the request:", error)
      alert("An error occurred. Please try again later.")
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">{t("pendingCompanyRequest")}</h1>
      {companies.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {companies.map((company) => (
            <CompanyTestimonialCard
              key={company.id}
              company={company}
              isActive={activeCard === company.id}
              onHover={setActiveCard}
              onApprove={() => updateCompanyRequest(company.id, true)}
              onReject={() => updateCompanyRequest(company.id, false)}
            />
          ))}
        </motion.div>
      ) : (
        <p className="text-center text-gray-600 text-lg">{t("noPendingCompany")}</p>
      )}
    </div>
  )
}

export default CompanyTestimonialCards