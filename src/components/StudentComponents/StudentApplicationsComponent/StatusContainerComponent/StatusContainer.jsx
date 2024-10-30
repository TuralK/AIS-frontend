import React from 'react';
import StatusContainerCSS from './StatusContainer.module.css';
import BaykarLogo from "../../../../assets/baykar_logo.png";
import { Link } from 'react-router-dom';
import { Link2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const StatusContainer = ({ applicationsStatuses }) => {
  const { t, i18n } = useTranslation();
  const headerNames = [t('company'), t('announcement_name'), t('status'), t('applied_date'), t('last_update_date'), t('details')];
  const statusNames = [t('company_evaluation'), t('coordinator_evaluation'), t('ssi_procedures'), t('internship_process'), t('rejected')];
  const classNames = [
    StatusContainerCSS.smallBox,
    StatusContainerCSS.mediumBox,
    StatusContainerCSS.mediumBox,
    StatusContainerCSS.smallBox,
    StatusContainerCSS.smallBox,
    StatusContainerCSS.smallBox
  ];

  const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-GB').replace(/\//g, '.') : '';
  const getStatusClassName = (status) => {
    return [StatusContainerCSS.evaluation, StatusContainerCSS.accepted, StatusContainerCSS.rejected][status >= 3 ? status - 2 : 0];
  };

  return (
    <div className={StatusContainerCSS.container}>
      <div className={StatusContainerCSS.statusKeyContainer}>
        {headerNames.map((text, index) => (
          <div key={index} className={`${StatusContainerCSS.key} ${classNames[index]}`}>
            {text}
          </div>
        ))}
      </div>
      {applicationsStatuses.map((applicationStatus, index) => (
        <div className={StatusContainerCSS.statusValueContainer} key={index}>
          <div className={`${StatusContainerCSS.value} ${StatusContainerCSS.smallBox}`}>
            <img src={BaykarLogo} alt="Company Logo" />
          </div>
          <div className={`${StatusContainerCSS.value} ${StatusContainerCSS.mediumBox}`}>
            {applicationStatus.Announcement.announcementName}
          </div>
          <div className={`${StatusContainerCSS.value} ${StatusContainerCSS.mediumBox}`}>
            <div className={`${StatusContainerCSS.statusDetail} ${getStatusClassName(applicationStatus.status)}`}>
              {statusNames[applicationStatus.status]}
            </div>
          </div>
          <div className={`${StatusContainerCSS.value} ${StatusContainerCSS.smallBox} ${StatusContainerCSS.date}`}>
            {formatDate(applicationStatus.applyDate)}
          </div>
          <div className={`${StatusContainerCSS.value} ${StatusContainerCSS.smallBox} ${StatusContainerCSS.date}`}>
            {formatDate(applicationStatus.statusUpdateDate)}
          </div>
          <div className={`${StatusContainerCSS.value} ${StatusContainerCSS.smallBox}`}>
            <Link 
              to={`/student/announcements/${applicationStatus.announcementId}`} 
              title={applicationStatus.Announcement.announcementName} 
              className={StatusContainerCSS.action}>
              <Link2/>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusContainer;
