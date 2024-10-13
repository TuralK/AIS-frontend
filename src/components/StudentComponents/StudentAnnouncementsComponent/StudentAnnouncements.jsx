import React from 'react';
import { useState, useEffect } from 'react';
import StudentAnnouncementsCSS from "./StudentAnnouncements.module.css";
import { fetchAnnouncements } from '../../../api/StudentApi/fetchAnnouncementsAPI';
import AnnouncementImage from '../../../assets/announcement.jpg';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import Loading from '../../LoadingComponent/Loading.jsx';

const StudentAnnouncements = () => {
  const[announcements, setAnnouncements] = useState([]);
  const[loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

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
                                <img src={announcement.image} alt="Announcement" />
                            ) : (
                                <img src={AnnouncementImage} alt="Announcement" />
                            )}
                            <div className={StudentAnnouncementsCSS["card-body"]}>
                                <p className={StudentAnnouncementsCSS["card-title"]}>{announcement.Company.name}</p>
                                <p className={StudentAnnouncementsCSS["card-text"]}>{announcement.announcementName}</p>
                                <button
                                    className={StudentAnnouncementsCSS["details-button"]}
                                >
                                    {t('moreDetails')}
                                </button>
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