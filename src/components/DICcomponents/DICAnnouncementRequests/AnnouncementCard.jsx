import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AnnouncementCard.module.css'; // Custom CSS module
import { useTranslation } from 'react-i18next';
import office from '../../../assets/office.jpg';

const AnnouncementCard = ({ announcement }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = () => {
    navigate(`/admin/announcement/${announcement.id}`);
  };

  return (
    <div className={styles.cardContainer} onClick={handleClick}>
      <div className={styles.imageContainer}>
        <img
          src={announcement.image || office}
          alt={announcement.announcementName}
          className={styles.image}
        />
      </div>
      <div className={styles.contentContainer}>
        <h2 className={styles.companyName}>{announcement.Company.name}</h2>
        <h3 className={styles.announcementName}>{announcement.announcementName}</h3>
        <p className={styles.dates}>
          <strong>{t('startDate')}:</strong> {announcement.startDate}
        </p>
        <p className={styles.dates}>
          <strong>{t('endDate')}:</strong> {announcement.endDate}
        </p>
      </div>
    </div>
  );
};

export default AnnouncementCard;
