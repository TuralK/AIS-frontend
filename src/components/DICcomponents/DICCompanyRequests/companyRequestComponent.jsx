import React, { useState, useEffect } from 'react';
import { fetchCompanyRequests } from '../../../api/DICApi/getCompanyRequests';
import Loading from '../../LoadingComponent/Loading';
import { useTranslation } from 'react-i18next';
import styles from './companyRequestCss.module.css';
import axios from "axios";

const CompanyCard = ({ company, onApprove, onReject, t }) => (
    <div className={styles.card}>
        <div className={styles.cardContent}>
            <h2 className={styles.cardTitle}>{company.name}</h2>
            <div className={styles.cardRow}>
                <p className={styles.cardText}><strong>{t('representativeName')}:</strong> {company.username}</p>
                <p className={styles.cardText}><strong>{t('email')}:</strong> {company.email}</p>
                <p className={styles.cardText}><strong>{t('address')}:</strong> {company.address}</p>
            </div>
            <div className={styles.cardActions}>
                <button 
                onClick={() => onApprove(company.id)}
                className={`${styles.button} ${styles.approveButton}`}
                >
                {t('approve')}
                </button>
                <button 
                onClick={() => onReject(company.id)}
                className={`${styles.button} ${styles.rejectButton}`}
                >
                {t('reject')}
                </button>
            </div>
            <div className={styles.cardRow}>
            </div>
        </div>
    </div>
  );
  
  const CompanyCards = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t, i18n } = useTranslation(); // `t` is here
  
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
      return (<Loading />);
    }
  
    if (error) {
      return <div className={styles.error}>{error}</div>;
    }
  
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>{t('pendingCompanyRequest')}</h1>
        {companies.length > 0 ? (
          <div className={styles.cardGrid}>
            {companies.map(company => (
              <CompanyCard
                key={company.id}
                company={company}
                onApprove={() => updateCompanyRequest(company.id, true)}
                onReject={() => updateCompanyRequest(company.id, false)}
                t={t} // Pass the `t` function as a prop to `CompanyCard`
              />
            ))}
          </div>
        ) : (
          <p className={styles.noRequests}>{t('noPendingCompany')}</p>
        )}
      </div>
    );
  };
  
  export default CompanyCards;
  