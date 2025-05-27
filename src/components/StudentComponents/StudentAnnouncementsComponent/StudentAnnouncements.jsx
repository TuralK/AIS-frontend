import React from 'react';
import { useState, useEffect } from 'react';
import StudentAnnouncementsCSS from "./StudentAnnouncements.module.css";
import { fetchAnnouncements } from '../../../api/StudentApi/fetchAnnouncementsAPI';
import { getInternship } from '../../../api/StudentApi/internshipApi.js';
import AnnouncementImage from '../../../assets/office.jpg';
import { useTranslation } from 'react-i18next';
import { useMatches } from 'react-router-dom';
import { Link } from "react-router-dom";
import Loading from '../../LoadingComponent/Loading.jsx';
import FileUploadButton from './FileUploadButton';
import { getMatchingAnnouncements } from '../../../api/StudentApi/getMatchingAnnouncements.js';

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

  const [allAnnouncements, setAllAnnouncements] = useState([]); // State for all announcements
  const [matchingAnnouncements, setMatchingAnnouncements] = useState([]); // State for matching announcements
  const [displayedAnnouncements, setDisplayedAnnouncements] = useState([]); // State for currently displayed announcements
  const [loading, setLoading] = useState(true);
  const [showUploadButton, setShowUploadButton] = useState(true);
  const [showMatching, setShowMatching] = useState(false); // New state to toggle between all/matching

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [announcementsData, matchingData] = await Promise.all([
          fetchAnnouncements(),
          getMatchingAnnouncements()
        ]);
        setAllAnnouncements(announcementsData);
        setMatchingAnnouncements(matchingData);
        setDisplayedAnnouncements(announcementsData); // Initially display all announcements
      } catch (error) {
        console.error("Error fetching announcements:", error);
        // Handle error appropriately, maybe display an error message
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    checkInternshipStatus(); // Call this here as well for initial load
  }, []);

  // Update displayedAnnouncements when showMatching changes
  useEffect(() => {
    if (showMatching) {
      setDisplayedAnnouncements(matchingAnnouncements);
    } else {
      setDisplayedAnnouncements(allAnnouncements);
    }
  }, [showMatching, allAnnouncements, matchingAnnouncements]);

  const checkInternshipStatus = async () => {
    try {
      const internshipData = await getInternship();

      if (internshipData && (internshipData.manualApplicationId || internshipData.applicationId)) {
        setShowUploadButton(false);
      } else {
        setShowUploadButton(true);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setShowUploadButton(true);
      } else if (error.response?.data?.message === "You already have an internship") {
        setShowUploadButton(false);
      } else {
        setShowUploadButton(true);
      }
    }
  };

  const handleUploadSuccess = () => {
    setShowUploadButton(false);
    checkInternshipStatus();
  };

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <div className={StudentAnnouncementsCSS["content-container"]}>
      <div className={StudentAnnouncementsCSS["filter-buttons"]}>
        <button
          className={`${StudentAnnouncementsCSS["filter-button"]} ${!showMatching ? StudentAnnouncementsCSS["active"] : ''}`}
          onClick={() => setShowMatching(false)}
        >
          {t('allAnnouncements')} {/* You'll need to add this key to your translation file */}
        </button>
        <button
          className={`${StudentAnnouncementsCSS["filter-button"]} ${showMatching ? StudentAnnouncementsCSS["active"] : ''}`}
          onClick={() => setShowMatching(true)}
        >
          {t('matchingAnnouncements')} {/* You'll need to add this key to your translation file */}
        </button>
      </div>

      {displayedAnnouncements.length > 0 ?
        (<div className={StudentAnnouncementsCSS["content-2"]} id="content">
          {displayedAnnouncements.map((announcement, index) => (
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
        : <h2>{t('noAnnouncement')}</h2>
      }


      <FileUploadButton
        onUploadSuccess={handleUploadSuccess}
        isVisible={showUploadButton}
      />
    </div>
  )
}

export default StudentAnnouncements;