import React from 'react';
import AnnouncementList from '../AnnouncementList';
import ShareAnnouncement from '../ShareAnnouncement';
import Messaging from '../../MessagingComponent';
import styles from './DICHome.module.css';

const DICHome = () => {
  const sampleAnnouncements = [
    { id: 1, content: 'Announcement 1' },
    { id: 2, content: 'Announcement 2' },
    { id: 3, content: 'Announcement 3' },
    { id: 4, content: 'Announcement 4' },
    { id: 5, content: 'Announcement 5' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <AnnouncementList announcements={sampleAnnouncements} />
      </div>
      <div className={styles.bottomCenter}>
        <ShareAnnouncement />
      </div>
      <div className={styles.rightColumn}>
        <Messaging />
      </div>
    </div>
  );
};

export default DICHome;