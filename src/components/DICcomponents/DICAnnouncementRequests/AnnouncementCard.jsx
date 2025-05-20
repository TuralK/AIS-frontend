import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AnnouncementCard.module.css'; // Custom CSS module
import { useTranslation } from 'react-i18next';
import office from '../../../assets/office.jpg';

const baseUrl = 'http://localhost:3005';

const AnnouncementCard = ({ announcement }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = () => {
    navigate(`/admin/announcement/${announcement.id}`);
  };

  const imageSrc = announcement.image ? `${baseUrl}/${announcement.image}` : office;

  return (
    <div className={styles.cardContainer} onClick={handleClick}>
      <div className={styles.imageContainer}>
        <img
          src={imageSrc}
          alt={announcement.announcementName}
          className={styles.image}
        />
      </div>
      <div className={styles.contentContainer}>
        <h2 className={styles.companyName}>{announcement.Company.name}</h2>
        <h3 className={styles.announcementName}>{announcement.announcementName}</h3>
        <p className={styles.dates}>
          <strong>{t('startDate')}:</strong> {new Date(announcement.startDate).toLocaleDateString('tr-TR')}
        </p>
        <p className={styles.dates}>
          <strong>{t('endDate')}:</strong> {new Date(announcement.endDate).toLocaleDateString('tr-TR')}
        </p>
      </div>
    </div>
  );
};

export default AnnouncementCard;
