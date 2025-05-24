import React from 'react';
import StatusContainerCSS from './StatusContainer.module.css';
import DefaultCompanyIcon from "../../../../assets/default_profile_icon.png";
import { Link } from 'react-router-dom';
import { Link2, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const baseUrl = 'http://localhost:3005';

const StatusContainer = ({ applicationsStatuses }) => {
  const { t } = useTranslation();
  const headerNames = [t('company'), t('announcement_name'), t('status'), t('applied_date'), t('last_update_date'), t('details')];
  const statusNames = [t('company_evaluation'), t('coordinator_evaluation'), t('ssi_procedures'), t('internship_process'), t('rejected')];

  const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-GB').replace(/\//g, '.') : '';
  const getStatusClassName = (status) => {
    return [StatusContainerCSS.evaluation, StatusContainerCSS.accepted, StatusContainerCSS.rejected][status >= 3 ? status - 2 : 0];
  };

  // Manual application olup olmadığını kontrol et
  const isManualApplication = (application) => {
    return application.type === 'manual' || !application.Announcement;
  };

  // Company bilgilerini güvenli bir şekilde al
  const getCompanyInfo = (application) => {
    if (isManualApplication(application)) {
      return {
        name: application.companyName || 'Unknown Company',
        logo: null,
        id: null
      };
    }
    
    const company = application.Announcement?.Company;
    return {
      name: company?.CompanyProfile?.companyName || company?.name || 'Unknown Company',
      logo: company?.CompanyProfile?.companyLogo ? `${baseUrl}/${company.CompanyProfile.companyLogo}` : null,
      id: company?.id || null
    };
  };

  
  const getAnnouncementName = (application) => {
    if (isManualApplication(application)) {
      return application.companyName ? `${application.companyName} - ${t("manualApplication")}` : `${t("manualApplication")}`;
    }
    return application.Announcement?.announcementName || `${t("unknownAnnouncement")}`;
  };

  
  const getAnnouncementId = (application) => {
    return application.announcementId || application.Announcement?.id || null;
  };

  return (
    <div className={StatusContainerCSS.container}>
      {/* Desktop Table Header */}
      <div className={StatusContainerCSS.statusKeyContainer}>
        {headerNames.map((text, index) => (
          <div key={index} className={`${StatusContainerCSS.key} ${StatusContainerCSS[['smallBox', 'mediumBox', 'mediumBox', 'smallBox', 'smallBox', 'smallBox'][index]]}`}>
            {text}
          </div>
        ))}
      </div>

      {applicationsStatuses.map((applicationStatus, index) => {
        const companyInfo = getCompanyInfo(applicationStatus);
        const announcementName = getAnnouncementName(applicationStatus);
        const announcementId = getAnnouncementId(applicationStatus);
        const isManual = isManualApplication(applicationStatus);

        return (
          <div className={StatusContainerCSS.statusValueContainer} key={index}>
            {/* Company */}
            <div 
              className={`${StatusContainerCSS.value} ${StatusContainerCSS.smallBox}`}
              data-label={t('company')}
            >
              {companyInfo.id && !isManual ? (
                <Link to={`/student/company-profile/${companyInfo.id}`}>
                  <img src={companyInfo.logo || DefaultCompanyIcon} alt="Company Logo" />
                </Link>
              ) : (
                <div className={StatusContainerCSS.manualCompanyIcon}>
                  {companyInfo.logo ? (
                    <img src={companyInfo.logo} alt="Company Logo" />
                  ) : (
                    <div className={StatusContainerCSS.defaultCompanyCircle}>
                      <Building2 size={24} />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Announcement Name */}
            <div 
              className={`${StatusContainerCSS.value} ${StatusContainerCSS.mediumBox}`}
              data-label={t('announcement_name')}
            >
              {announcementName}
            </div>

            {/* Status */}
            <div 
              className={`${StatusContainerCSS.value} ${StatusContainerCSS.mediumBox}`}
              data-label={t('status')}
            >
              <div className={`${StatusContainerCSS.statusDetail} ${getStatusClassName(applicationStatus.status)}`}>
                {statusNames[applicationStatus.status]}
              </div>
            </div>

            {/* Applied Date */}
            <div 
              className={`${StatusContainerCSS.value} ${StatusContainerCSS.smallBox} ${StatusContainerCSS.date}`}
              data-label={t('applied_date')}
            >
              {formatDate(applicationStatus.applyDate)}
            </div>

            {/* Last Update Date */}
            <div 
              className={`${StatusContainerCSS.value} ${StatusContainerCSS.smallBox} ${StatusContainerCSS.date}`}
              data-label={t('last_update_date')}
            >
              {formatDate(applicationStatus.statusUpdateDate)}
            </div>

            {/* Details */}
            <div 
              className={`${StatusContainerCSS.value} ${StatusContainerCSS.smallBox}`}
              data-label={t('details')}
            >
              {announcementId && !isManual ? (
                <Link 
                  to={`/student/announcements/${announcementId}`} 
                  title={announcementName} 
                  className={StatusContainerCSS.action}
                >
                  <Link2 size={20}/>
                </Link>
              ) : (
                <></>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusContainer;