import React from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import StudentAnnouncementCSS from "./StudentAnnouncement.module.css";
import { fetchAnnouncementData } from '../../../api/StudentApi/fetchAnnouncementDataAPI';
import AnnouncementImage from '../../../assets/announcement.jpg';
import Loading from '../../LoadingComponent/Loading.jsx';

const StudentAnnouncementComponent = () => {    
  const[announcement, setAnnouncement] = useState();
  const[loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const { announcementId } = useParams();

  useEffect(() => {
      fetchAnnouncementData(announcementId)
          .then(announcementData => {
              setAnnouncement(announcementData);
          })
          .finally(() => {
              setLoading(false);
          });
  }, [announcementId]);

  if (loading) {
    return (
        <Loading />
    )
  }

  return (
    <div className={StudentAnnouncementCSS["container-apply"]}>
        {announcement ? (
            announcement.image ? (
                <img src={announcement.image} alt="Announcement" />
            )
            :
            (
                <img src={AnnouncementImage} alt="Announcement" />
            ))
        : 
        (
            "No information found"
        )}
    </div>
  )
}

export default StudentAnnouncementComponent