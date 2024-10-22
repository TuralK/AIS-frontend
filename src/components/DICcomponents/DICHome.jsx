import React, { useState } from 'react';
import axios from 'axios';
import styles from './DICHome.module.css'; 
import { useTranslation } from 'react-i18next';

const DICHome = () => {
  const [announcement, setAnnouncement] = useState('');
  const { t } = useTranslation(); 

  const handleChange = (e) => {
    setAnnouncement(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('YOUR_API_ENDPOINT', {
        content: announcement,
      });
      console.log(response.data); // Başarılı yanıtı konsola yazdır
      setAnnouncement(''); // Formu temizle
    } catch (error) {
      console.error('Error posting announcement:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}> {t('announceTitleHome')}</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={announcement}
            onChange={handleChange}
            rows="4"
            placeholder={t('placeholderHome')}
            className={styles.textarea} // Apply module style
            required
          />
          <button type="submit" className={styles.submitButton}> {/* Apply module style */}
            {t('buttonHome')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DICHome;
