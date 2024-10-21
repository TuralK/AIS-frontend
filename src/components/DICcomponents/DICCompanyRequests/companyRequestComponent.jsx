import React, { useState, useEffect } from 'react';
import { fetchCompanyRequests } from '../../../api/DICApi/getCompanyRequests';
import Loading from '../../LoadingComponent/Loading';
import { useTranslation } from 'react-i18next';
import axios from "axios";
import './CompanyTestimonialCard.css';

const CompanyTestimonialCard = ({ company, onApprove, onReject }) => {
  const { t } = useTranslation();

  return (
    <div className="company-card">
      <div className="card-content">
        <img
          src="/placeholder.svg?height=100&width=100"
          alt={company.name}
          className="company-image"
        />
        <h2 className="company-name">{company.name}</h2>
        <p className="company-details">
          <strong>{t('representativeName')}:</strong> {company.username} 
        </p>
        <p className="company-details">
          <strong>{t('email')}:</strong> {company.email}
        </p>
        
        <p className="company-address"> <strong>{t('address')}: </strong>{company.address}</p>
        <div className="button-container">
          <button
            onClick={() => onApprove(company.id)}
            className="approve-button"
          >
            {t('approve')}
          </button>
          <button
            onClick={() => onReject(company.id)}
            className="reject-button"
          >
            {t('reject')}
          </button>
        </div>
      </div>
    </div>
  );
};

const CompanyTestimonialCards = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const getCompanyRequests = async () => {
      try {
        const data = await fetchCompanyRequests();
        setCompanies(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch company requests');
        setLoading(false);
      }
    };

    getCompanyRequests();
  }, []);

  const updateCompanyRequest = async (companyId, isApproved) => {
    try {
      const response = await axios.put(`http://localhost/admin/company/${companyId}`, {
        isApproved: isApproved,
      }, {
        withCredentials: true
      });
  
      if (response.data.message) {
        alert(response.data.message);
        setCompanies(companies.filter((company) => company.id !== companyId));
      } else {
        alert("Action failed: " + (response.data.errors || "Unknown error"));
      }
    } catch (error) {
      console.error("Error processing the request:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="container">
      <h1 className="title">{t('pendingCompanyRequest')}</h1>
      {companies.length > 0 ? (
        <div className="card-grid">
          {companies.map(company => (
            <CompanyTestimonialCard
              key={company.id}
              company={company}
              onApprove={() => updateCompanyRequest(company.id, true)}
              onReject={() => updateCompanyRequest(company.id, false)}
            />
          ))}
        </div>
      ) : (
        <p className="no-requests">{t('noPendingCompany')}</p>
      )}
    </div>
  );
};

export default CompanyTestimonialCards;