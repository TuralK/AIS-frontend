import React from 'react';
import { useNavigate } from 'react-router-dom';
import DICAnouncementDetails from '../DICAnnouncemenDetails/DICAnouncementDetails.jsx';
import styles from './AnnouncementCard.module.css'; // Modül CSS'i içe aktar
import { useTranslation } from 'react-i18next';

const AnnouncementCard = ({ announcement }) => {
  const navigate = useNavigate(); 
  const { t } = useTranslation(); 

  const handleClick = () => {
    <DICAnouncementDetails announcement={announcement} />
    navigate(`/admin/announcement/${announcement.id}`);
  };

  return (
    <div className={styles['announcement-card']} onClick={handleClick}>
      <div className={styles['announcement-image']} style={{ backgroundImage: `url(${announcement.image})` }}></div>
      <div className={styles['announcement-content']}>
        <h2 className={styles['announcement-company']}>{announcement.Company.name}</h2>
        <h3 className={styles['announcement-title']}>{announcement.announcementName}</h3>
        <div className={styles['announcement-date']}>
          <p><strong>{t('endDate')}</strong> {announcement.formattedEndDate}</p>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
