import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useMatches, useParams, useNavigate } from 'react-router-dom';
import StudentAnnouncementCSS from "./StudentAnnouncement.module.css";
import { fetchAnnouncementData } from '../../../api/StudentApi/fetchAnnouncementDataAPI';
import AnnouncementImage from '../../../assets/office.jpg';
import Loading from '../../LoadingComponent/Loading.jsx';
import RenderPropSticky from 'react-sticky-el';
import { applyAnnouncement } from '../../../api/StudentApi/applyAnnouncementAPI.js';

import CustomAlertDialog from "../../ui/custom_alert";
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchStudentInfo,
  updateStudentInfo,
  createStudentInfo,
} from '../../../thunks/studentInfoThunks'; 
import { resetStudentInfoState } from '../../../slices/studentInfoSlice'; 
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { isEmail } from "validator";

const studentInfoSchema = z.object({
  studentPhone: z.string()
    .refine(
      (value) => {
        // Allow empty string if optional, then validate.
        // For required fields, just remove the initial check.
        if (!value) return false; // Ensure it's not empty for a required field
        if (!value.startsWith('+')) return false; // Must start with country code
        const phoneNumber = parsePhoneNumberFromString(value);
        return phoneNumber?.isValid() === true;
      },
      (value) => ({
        message: !value || !value.startsWith('+')
          ? "countryCodeRequired" // Or "requiredField" if empty is also an error
          : "invalidPhone"
      })
    ),
  relativePhone: z.string()
    .refine(
      (value) => {
        if (!value) return false;
        if (!value.startsWith('+')) return false;
        const phoneNumber = parsePhoneNumberFromString(value);
        return phoneNumber?.isValid() === true;
      },
      (value) => ({
        message: !value || !value.startsWith('+')
          ? "countryCodeRequired"
          : "invalidPhone"
      })
    ),
  formEmail: z.string().refine(
    (val) => isEmail(val, { allow_display_name: true }),
    { message: "validEmail" }
  ),
  cv: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, { message: "cvRequired" })
    .refine((files) => files[0]?.type === "application/pdf", {
      message: "pdfOnly",
    })
    .optional() // CV is optional for update if it's already there
    .nullable(),
}).refine(
  (data) => data.studentPhone !== data.relativePhone,
  {
    message: "samePhonesError",
    path: ["relativePhone"], // Attaches the error to relativePhone field
  }
);

function InputField({ label, id, register, type = "text", error, disabled }) {
  const { t } = useTranslation();
  return (
    <div className={StudentAnnouncementCSS.formGroup}>
      <label htmlFor={id} className={StudentAnnouncementCSS.numberName}>
        {label}
      </label>
      <input
        {...register}
        id={id}
        type={type}
        disabled={disabled}
        className={`${StudentAnnouncementCSS.studentAnnouncementInputs} ${error ? StudentAnnouncementCSS.inputError : ''}`}
      />
      {error && <p className={StudentAnnouncementCSS.errorMessage}>{t(error.message)}</p>}
    </div>
  );
}

function FileInputField({ label, id, register, error, accept, disabled, currentFileName }) {
  const { t } = useTranslation();
  return (
      <label htmlFor={id} className={StudentAnnouncementCSS.uploadFile}>
        <i className="fa-solid fa-file-pdf" />
        {currentFileName ? currentFileName : t('upload_cv')}
        <i className="fa-solid fa-upload" />
        <input
          {...register}
          id={id}
          type="file"
          accept={accept}
          disabled={disabled}
          className={StudentAnnouncementCSS.CV} // Your hidden file input class
        />
      </label>
  );
}

const baseUrl = 'http://localhost:3005';

const StudentAnnouncementComponent = () => {    
  const matches = useMatches();
  const { t, i18n } = useTranslation();
  const currentMatch = matches[matches.length - 1];
  const titleKey = currentMatch?.handle?.titleKey;
  const { announcementId } = useParams();
  const dispatch = useDispatch();
  
  React.useEffect(() => {
    const baseTitle = 'IMS';
    document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle;
  }, [titleKey, t]);

  const { studentData, reduxLoading, error: reduxError, success: reduxSuccess } = useSelector(
    (state) => state.studentInfo
  );

  const [announcement, setAnnouncement] = useState();
  const [loading, setLoading] = useState(true);
  const [loadingApply, setLoadingApply] = useState(false);
  const [remainingTime, setRemainingTime] = useState('');
  const [remainingTimeStuck, setRemainingTimeStuck] = useState('');
  const [formattedEndDate, setFormattedEndDate] = useState('');
  const [showAppDetails, setShowAppDetails] = useState(false);
  const [cvPreviewUrl, setCvPreviewUrl] = useState();
  let   [totalRemainingSeconds, setTotalRemainingSeconds] = useState();
  const [isStuck, setIsStuck] = useState(true);
  const navigate = useNavigate();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    getValues,
    setValue,
  } = useForm({
    resolver: zodResolver(studentInfoSchema),
    defaultValues: {
      studentPhone: "",
      relativePhone: "",
      formEmail: "",
      cv: undefined,
    },
  });

  const watchedCv = watch("cv");
  const watchedStudentPhone = watch("studentPhone");
  const watchedRelativePhone = watch("relativePhone");
  const watchedEmail = watch("formEmail");

  useEffect(() => {
    dispatch(fetchStudentInfo());
  }, [dispatch]);
  
  useEffect(() => {
    if (studentData) {
      reset({
        studentPhone: studentData.studentPhone || "",
        relativePhone: studentData.relativePhone || "",
        formEmail: studentData.formEmail || "",
        cv: undefined, // Cannot pre-fill file input
      });
      // If there's an existing CV URL, set it for previewing
      if (studentData.cvUrl) {
        setCvPreviewUrl(studentData.cvUrl);
      }
    }
  }, [studentData, reset]);

  useEffect(() => {
    if (reduxSuccess) {
      setAlertType("success");
      setAlertMessage(t("submitSuccess"));
      setAlertOpen(true);
      dispatch(resetStudentInfoState());
    } else if (reduxError) {
      setAlertType("error");
      setAlertMessage(`${t("submitError")}: ${reduxError}`);
      setAlertOpen(true);
      dispatch(resetStudentInfoState());
    }
  }, [reduxSuccess, reduxError, t, dispatch]);

  const fileInputRef = useRef(null);
  const appDetailsContentRef = useRef(null);

  const handleStickyStateChange = (isFixed) => {
    setIsStuck(!isFixed);
  };

  const toggleAppDetails = () => {
    setShowAppDetails(prevState => !prevState);
  };

  // const handleFileUploadClick = () => {
  //   fileInputRef.current.click();
  // };

  // const handleFileDelete = () => {
  //   if (!cv) {
  //     alert(t('no_file_to_delete'));
  //     return;
  //   }
  //   setCv();
  //   setCvUrl();
  // };

  // const handleFileChange = (event) => {
  //   const selectedFile = event.target.files[0];
    
  //   if (selectedFile) {
  //     if (selectedFile.type !== 'application/pdf') {
  //       alert(t('only_pdf_allowed'));
  //       setCv(null);
  //       setCvUrl(null);
  //       return;
  //     }
  //     setCv(selectedFile);
  //     setCvUrl(URL.createObjectURL(selectedFile));
  //   }
  // };

  // const handlePreviewClick = () => {
  //   if (cvUrl) {
  //     window.open(cvUrl, '_blank');
  //   } else {
  //     alert(t('no_cv_alert'))
  //   }
  // };
  
  const handleFileDelete = () => {
    const currentCvFile = watchedCv?.[0];
    if(currentCvFile) {
      setValue("cv", undefined); // Clear the file input value in react-hook-form
      setCvPreviewUrl(null); // Clear the preview URL
    } else {
      setAlertType("warning");
      setAlertMessage(t('no_file_to_delete'));
      setAlertOpen(true);
    }
  };

  const handlePreviewClick = () => {
    const currentCvFile = watchedCv?.[0]; // Get the currently selected file from watch
    if (currentCvFile) {
      window.open(URL.createObjectURL(currentCvFile), '_blank');
    } else if (cvPreviewUrl) { // If no new file, use the URL from fetched data
      window.open(cvPreviewUrl, '_blank');
    } else {
      setAlertType("warning");
      setAlertMessage(t('no_cv_alert'));
      setAlertOpen(true);
    }
  };

  const onSubmitCombined = async (formData) => {
    const currentCvFile = watchedCv?.[0];
    setLoadingApply(true); // Set local loading for overall application process
    if (!currentCvFile) {
      alert(t('fill_all_fields_alert'));
      setLoadingApply(false);
      return;
    }

    try {
      // 1. Handle Student Information (create/update)
      const payload = {}
      if(studentData != null) {
          if (formData.studentPhone != studentData.studentPhone) {
              payload.studentPhone = formData.studentPhone;
          }
          if (formData.relativePhone != studentData.relativePhone) {
              payload.relativePhone = formData.relativePhone;
          }
          if (formData.formEmail != studentData.formEmail) {
              payload.formEmail = formData.formEmail;
          }
          if(!payload) {
            await dispatch(updateStudentInfo(payload)).unwrap();
          } 
      } else {
          payload.studentPhone = formData.studentPhone;
          payload.relativePhone = formData.relativePhone;
          payload.formEmail = formData.formEmail;
          await dispatch(createStudentInfo(payload)).unwrap();
      }

      const studentInfoFormData = new FormData();
      studentInfoFormData.append('studentPhone', formData.studentPhone);
      studentInfoFormData.append('relativePhone', formData.relativePhone);
      studentInfoFormData.append('formEmail', formData.formEmail);

      // if (formData.cv && formData.cv.length > 0) {
      //   studentInfoFormData.append('cv', formData.cv[0]);
      // }
      
      const studentCvData = new FormData();
      studentCvData.append('CV', currentCvFile);
      const applicationResponse = await applyAnnouncement(announcementId, studentCvData);

      if (applicationResponse.status === 200) {
        setAlertType("success");
        setAlertMessage(applicationResponse.data.message);
        setAlertOpen(true);
        setAnnouncement(prev => ({ ...prev, isApplied: true }));
        toggleAppDetails();
      } else {
        setAlertType("error");
        setAlertMessage(t('failed_to_sumbit_alert'));
        setAlertOpen(true);
      }

    } catch (error) {
      console.error("Submission error:", error);
      if (error.response?.status === 409 || error.response?.status === 403) {
        setAlertType("error");
        setAlertMessage(error.response.data.message);
        setAlertOpen(true);
        // window.location.reload(); // Consider if this is the best UX, maybe just show error
      } else if (error.message) { // Errors from .unwrap() will be here
        setAlertType("error");
        setAlertMessage(`${t('failed_to_sumbit_alert')}: ${error.message}`);
        setAlertOpen(true);
      } else {
        setAlertType("error");
        setAlertMessage(t('failed_to_sumbit_alert'));
        setAlertOpen(true);
      }
    } finally {
      setLoadingApply(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (alertOpen || !appDetailsContentRef.current || appDetailsContentRef.current.contains(event.target)) {
        return;
      }
      setShowAppDetails(false);
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [appDetailsContentRef, alertOpen]);

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
        if (prevSeconds >= 1) {
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

  const isOverallLoading = reduxLoading || loadingApply;

  return (
    <div>
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
                      <img src={announcement.image ? `${baseUrl}/${announcement.image}` : AnnouncementImage} alt="Announcement Image" />
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
                            {/* We will use this if CV is saved in StudentInfo table, so user can directly apply. */}
                            {/* {!announcement.isApplied && 
                              <p 
                                className={StudentAnnouncementCSS.applicationDetails} 
                                onClick={toggleAppDetails}
                              >
                                {t('my_application_details')}
                              </p>
                            }
                            {!announcement.isApplied
                              ? <button className={StudentAnnouncementCSS.applyButton} onClick={handleSubmit}>{t('apply')}</button>
                              : <button className={` ${StudentAnnouncementCSS.applyButton} ${StudentAnnouncementCSS.applied}`}>{t('applied')}</button>
                            } */}
                            {!announcement.isApplied
                              ? <button className={StudentAnnouncementCSS.applyButton} onClick={toggleAppDetails}>{t('apply')}</button>
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
                            {/* {!announcement.isApplied && 
                              <p 
                                className={StudentAnnouncementCSS.applicationDetails} 
                                onClick={toggleAppDetails}
                              >
                                {t('my_application_details')}
                              </p>
                            }
                            {!announcement.isApplied
                              ? <button className={StudentAnnouncementCSS.applyButton} onClick={handleSubmit}>{t('apply')}</button>
                              : <button className={` ${StudentAnnouncementCSS.applyButton} ${StudentAnnouncementCSS.applied}`}>{t('applied')}</button>
                            } */}
                            {!announcement.isApplied
                              ? <button className={StudentAnnouncementCSS.applyButton} onClick={toggleAppDetails}>{t('apply')}</button>
                              : <button className={` ${StudentAnnouncementCSS.applyButton} ${StudentAnnouncementCSS.applied}`}>{t('applied')}</button>
                            }
                          </div>
                        )
                      }
                    </RenderPropSticky>

                    {showAppDetails && !announcement.isApplied && (
                      <form onSubmit={handleSubmit(onSubmitCombined)}>
                        <div className={StudentAnnouncementCSS.appDetails}>
                          <div className={StudentAnnouncementCSS.appDetailsContent}  ref={appDetailsContentRef}>
                            <center><h3>{t('my_details')}</h3></center>
                            <br/>

                            <div>
                              <InputField
                                label={t('student\'s_phone_number')}
                                id="studentPhone"
                                register={register("studentPhone")}
                                type="tel"
                                error={errors.studentPhone}
                                disabled={isOverallLoading}
                              />
                            </div>
                            <div>
                              <InputField
                                label={t('relative\'s_phone_number')}
                                id="relativePhone"
                                register={register("relativePhone")}
                                type="tel"
                                error={errors.relativePhone}
                                disabled={isOverallLoading}
                              />
                            </div>
                            <div>
                              <InputField
                              label={t('student\'s_email')}
                              id="formEmail"
                              register={register("formEmail")}
                              type="email"
                              error={errors.formEmail}
                              disabled={isOverallLoading}
                            />
                            </div>
                            <div className={StudentAnnouncementCSS.fileContainer}>
                              <div className={StudentAnnouncementCSS.uploadFileContainer}>
                                <FileInputField
                                  label={t('upload_cv')}
                                  id="cv"
                                  register={register("cv")}
                                  accept="application/pdf"
                                  error={errors.cv}
                                  disabled={isOverallLoading}
                                  currentFileName={watchedCv?.[0]?.name || (studentData?.cvUrl ? t('currentCvFile') : null)}
                                />

                                <div className={StudentAnnouncementCSS.previewDeleteContainer}>
                                  <span
                                    className="material-symbols-outlined"
                                    onClick={handlePreviewClick}
                                    title={(watchedCv?.[0] || studentData?.cvUrl) ? t('preview_cv') : t('no_file_to_preview')}
                                  >quick_reference_all</span>
                                  <i
                                    className="fa-solid fa-trash"
                                    onClick={handleFileDelete}
                                    title={(watchedCv?.[0] || studentData?.cvUrl) ? t('delete_cv') : t('no_file_to_delete')}
                                  />
                                </div>
                              </div>
                              {errors.cv && <p className={StudentAnnouncementCSS.fileErrorMessage}>{t(errors.cv.message)}</p>}
                            </div>

                            {/* <div className={StudentAnnouncementCSS.uploadFileContainer}>
                              <div className={StudentAnnouncementCSS.uploadFile} onClick={handleFileUploadClick}>
                                <i className="fa-solid fa-file-pdf" /> {cv ? cv.name : t('upload_cv')} <i className="fa-solid fa-upload" />
                              </div>
                              <div className={StudentAnnouncementCSS.previewDeleteContainer}>
                                <span class="material-symbols-outlined" 
                                  onClick={handlePreviewClick} icon="preview"
                                  title={cv ? (t('preview_cv', {cv_name: cv.name})) : t('no_file_to_preview')}>quick_reference_all
                                </span>
                                <i  class="fa-solid fa-trash" onClick={handleFileDelete} icon="trash"
                                    title={cv ? (t('delete_cv', {cv_name: cv.name})) : t('no_file_to_delete')}/>
                              </div>
                            </div>
                            <input type="file" accept=".pdf" className={StudentAnnouncementCSS.CV} ref={fileInputRef} onChange={handleFileChange}/> */}

                            <button className={StudentAnnouncementCSS.saveButton} disabled={isOverallLoading}>
                              {isOverallLoading ? (
                                <div className={StudentAnnouncementCSS.spinnerContainer}>
                                  <div className={StudentAnnouncementCSS.loadingSpinner}></div>
                                </div>
                              ) : (
                                t('save_and_apply')
                              )}
                            </button> {/*!isDirty || */} 
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
            // <p>{t('no_announcement_found')}</p>
        )}

        <CustomAlertDialog
          isOpen={alertOpen}
          onClose={() => setAlertOpen(false)}
          title={alertType === "success" ? t("success") : t("error")}
          description={alertMessage}
          onConfirm={() => setAlertOpen(false)}
          confirmLabel={t("ok")}
          variant={alertType}
        />
    </div>
  )
}

export default StudentAnnouncementComponent