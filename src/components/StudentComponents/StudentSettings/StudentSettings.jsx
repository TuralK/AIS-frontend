import React, { useRef, useState, useEffect } from 'react';
import Settings from '../../Settings/Settings';
import StudentInfo from '../StudentInfo/StudentInfo';
import { useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './StudentSettings.module.css';

const StudentSettings = () => {
  const matches = useMatches();
  const { t } = useTranslation();
  const currentMatch = matches[matches.length - 1];
  const titleKey = currentMatch?.handle?.titleKey;
  const settingsRef = useRef(null);
  const studentInfoRef = useRef(null);
  const [activePill, setActivePill] = useState('settings');

  useEffect(() => {
    const baseTitle = 'IMS';
    document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle;
  }, [titleKey, t]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === settingsRef.current) {
            setActivePill('settings');
          } else if (entry.target === studentInfoRef.current) {
            setActivePill('studentInfo');
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (settingsRef.current) observer.observe(settingsRef.current);
    if (studentInfoRef.current) observer.observe(studentInfoRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${styles.container} bg-gray-50`}>
      <div className={styles.pillsContainer}>
        <div className={styles.pillWtext}>
          <button
            className={`${styles.pill} ${activePill === 'settings' ? styles.active : ''}`}
            onClick={() => scrollToSection(settingsRef)}
          ></button>
          <span className={styles.pillText}>{t('settings')}</span>
        </div>
        <div className={styles.pillWtext}>
            <button
            className={`${styles.pill} ${activePill === 'studentInfo' ? styles.active : ''}`}
            onClick={() => scrollToSection(studentInfoRef)}
            >
            </button>
            <span className={styles.pillText}>{t('studentInfo')}</span>
        </div>
      </div>
      <div className="flex flex-col">
        <div ref={settingsRef}>
          <Settings apiUrl={'http://localhost:3004'} />
        </div>
        <div ref={studentInfoRef}>
          <StudentInfo />
        </div>
      </div>
    </div>
  );
};

export default StudentSettings;