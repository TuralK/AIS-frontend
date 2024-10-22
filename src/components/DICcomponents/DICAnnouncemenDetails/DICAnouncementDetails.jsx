import React, { useState, useEffect } from 'react'; // useEffect'i ekledim
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // useParams eklendi
import './DICAnouncementDetails.css';
import { useTranslation } from 'react-i18next';
import Loading from '../../LoadingComponent/Loading';

const DICAnouncementDetails = () => {
  const [announcement, setAnnouncement] = useState(null); // Duyuru verisini tutmak için state
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState(null); // Hata durumunu izlemek için state
  const [loading, setLoading] = useState(true); // Yükleniyor durumunu izlemek için state
  const navigate = useNavigate();
  const { t } = useTranslation(); // `t` is here
  const { id } = useParams(); 
  

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        // Backend'den duyuru verisini çeken fonksiyon
        const response = await axios.get(`http://localhost:3003/announcement/${id}`, {
            withCredentials: true,
        });
        console.log(response);
        setAnnouncement(response.data.announcement); // Duyuru verisini state'e kaydediyoruz
      } catch (err) {
        setError(err.message); // Hata durumunu kaydet
      } finally {
        setLoading(false); // Yükleme durumunu kapat
      }
    };

    fetchAnnouncement();
  }, [id]); // `id` değiştiğinde yeniden veri çek

  const updateAnnouncement = async (isApproved) => {
    try {
      await axios.put(`http://localhost:3003/announcement/${id}`, {
        isApproved,
        feedback
      }, {
        withCredentials: true,
      });
      navigate('/admin/announcementRequests'); // Onaylandıktan veya reddedildikten sonra yönlendirme
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
