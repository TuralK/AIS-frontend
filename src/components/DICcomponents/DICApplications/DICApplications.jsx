import React, { useEffect, useState } from 'react';
import fetchApplicationRequests from '../../../api/DICApi/applicationsApi.js';
import Loading from '../../LoadingComponent/Loading';
import styles from './DICApplications.module.css'; // Ensure this is the correct path

const ApplicationRequestsComponent = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplications = async () => {
      setLoading(true);
      const data = await fetchApplicationRequests();
      console.log(data.applications);
      if (data) {
        setApplications(data.applications);
      }
      setLoading(false);
    };

    loadApplications();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className={styles.container}> {/* Added class from CSS module */}
      {applications.length > 0 ? (
        applications.map((application) => (
          <div key={application.id} className={styles.applicationItem}> {/* Added class from CSS module */}
            <h3 className={styles.username}>{application.Student.username}</h3> {/* Added class from CSS module */}
            <p>ID: {application.Student.id}</p>
            <p>Company: {application.Announcement.Company.name}</p>
          </div>
        ))
      ) : (
        <div>No application requests found.</div>
      )}
    </div>
  );
};

export default ApplicationRequestsComponent;
