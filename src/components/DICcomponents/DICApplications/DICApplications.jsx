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
    <div className="container mx-auto px-4">
      <div className="py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {applications.length > 0 ? (
            applications.map(application => (
              <div key={application.id} className="col">
                <button 
                  className="w-full text-left" 
                  onClick={() => window.location.href = `/admin/applications/${application.id}`}
                >
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                    <div className="p-4">
                      <h5 className="text-lg font-bold mb-2">{application.Student.username}</h5>
                      <p className="text-sm mb-1">
                        <strong>ID:</strong> {application.Student.id}
                      </p>
                      <p className="text-sm">
                        <strong>Company:</strong> {application.Announcement.Company.name}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            ))
          ) : (
            <h2 className="col-span-full text-2xl font-bold">There are no application requests</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationRequestsComponent;
