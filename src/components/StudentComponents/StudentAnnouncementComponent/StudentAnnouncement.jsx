import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import StudentAnnouncementCSS from "./StudentAnnouncement.module.css";
import { fetchAnnouncementData } from '../../../api/StudentApi/fetchAnnouncementDataAPI';
import AnnouncementImage from '../../../assets/office.jpg';
import Loading from '../../LoadingComponent/Loading.jsx';
import RenderPropSticky from 'react-sticky-el';
import { applyAnnouncement } from '../../../api/StudentApi/applyAnnouncementAPI.js';

const StudentAnnouncementComponent = () => {    
  const [announcement, setAnnouncement] = useState();
  const [loading, setLoading] = useState(true);
  const [loadingApply, setLoadingApply] = useState(false);
  const [remainingTime, setRemainingTime] = useState('');
  const [remainingTimeStuck, setRemainingTimeStuck] = useState('');
  const [formattedEndDate, setFormattedEndDate] = useState('');
  const [showAppDetails, setShowAppDetails] = useState(false);
  const [cv, setCv] = useState();
  const [cvUrl, setCvUrl] = useState();
  const [studentPhoneNumber, setStudentPhoneNumber] = useState("05");
  const [relativePhoneNumber, setRelativePhoneNumber] = useState("05");
  let   [totalRemainingSeconds, setTotalRemainingSeconds] = useState();
  const { t, i18n } = useTranslation();
  const { announcementId } = useParams();
  const [isStuck, setIsStuck] = useState(true);
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const appDetailsContentRef = useRef(null);
  const prevValueRef = useRef("05");

  const handleStickyStateChange = (isFixed) => {
    setIsStuck(!isFixed);
  };

  const toggleAppDetails = () => {
    setShowAppDetails(prevState => !prevState);
  };

  const handleStudentPhoneChange = (e) => {
    const input = e.target.value;
    if (input.length < prevValueRef.current.length) {
      setStudentPhoneNumber(isPhoneInputValid(input) ? input : "05");
    } else if (isPhoneInputValid(input)) {
      setStudentPhoneNumber(input);
    }
  };
  const handleRelativePhoneChange = (e) => {
    const input = e.target.value;
    if (input.length < prevValueRef.current.length) {
      setRelativePhoneNumber(isPhoneInputValid(input) ? input : "05");
    } else if (isPhoneInputValid(input)) {
      setRelativePhoneNumber(input);
    }
  };
  const isPhoneInputValid = (input) => {
    if (!input.startsWith("05")) {
      return;
    }
    const restOfNumber = input.substring(2);
    const regex = /^[0-9]{0,9}$/;
    return regex.test(restOfNumber)
  }

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileDelete = () => {
    if (!cv) {
      alert(t('no_file_to_delete'));
      return;
    }
    setCv();
    setCvUrl();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        alert(t('only_pdf_allowed'));
        setCv(null);
        setCvUrl(null);
        return;
      }
      setCv(selectedFile);
      setCvUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handlePreviewClick = () => {
    if (cvUrl) {
      window.open(cvUrl, '_blank');
    } else {
      alert(t('no_cv_alert'))
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cv || !studentPhoneNumber || !relativePhoneNumber) {
      alert(t('fill_all_fields_alert'));
      return;
    }
  
    setLoadingApply(true);
    try {
      const studentData = new FormData();
      studentData.append('CV', cv);
      studentData.append('user_phone', studentPhoneNumber);
      studentData.append('relative_phone', relativePhoneNumber);
      const response = await applyAnnouncement(announcementId, studentData);
  
      if (response.status === 200) {
        alert(response.data.message);
        navigate('/student/announcements');
      }
    } catch (error) {
      if(error.status === 409) {
        alert(error.response.data.error);
        window.location.reload();
      } else{
        alert(t('failed_to_sumbit_alert'));
      }
    }
    setLoadingApply(false);
  };
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (appDetailsContentRef.current && !appDetailsContentRef.current.contains(event.target)) {
        setShowAppDetails(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  },[appDetailsContentRef]);

  useEffect(() => { 
      fetchAnnouncementData(announcementId)
          .then(announcementData => {
              setAnnouncement(announcementData);
              setTotalRemainingSeconds(announcementData.remainingSeconds);
              formatRemainingTime(announcementData.remainingSeconds);
          })
          .finally(() => {
              setLoading(false);
          });
  }, [announcementId]);

  useEffect(() => {
    if (!announcement) return;
    let country;
    if(i18n.language == 'en') {
      country ='en-US';
    } else if(i18n.language == 'tr'){
      country = 'tr-TR';
    }
    setFormattedEndDate(new Intl.DateTimeFormat(country, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(announcement.endDate)));
  },[announcement, i18n.language])

  useEffect(() => {
    formatRemainingTime(totalRemainingSeconds);
  },[i18n.language])

  useEffect(() => {
    if (!announcement) return;

    // Initialize the timer
    const timer = setInterval(() => {
      setTotalRemainingSeconds(prevSeconds => {
        if (prevSeconds > 1) {
          const newRemainingSeconds = prevSeconds - 1;
          formatRemainingTime(newRemainingSeconds);
          return newRemainingSeconds;
        } else {
          clearInterval(timer);
          if(!announcement.isApplied) {
            navigate('/student/announcements');
          }
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [announcement]);


  const formatRemainingTime = (remainingSeconds) => {
    const days = Math.floor(remainingSeconds / (60 * 60 * 24));
    const hours = Math.floor((remainingSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((remainingSeconds % (60 * 60)) / 60);
    const seconds = remainingSeconds % 60;

    if (days > 0) {
      setRemainingTime(t('application_close_day', { count: days }));
      setRemainingTimeStuck(t('application_left_day', {count: days}));
    } else if (hours > 0) {
      setRemainingTime(t('application_close_hour', { count: hours }));
      setRemainingTimeStuck(t('application_left_hour', { count: hours }));
    } else if (minutes > 0) {
      setRemainingTime(t('application_close_minute', { count: minutes }));
      setRemainingTimeStuck(t('application_left_minute', { count: minutes }));
    } else if (seconds > 0) {
      setRemainingTime(t('application_close_second', { count: seconds }));
      setRemainingTimeStuck(t('application_left_second', { count: seconds })); 
    } else {
      setRemainingTime(t('application_closed'));
      setRemainingTimeStuck(t('application_closed'));
    }
  };

  if (loading) {
    return (
        <Loading />
    )
  }

  return (
    <div>
      {loadingApply && <Loading />}
        {announcement ? 
            (
              <div className={StudentAnnouncementCSS.studentAnnouncement}>
              <div className={StudentAnnouncementCSS.card}>
                <header className={StudentAnnouncementCSS.header}>
                    <h1 className={StudentAnnouncementCSS.announcementNameHeader}>{announcement.announcementName}</h1>
                    <h3 className={StudentAnnouncementCSS.companyNameHeader}>{announcement.Company.name}</h3>
                </header>
                
                <div className={StudentAnnouncementCSS.content}>
                    <div className={StudentAnnouncementCSS.announcementImage}>
                        <img src={AnnouncementImage} alt="Announcement Image" />
                    </div>
                    <RenderPropSticky 
                      stickyClassName={StudentAnnouncementCSS.stuck} 
                      stickyStyle={{ top: 10, zIndex: 10 }}
                      topOffset = {-10}
                      onFixedToggle={handleStickyStateChange}
                    >
                      {isStuck
                        ? 
                        (
                          <div className={StudentAnnouncementCSS.announcementInfo}>
                            <p className={StudentAnnouncementCSS.deadline}>{remainingTime}</p>
                            {!announcement.isApplied && 
                              <p 
                                className={StudentAnnouncementCSS.applicationDetails} 
                                onClick={toggleAppDetails}
                              >
                                {t('my_application_details')}
                              </p>
                            }
                            {!announcement.isApplied
                              ? <button className={StudentAnnouncementCSS.applyButton} onClick={handleSubmit}>{t('applyNow')}</button>
                              : <button className={` ${StudentAnnouncementCSS.applyButton} ${StudentAnnouncementCSS.applied}`}>{t('applied')}</button>
                            }
                          </div>
                        )
                        :
                        (
                          <div className={StudentAnnouncementCSS.announcementInfo}>
                            <div className={StudentAnnouncementCSS.textContainer}>
                              <p className={StudentAnnouncementCSS.announcementName}>{announcement.announcementName}</p>
                              <p className={StudentAnnouncementCSS.companyName}>{announcement.Company.name}</p>
                            </div>
                            <p className={StudentAnnouncementCSS.deadline}>{remainingTimeStuck}</p>
                            {!announcement.isApplied && 
                              <p 
                                className={StudentAnnouncementCSS.applicationDetails} 
                                onClick={toggleAppDetails}
                              >
                                {t('my_application_details')}
                              </p>
                            }
                            {!announcement.isApplied
                              ? <button className={StudentAnnouncementCSS.applyButton} onClick={handleSubmit}>{t('applyNow')}</button>
                              : <button className={` ${StudentAnnouncementCSS.applyButton} ${StudentAnnouncementCSS.applied}`}>{t('applied')}</button>
                            }
                          </div>
                        )
                      }
                    </RenderPropSticky>

                    {showAppDetails && !announcement.isApplied && (
                      <form onSubmit={handleSubmit}>
                        <div className={StudentAnnouncementCSS.appDetails}>
                          <div className={StudentAnnouncementCSS.appDetailsContent}  ref={appDetailsContentRef}>
                            <center><h3>{t('my_details')}</h3></center>
                            <br/>

                            <div>
                              <label className={StudentAnnouncementCSS.numberName}>{t('student\'s_phone_number')}</label>
                              <input 
                                    type="text" 
                                    pattern="^0[5][0-9]{9}$" 
                                    maxLength="11" 
                                    placeholder="05XXXXXXXXX" 
                                    value={studentPhoneNumber}
                                    onChange={handleStudentPhoneChange}  
                                    required
                              />
                            </div>
                            <div>
                              <label className={StudentAnnouncementCSS.numberName}>{t('relative\'s_phone_number')}</label>
                              <input 
                                    type="text" 
                                    pattern="^0[5][0-9]{9}$" 
                                    maxLength="11" 
                                    placeholder="05XXXXXXXXX" 
                                    value={relativePhoneNumber}
                                    onChange={handleRelativePhoneChange}  
                                    required
                              />
                            </div>

                            <div className={StudentAnnouncementCSS.uploadFileContainer}>
                              <div className={StudentAnnouncementCSS.uploadFile} onClick={handleFileUploadClick}>
                                <i className="fa-solid fa-file-pdf" /> {cv ? cv.name : t('upload_cv')} <i className="fa-solid fa-upload" />
                              </div>
                              <div className={StudentAnnouncementCSS.previewDeleteContainer}>
                                <span class="material-symbols-outlined" onClick={handlePreviewClick} icon="preview"
                                      title={cv ? (t('preview_cv', {cv_name: cv.name})) : t('no_file_to_preview')}>quick_reference_all</span>
                                <i  class="fa-solid fa-trash" onClick={handleFileDelete} icon="trash"
                                    title={cv ? (t('delete_cv', {cv_name: cv.name})) : t('no_file_to_delete')}/>
                              </div>
                            </div>
                            <input type="file" accept=".pdf" className={StudentAnnouncementCSS.CV} ref={fileInputRef} onChange={handleFileChange}/>

                            <button className={StudentAnnouncementCSS.saveButton}>{t('save_and_apply')}</button>
                            <center>
                              <p 
                                  className={StudentAnnouncementCSS.closeApplicationDetails} 
                                  onClick={toggleAppDetails}
                              >
                                {t('close')}
                              </p>
                            </center>                            
                          </div>
                        </div>
                      </form>
                    )}
                    
                    <div className={StudentAnnouncementCSS.description}>
                      <h2 className={StudentAnnouncementCSS.descriptionName}>{t('description')}</h2>
                      <div className={StudentAnnouncementCSS.descriptionContent}>
                        {announcement.description}
                      </div>
                    </div>

                    <div className={StudentAnnouncementCSS.endDateContainer}>
                      <h3 className={StudentAnnouncementCSS.endDateName}>{t('end_date')}</h3>
                      <p className={StudentAnnouncementCSS.endDate}>{formattedEndDate}</p>
                    </div>
                </div>

                
              </div>
            </div>
            )
        : 
        (
            "No information found"
        )}
    </div>
  )
}

export default StudentAnnouncementComponent