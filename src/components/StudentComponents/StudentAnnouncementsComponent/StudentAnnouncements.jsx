import React from 'react';
import { useState, useEffect } from 'react';
import StudentAnnouncementsCSS from "./StudentAnnouncements.module.css";
import { fetchAnnouncements } from '../../../api/StudentApi/fetchAnnouncementsAPI';
import AnnouncementImage from '../../../assets/office.jpg';
import { useTranslation } from 'react-i18next';
import { useMatches } from 'react-router-dom';
import { Link } from "react-router-dom";
import Loading from '../../LoadingComponent/Loading.jsx';

const baseUrl = 'http://localhost:3005';

const StudentAnnouncements = () => {
  const matches = useMatches();
  const { t } = useTranslation();
  const currentMatch = matches[matches.length - 1];
  const titleKey = currentMatch?.handle?.titleKey;
  
  React.useEffect(() => {
    const baseTitle = 'IMS';
    document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle;
  }, [titleKey, t]);

  
  const[announcements, setAnnouncements] = useState([]);
  const[loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements()
        .then(announcementsData => {
            setAnnouncements(announcementsData);
        })
        .finally(() => {
            setLoading(false);
        });
  }, []);

  if (loading) {
    return (
        <Loading />
    )
  }
  
  return (
    <div className={StudentAnnouncementsCSS["content-container"]}>
        {}
        {announcements.length > 0 ?
            (<div className={StudentAnnouncementsCSS["content-2"]} id="content">
                {announcements.map((announcement, index) => (
                    <Link to={`/student/announcements/${announcement.id}`} key={index} className={StudentAnnouncementsCSS["card"]}>
                        <div>
                            {announcement.image ? (
                                <img src={`${baseUrl}/${announcement.image}`} alt="Announcement" />
                            ) : (
                                <img src={AnnouncementImage} alt="Announcement" />
                            )}
                            <div className={StudentAnnouncementsCSS["card-body"]}>
                                <p className={StudentAnnouncementsCSS["card-title"]}>{announcement.Company.name}</p>
                                <p className={StudentAnnouncementsCSS["card-text"]}>{announcement.announcementName}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>)
            :  <h2>{t('noAnnouncement')}</h2>
        }
    </div>
  )
}

export default StudentAnnouncements