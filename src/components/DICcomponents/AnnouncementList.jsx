import React from 'react';
import styles from './AnnouncementList.module.css';
import { useTranslation } from 'react-i18next';

const AnnouncementList = ({ announcements = [] }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.announcementList}>
      <h3 className={styles.titleAnnouncementList}>{t('announcements')}</h3>
      {announcements.map((announcement) => (
        <div key={announcement.id} className={styles.announcement}>
          <p>{announcement.content}</p>
          <div className={styles.actions}>
            <button className={styles.updateButton}>{t('update')}</button>
            <button className={styles.deleteButton}>{t('delete')}</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnnouncementList;