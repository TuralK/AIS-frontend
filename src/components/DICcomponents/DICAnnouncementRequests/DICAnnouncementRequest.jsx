import React, { useEffect, useState } from 'react';
import './DICAnnouncementRequests.css'; // CSS modülünü içe aktar
import Loading from '../../LoadingComponent/Loading';
import { fetchAnnouncementRequests } from '../../../api/DICApi/getAnnouncementRequests';
import AnnouncementCard from './AnnouncementCard.jsx';
import { useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AnnouncementRequest = () => {
  const matches = useMatches();
  const { t } = useTranslation();
  const currentMatch = matches[matches.length - 1];
  const titleKey = currentMatch?.handle?.titleKey;

  React.useEffect(() => {
    const baseTitle = 'IMS';
    document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle;
  }, [titleKey, t]);

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchAnnouncementRequest = async () => {
        try {
          const response = await fetchAnnouncementRequests();
          setAnnouncements(response);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAnnouncementRequest();
  }, []);
  
  if (loading) {
    return <Loading />;
  }
  
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
      <div className="announcement-container">
          <h1>{t('announcementHeader')}</h1>
          {announcements.length > 0 ? (
              <div className="announcement-grid">
                  {announcements.map((announcement) => (
                      <AnnouncementCard key={announcement.id} announcement={announcement} />
                  ))}
              </div>
          ) : (
              <h2 className="no-announcements">{t('announcementErrorDIC')}</h2>
          )}
      </div>
  );
};

export default AnnouncementRequest;
