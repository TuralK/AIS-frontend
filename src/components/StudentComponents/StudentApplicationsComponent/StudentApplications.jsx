import React, { useState, useEffect } from 'react';
import StudentApplicationsCSS from './StudentApplications.module.css';
import { fetchApplicationsStatuses } from '../../../api/StudentApi/fetchApplicationsStatuses.js';
import Loading from '../../LoadingComponent/Loading.jsx';
import StatusOverview from './StatusOverviewComponent/StatusOverview.jsx';
import FilterOptions from './FilterOptionsComponent/FilteredStatuses.jsx';
import { useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const StudentApplications = () => {
  const matches = useMatches();
  const { t } = useTranslation();
  const currentMatch = matches[matches.length - 1];
  const titleKey = currentMatch?.handle?.titleKey;

  React.useEffect(() => {
    const baseTitle = 'IMS';
    document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle;
  }, [titleKey, t]);

  const [applicationsStatuses, setApplicationsStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicationsStatuses()
      .then(applicationsStatusesData => {
        
        if (Array.isArray(applicationsStatusesData)) {
          setApplicationsStatuses(applicationsStatusesData);
        } 
        
        else if (applicationsStatusesData && typeof applicationsStatusesData === 'object') {
          const applications = applicationsStatusesData.applications || [];
          const manualApplications = applicationsStatusesData.manualApplications || [];
          
          const processedManualApplications = manualApplications.map(app => ({
            ...app,
            type: 'manual'
          }));
          
          const processedApplications = applications.map(app => ({
            ...app,
            type: 'normal'
          }));
          
          const combinedApplications = [...processedApplications, ...processedManualApplications];
          setApplicationsStatuses(combinedApplications);
        }
        
        else {
          setApplicationsStatuses([]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={StudentApplicationsCSS.statusContainer}>
      <StatusOverview/>
      <FilterOptions applicationsStatuses={applicationsStatuses}/>
    </div>
  );
};

export default StudentApplications;