import React, { useState, useEffect } from 'react'; 
import { useNavigate, useParams } from 'react-router-dom'; 
import './DICAnouncementDetails.css';
import { useTranslation } from 'react-i18next';
import Loading from '../../LoadingComponent/Loading';
import { fetchAnnouncementById, updateAnnouncementById } from '../../../api/DICApi/announcementDetailApi.js';

const DICAnouncementDetails = () => {
  const [announcement, setAnnouncement] = useState(null); // Duyuru verisini tutmak için state
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState(null); // Hata durumunu izlemek için state
  const [loading, setLoading] = useState(true); // Yükleniyor durumunu izlemek için state
  const navigate = useNavigate();
  const { t } = useTranslation(); // `t` is here
  const { id } = useParams(); 
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAnnouncementById(id); 
        setAnnouncement(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const updateAnnouncement = async (isApproved) => {
    try {
      await updateAnnouncementById(id, isApproved, feedback); 
      navigate(-1); // Bir önceki sayfaya gitmeyi sağlıyor 
    } catch (error) {
      console.error('Error updating announcement:', error);
    }
  };

  if (loading) return <Loading />; // Yükleniyorsa gösterilecek
  if (error) return <p>{t('errorFetchingData')}: {error}</p>; // Hata varsa gösterilecek
  if (!announcement) return <p>{t('noAnnouncementFound')}</p>; // Duyuru bulunamadıysa

  return (
    <div className="announcement-details">
      <div className="announcement-image">
        <img src={announcement.image} alt={announcement.announcementName} />
      </div>
      <div className="announcement-content">
        <h1>{announcement.Company.name}</h1>
        <h3><strong>{announcement.announcementName}</strong></h3>
        <p>{announcement.description}</p>
        <p>
          {t('startDate')}{announcement.formattedStartDate}
        </p>
        <p>
          {t('endDate')} {announcement.formattedEndDate}
        </p>
      </div>
      <div className="announcement-actions">
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder={t('placeholderAnnounceDetail')}
        />
        <div className="button-group">
          <button className="approve-btn" onClick={() => updateAnnouncement(true)}>
            {t('approve')}
          </button>
          <button className="reject-btn" onClick={() => updateAnnouncement(false)}>
            {t('reject')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DICAnouncementDetails;
