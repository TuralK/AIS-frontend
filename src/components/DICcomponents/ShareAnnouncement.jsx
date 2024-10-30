import React, { useState } from 'react';
import styles from './ShareAnnouncement.module.css';
import { useTranslation } from 'react-i18next';

const ShareAnnouncement = () => {
  const { t } = useTranslation();
  const [announcement, setAnnouncement] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement announcement submission logic
    console.log('Announcement submitted:', announcement);
    setAnnouncement('');
  };

  return (
    <div className={styles.shareAnnouncement}>
      <h2 className={styles.titleAnnouncement}>{t('announceTitleHome')}</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          placeholder={t('placeholderHome')}
          className={styles.textarea}
          required
        />
        <button type="submit" className={styles.submitButton}>
          {t('submit')}
        </button>
      </form>
    </div>
  );
};

export default ShareAnnouncement;