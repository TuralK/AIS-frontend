import React, { useState, useEffect } from 'react';
import StudentApplicationsCSS from './StudentApplications.module.css';
import { fetchApplicationsStatuses } from '../../../api/StudentApi/fetchApplicationsStatuses.js';
import Loading from '../../LoadingComponent/Loading.jsx';
import StatusOverview from './StatusOverviewComponent/StatusOverview.jsx';
import FilterOptions from './FilterOptionsComponent/FilteredStatuses.jsx';

const StudentApplications = () => {
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
