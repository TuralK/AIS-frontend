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
    const baseTitle = 'AIS';
    document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle;
  }, [titleKey, t]);

  const [applicationsStatuses, setApplicationsStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicationsStatuses()
      .then(applicationsStatusesData => {
        setApplicationsStatuses(applicationsStatusesData);
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
