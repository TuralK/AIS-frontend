import { useEffect, useRef, useState } from "react";
import { fetchApplication } from "../../../api/CompanyApi/fetchApplicationAPI";
import styles from "./CompanyApplication.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { faUpRightAndDownLeftFromCenter } from "@fortawesome/free-solid-svg-icons";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../../LoadingComponent/Loading";
import axios from "axios";
import { rejectApplication } from "../../../api/CompanyApi/rejectApplicationAPI";
import { fillApplicationForm } from "../../../api/CompanyApi/fillApplicationFormAPI";
import { downloadApplicationForm } from "../../../api/CompanyApi/downloadApplicationFormAPI";
import { FaDownload, FaUpload, FaFile, FaTrash, FaFilePdf, FaRegFilePdf } from "react-icons/fa";
import { acceptApplication } from "../../../api/CompanyApi/acceptApplicationAPI";
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

const CompanyApplication = () => {
  const [application, setApplication] = useState(null);
  const [documentUrl, setDocumentUrl] = useState("");
  const [documentId, setDocumentId] = useState(-1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const [showExtraFields, setShowExtraFields] = useState(false);
  const [internshipDuration, setInternshipDuration] = useState("");
  const [dutyNtitle, setDuty] = useState("");
  const [workOnSaturday, setWorkOnSaturday] = useState(null);
  const [question2, setQuestion2] = useState(null);
  const [question3, setQuestion3] = useState(null);

  const [internshipStartDate, setInternshipStartDate] = useState("");
  const [internshipEndDate, setInternshipEndDate] = useState("");

  // New state for "Enter number of work days:" input
  const [workDays, setWorkDays] = useState("0");

  // Create a ref for the extra fields container
  const extraFieldsRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

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
        setDocumentUrl(`http://localhost:3005/serveFile/${data.documentId}`);
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
    setLoading(true);
    const response = await acceptApplication(id, true, selectedFile);
    setLoading(false)
    alert(response.message);
    navigate("/company/applications")
  }

  const validateApplicationFields = () => {
    /*
    const officialHolidays = [
        '2024-01-01', // New Year's Day
        '2024-04-23', // National Sovereignty and Children's Day
        '2024-05-01', // Labor and Solidarity Day
        '2024-04-09', // Eve of Ramadan Feast (half-day)
        '2024-04-10', // First Day of Ramadan Feast
        '2024-04-11', // Second Day of Ramadan Feast
        '2024-04-12', // Third Day of Ramadan Feast
        '2024-05-19', // Commemoration of Atatürk, Youth and Sports Day
        '2024-07-15', // Democracy and National Unity Day
        '2024-06-16', // Eve of Sacrifice Feast (half-day)
        '2024-06-17', // First Day of Sacrifice Feast
        '2024-06-18', // Second Day of Sacrifice Feast
        '2024-06-19', // Third Day of Sacrifice Feast
        '2024-06-20', // Fourth Day of Sacrifice Feast
        '2024-08-30', // Victory Day
        '2024-10-28', // Republic Day Eve (half-day)
        '2024-10-29', // Republic Day
    ];
    */
    // Check that required fields are not null or empty.
    if (
      !id ||
      !internshipStartDate ||
      !internshipEndDate ||
      !internshipDuration ||
      !dutyNtitle ||
      workOnSaturday === null ||
      question2 === null ||
      question3 === null ||
      workDays === ""
    ) {
      alert("Please fill out all required fields.");
      return false;
    }
    // Validate internship duration (make sure it's a number and at least 20)
    const duration = parseInt(internshipDuration, 10);
    if (isNaN(duration) || duration < 20) {
      alert("Internship duration must be at least 20 days.");
      return false;
    }
    // Convert start and end dates to Date objects and ensure proper order.
    const startDate = new Date(internshipStartDate);
    const endDate = new Date(internshipEndDate);
    if (startDate > endDate) {
      alert("Internship start date must be before the end date.");
      return false;
    }
    // Calculate working days between the two dates.
    // Weekends: Sundays are off, Saturdays are off unless workOnSaturday is true.
    let totalWorkingDays = 0;
    for (let dt = new Date(startDate); dt <= endDate; dt.setDate(dt.getDate() + 1)) {
      const dayOfWeek = dt.getDay(); // 0 = Sunday, 6 = Saturday
      if (dayOfWeek === 0) continue; // Skip Sundays
      if (dayOfWeek === 6 && !workOnSaturday) continue; // Skip Saturdays if not working
      totalWorkingDays++;
    }
    if ((totalWorkingDays - parseInt(workDays, 10)) < 20) {
      alert(
        `The total working days between the start and end date is ${totalWorkingDays- parseInt(workDays, 10)}, which is less than the required 20 days.`
      );
      return false;
    }

    // All validations passed
    return true;
  };
  
  const handleApplicationDownload = async () => {

    if (!validateApplicationFields()) {
      return;
    }

    const response = await fillApplicationForm(id ,internshipStartDate,internshipEndDate, internshipDuration, dutyNtitle, 
                                          workOnSaturday, question2, question3, workDays);
    alert(response.message)
    try {
      await downloadFile("Application Form", "ApplicationForm");
    } catch (error) {
      console.error('Download failed:', error);
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

  // Handler for the new Accept and Download button.
 

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
            <div className={styles.profileImage}>{/* Placeholder for profile image */}</div>
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
          <p className={styles.endDate}>3</p>
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
            <label>
              Enter number of work days:
              <input
                type="text"
                value={workDays}
                onChange={(e) => setWorkDays(e.target.value)}
              />
            </label>
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
            <button onClick={handleApplicationDownload} className={styles.downloadFile}>
            <FontAwesomeIcon icon={faFilePdf} /> Fill and Download Application Form <FaDownload />
            </button>
            
            <div className={styles.uploadFile} onClick={handleFileClick}>
              {selectedFileName ? (
                <>
                  <FontAwesomeIcon icon={faFilePdf} /> {selectedFileName}
                  <FaTrash className={styles.deleteIcon} onClick={handleDeleteFile} />
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faFilePdf} /> Upload Application Form <FaUpload /> 
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
            <button className={styles.acceptButton} onClick={handleAcceptApplication}>Accept</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyApplication;
