import React, { useEffect, useRef, useState } from "react";
import { fetchApplication } from "../../../api/CompanyApi/fetchApplicationAPI";
import styles from "./CompanyApplication.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { faUpRightAndDownLeftFromCenter } from "@fortawesome/free-solid-svg-icons";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../../LoadingComponent/Loading";
import { useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { rejectApplication } from "../../../api/CompanyApi/rejectApplicationAPI";
import { fillApplicationForm } from "../../../api/CompanyApi/fillApplicationFormAPI";
import { downloadApplicationForm } from "../../../api/CompanyApi/downloadApplicationFormAPI";
import { FaDownload, FaUpload, FaFile, FaTrash, FaFilePdf, FaRegFilePdf } from "react-icons/fa";
import { acceptApplication } from "../../../api/CompanyApi/acceptApplicationAPI";
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import DefaultProfilePicture from '../../../assets/default_profile_icon.png'
import { companyAPI } from "../../../services";

const baseUrl = 'http://localhost:3004';

const officialHolidays = [
  '01-01', // New Year's Day
  '04-23', // National Sovereignty and Children's Day
  '05-01', // Labor and Solidarity Day
  '05-19', // Commemoration of Atatürk, Youth and Sports Day
  '07-15', // Democracy and National Unity Day
  '08-30', // Victory Day
  '10-28', // Republic Day Eve (half-day)
  '10-29', // Republic Day
  '03-29', // Eve of Ramadan Feast (Ramazan Bayramı Arifesi)
  '03-30', // First Day of Ramadan Feast (Ramazan Bayramı 1. Gün)
  '03-31', // Second Day of Ramadan Feast (Ramazan Bayramı 2. Gün)
  '04-01', // Third Day of Ramadan Feast (Ramazan Bayramı 3. Gün)
  '06-05', // Eve of Sacrifice Feast (Kurban Bayramı Arifesi)
  '06-06', // First Day of Sacrifice Feast (Kurban Bayramı 1. Gün)
  '06-07', // Second Day of Sacrifice Feast (Kurban Bayramı 2. Gün)
  '06-08', // Third Day of Sacrifice Feast (Kurban Bayramı 3. Gün)
  '06-09', // Fourth Day of Sacrifice Feast (Kurban Bayramı 4. Gün)
];

const CompanyApplication = () => {
  const matches = useMatches();
  const { t } = useTranslation();
  const currentMatch = matches[matches.length - 1];
  const titleKey = currentMatch?.handle?.titleKey;

  React.useEffect(() => {
    const baseTitle = 'IMS';
    document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle;
  }, [titleKey, t]);

  const [application, setApplication] = useState(null);
  const [documentUrl, setDocumentUrl] = useState("");
  const [documentId, setDocumentId] = useState(-1);
  const [profilePicture, setProfilePicture] = useState(DefaultProfilePicture);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const [isDownloading, setIsDownloading] = useState(false);
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [internshipDuration, setInternshipDuration] = useState("");
  const [dutyNtitle, setDuty] = useState("");
  const [workOnSaturday, setWorkOnSaturday] = useState(null);
  const [question2, setQuestion2] = useState(null);
  const [question3, setQuestion3] = useState(null);

  const [internshipStartDate, setInternshipStartDate] = useState("");
  const [internshipEndDate, setInternshipEndDate] = useState("");

  const [holidayDays, setHolidayDays] = useState(0);
  // New state for "Enter number of work days:" input
  const [workDays, setWorkDays] = useState("0");

  // Create a ref for the extra fields container
  const extraFieldsRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [isAccepting, setIsAccepting] = useState(false);

  const [effectiveWorkingDays, setEffectiveWorkingDays] = useState(null);
  
  const handleFileClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      setSelectedFile(file)
    }
  };

  const handleDeleteFile = (e) => {
    e.stopPropagation();
    setSelectedFileName(null);
    setSelectedFile(null);
    document.getElementById("fileInput").value = "";
  };

  useEffect(() => {
    const getApplication = async () => {
      try {
        if (id === undefined || id === "undefined") {
          window.location.href = "/company/applications";
          return;
        }
        const data = await fetchApplication(id);
        setApplication(data.application);
        setDocumentId(data.documentId);
        const profilePictureLocation = data.application.Student?.StudentProfile?.profilePicture;
        setProfilePicture(profilePictureLocation ? `${baseUrl}/${profilePictureLocation}`: DefaultProfilePicture );
        // setDocumentUrl(`http://localhost:3005/serveFile/${data.documentId}`);
        setDocumentUrl(`${companyAPI.defaults.baseURL}/serveFile/${data.documentId}`);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching application:", error);
      }
    };

    getApplication();
  }, [id]);

  const downloadFile = async (fileDisplayName, fileType) => {
    try {
      const { blobData, contentType } = await downloadApplicationForm(id, fileType);
      const fileBlob = new Blob([blobData], { type: contentType });
      const downloadUrl = window.URL.createObjectURL(fileBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", fileDisplayName);
      document.body.appendChild(link);
      link.click();
      // Clean up the URL object and remove the temporary element
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file.");
    }
  };

  const handleDownload = async () => {
    await downloadFile("CV", "CV");
  };

  const handleRejectApplication = async () => {
    setLoading(true);
    const response = await rejectApplication(id, false);
    setLoading(false)
    alert(response.message);
    navigate("/company/applications")
  };

  const handleAcceptApplication = async () => {
    if (!selectedFile) {
      alert("Please upload 'Application Form' before accepting the application.");
      return;
    }
    try {
      setIsAccepting(true);  // Start spinner
      const response = await acceptApplication(id, true, selectedFile);
      alert(response.message);
      navigate("/company/applications");
    } catch (error) {
      console.error("Error accepting application:", error);
      alert("Failed to accept application. Please try again.");
    } finally {
      setIsAccepting(false);  // Stop spinner regardless of outcome
    }
  }

  useEffect(() => {
    const calculateEffectiveDays = () => {
      if (!internshipStartDate || !internshipEndDate) {
        setEffectiveWorkingDays(null);
        setHolidayDays(0);
        return;
      }

      const start = new Date(internshipStartDate);
      const end = new Date(internshipEndDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        setEffectiveWorkingDays(null);
        setHolidayDays(0);
        return;
      }

      let effectiveDays = 0;
      let holidays = 0;
      const current = new Date(start);

      while (current <= end) {
        const day = current.getDay();
        const mm = String(current.getMonth() + 1).padStart(2, '0');
        const dd = String(current.getDate()).padStart(2, '0');
        const dateStr = `${mm}-${dd}`;

        if (officialHolidays.includes(dateStr)) {
          holidays++;
        } else {
          if (day !== 0) { // Not Sunday
            if (day !== 6 || workOnSaturday === 'yes') { // Not Saturday or allowed
              effectiveDays++;
            }
          }
        }
        current.setDate(current.getDate() + 1);
      }

      setHolidayDays(holidays);
      setEffectiveWorkingDays(effectiveDays);
    };

    calculateEffectiveDays();
  }, [internshipStartDate, internshipEndDate, workOnSaturday]);

  const handleWorkDaysChange = (e) => {
    const value = Math.max(0, Math.min(holidayDays, parseInt(e.target.value) || 0));
    setWorkDays(value.toString());
  };

  useEffect(() => {
    const currentWorkDays = parseInt(workDays, 10) || 0;
    
    if (currentWorkDays > holidayDays) {
      const newValue = Math.min(currentWorkDays, holidayDays);
      setWorkDays(newValue.toString());
    }
    
    // If question2 is "no", force workDays to 0
    if (question2 === "no") {
      setWorkDays("0");
    }
  }, [holidayDays, question2, workDays]);

  const validateApplicationFields = () => {
    if (!id || !internshipStartDate || !internshipEndDate || !internshipDuration ||
        !dutyNtitle || workOnSaturday === null || question2 === null ||
        question3 === null || workDays === "") {
      alert("Please fill out all required fields.");
      return false;
    }

    if (effectiveWorkingDays === null) {
      alert("Invalid dates provided.");
      return false;
    }

    if (parseInt(workDays) > holidayDays) {
      alert(`Cannot work more holiday days (${holidayDays}) than available`);
      return false;
    }

    const duration = parseInt(internshipDuration, 10);
    if (isNaN(duration) || duration < 20) {
      alert("Internship duration must be at least 20 days.");
      return false;
    }

    const start = new Date(internshipStartDate);
    const end = new Date(internshipEndDate);
    if (start > end) {
      alert("Internship start date must be before the end date.");
      return false;
    }

    const totalDays = effectiveWorkingDays + parseInt(workDays);
    if (totalDays  < 20) {
      alert(`Total working days (${totalDays}) are less than 20.`);
      return false;
    }

    if ((effectiveWorkingDays + parseInt(workDays))!== duration) {
      alert("Internship duration doesn't match calculated working days.");
      return false;
    }

    return true;
  };
  
  const handleApplicationDownload = async () => {
  if (!validateApplicationFields()) {
    return;
  }

  try {
    setIsDownloading(true);
    const response = await fillApplicationForm(
      id,
      internshipStartDate,
      internshipEndDate,
      internshipDuration,
      dutyNtitle,
      workOnSaturday,
      question2,
      question3,
      workDays
    );
    alert(response.message);
    await downloadFile("Application Form", "UpdatedApplicationForm");
  } catch (error) {
    console.error('Download failed:', error);
    alert("Failed to download application form");
  } finally {
    setIsDownloading(false);
  }
};

  const toggleFullscreen = () => {
    const docPreview = document.getElementById("pdfPreview");
    if (!isFullscreen) {
      if (docPreview.requestFullscreen) {
        docPreview.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // useEffect to scroll into view when extra fields are shown
  useEffect(() => {
    if (showExtraFields && extraFieldsRef.current) {
      extraFieldsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showExtraFields]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
        <Loading />
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.profileSection}>
            <img className={styles.profileImage} src={profilePicture}/>
            <div className={styles.profileInfo}>
              <h2>{application.Student.username}</h2>
              {/* <p className={styles.announcementTitle}>{application.Announcement.announcementName}</p> */}
            </div>
          </div>
          <div className={styles.submissionDate}>
            <span>Submitted: {formatDate(application.applyDate)}</span>
          </div>
        </div>
      </div>

      <div className={styles.documentSection}>
        <div className={styles.documentHeader}>
          <span className={styles.documentTitle}>Application_Document.pdf</span>
          <div className={styles.documentActions}>
            <a onClick={handleDownload} className={styles.actionButton}>
              <FontAwesomeIcon icon={faDownload} style={{ color: "#9a1220" }} />
            </a>
            <button onClick={toggleFullscreen} className={styles.actionButton}>
              <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} style={{ color: "#9a1220" }} />
            </button>
          </div>
        </div>
        <div className={styles.documentPreview} id="pdfPreview">
          <iframe src={documentUrl} className={styles.pdfViewer} title="PDF Preview" />
        </div>
      </div>

      <div className={styles.extraInfoContainer}>
        <div className={styles.endDateContainer}>
          <h3 className={styles.endDateName}>Application Name</h3>
          <p className={styles.endDate}>{application.Announcement.announcementName}</p>
        </div>
        <div className={styles.endDateContainer}>
          <h3 className={styles.endDateName}>Grade</h3>
          <p className={styles.endDate}>{application.Student.year}</p>
        </div>
      </div>

      <div className={styles.actionButtons}>
        <button className={styles.rejectButton} onClick={handleRejectApplication}>Reject</button>
        {/* Only show the original Accept button if extra fields are not yet visible */}
        {!showExtraFields && (
          <button
            className={styles.acceptButton}
            onClick={() => setShowExtraFields(true)}
          >
            Fill Application Form
          </button>
        )}
      </div>

      {/* Conditionally render the extra fields once Accept is clicked */}
      {showExtraFields && (
        <div ref={extraFieldsRef} className={styles.extraFields}>
          <h3>Additional Information</h3>

          {/* Wrap the two date inputs in a row */}
          <div className={styles.dateRow}>
            <label>
              Internship Start Date:
              <input
                type="date"
                className={styles.input}
                value={internshipStartDate}
                onChange={(e) => setInternshipStartDate(e.target.value)}
              />
            </label>
            <label>
              Internship End Date:
              <input
                type="date"
                className={styles.input}
                value={internshipEndDate}
                onChange={(e) => setInternshipEndDate(e.target.value)}
              />
            </label>
          </div>
          {effectiveWorkingDays !== null && (
            <div className={styles.effectiveDays}>
              Total Working Days: <strong>{effectiveWorkingDays + parseInt(workDays)}</strong>
              <br />
              (Regular: {effectiveWorkingDays} + Holidays: {workDays})
            </div>
          )}
          <label>
            Internship Duration:
            <input
              type="text"
              value={internshipDuration}
              onChange={(e) => setInternshipDuration(e.target.value)}
              placeholder="e.g., 30 (as work days)"
            />
          </label>

          <label>
            Duty and title:
            <input
              type="text"
              value={dutyNtitle}
              onChange={(e) => setDuty(e.target.value)}
              placeholder="Enter duty and title of the representative"
            />
          </label>

          <div className={styles.radioGroup}>
            <p>Do you work on Saturday?</p>
            <label>
              <input
                type="radio"
                name="saturday"
                value="yes"
                checked={workOnSaturday === "yes"}
                onChange={(e) => setWorkOnSaturday(e.target.value)}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="saturday"
                value="no"
                checked={workOnSaturday === "no"}
                onChange={(e) => setWorkOnSaturday(e.target.value)}
              />{" "}
              No
            </label>
          </div>

          <div className={styles.radioGroup}>
            <p>Do you work on the official/religious holiday eve?</p>
            <label>
              <input
                type="radio"
                name="question2"
                value="yes"
                checked={question2 === "yes"}
                onChange={(e) => setQuestion2(e.target.value)}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="question2"
                value="no"
                checked={question2 === "no"}
                onChange={(e) => {
                  setQuestion2(e.target.value);
                  setWorkDays("0"); // Reset work days to "0" when "no" is selected
                }}
              />{" "}
              No
            </label>
          </div>

          {/* Conditionally show input for number of work days if answer is yes */}
          {question2 === "yes" && (
            <div className={styles.inputContainer}>
              <label className={styles.inputLabel}>
                Enter number of work days on holidays:
              </label>
              <div className={styles.inputField}>
                <input
                  type="number"
                  min="0"
                  max={holidayDays}
                  value={workDays}
                  onChange={handleWorkDaysChange}
                  disabled={question2 !== "yes"}
                  className={styles.numberInput}
                />
                <span className={styles.holidayNote}>
                  (Available holiday days: {holidayDays})
                </span>
              </div>
            </div>
          )}

          <div className={styles.radioGroup}>
            <p>I don't want insurance.</p>
            <label>
              <input
                type="radio"
                name="question3"
                value="yes"
                checked={question3 === "yes"}
                onChange={(e) => setQuestion3(e.target.value)}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="question3"
                value="no"
                checked={question3 === "no"}
                onChange={(e) => setQuestion3(e.target.value)}
              />{" "}
              No
            </label>
          </div>

          <div className={styles.files}>
            <button 
              onClick={handleApplicationDownload} 
              className={styles.downloadFile}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <div className={styles.spinnerContainer}>
                  <svg className={styles.spinner} viewBox="0 0 24 24">
                    <circle
                      className={styles.spinnerCircle}
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className={styles.spinnerPath}
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Filling and Downloading...
                </div>
              ) : (
                <>
                  <FontAwesomeIcon icon={faFilePdf} /> Fill and Download Application Form <FaDownload />
                </>
              )}
            </button>
            
            <div className={styles.uploadFile} onClick={handleFileClick}>
              {selectedFileName ? (
                <>
                  <FontAwesomeIcon icon={faFilePdf} /> {selectedFileName}
                  <FaTrash className={styles.deleteIcon} onClick={handleDeleteFile} />
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faFilePdf} /> {'Upload Application Form'} <FaUpload /> 
                </>
              )}
            </div>
            <input
              id="fileInput"
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              style={{ display: "none" }}
              required
            />
          </div>

          <div className={styles.acceptContainer}>
            <button 
              className={styles.acceptButton} 
              onClick={handleAcceptApplication}
              disabled={isAccepting}
            >
              {isAccepting ? (
                <div className={styles.spinnerContainer}>
                  <svg className={styles.spinner} viewBox="0 0 24 24">
                    <circle
                      className={styles.spinnerCircle}
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className={styles.spinnerPath}
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Accepting...
                </div>
              ) : "Accept"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyApplication;
