import { useEffect, useRef, useState } from "react";
import { fetchApplication } from "../../../api/CompanyApi/fetchApplicationAPI";
import styles from "./CompanyApplication.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { faUpRightAndDownLeftFromCenter } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import Loading from "../../LoadingComponent/Loading";
import axios from "axios";

const CompanyApplication = () => {
  const [application, setApplication] = useState(null);
  const [documentUrl, setDocumentUrl] = useState("");
  const [documentId, setDocumentId] = useState(-1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { id } = useParams();

  // New state to show extra fields and store their values
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [internshipDuration, setInternshipDuration] = useState("");
  const [dutyNtitle, setDuty] = useState("");
  const [workOnSaturday, setWorkOnSaturday] = useState(null);
  const [question2, setQuestion2] = useState(null);
  const [question3, setQuestion3] = useState(null);

  // New states for the additional internship dates
  const [internshipStartDate, setInternshipStartDate] = useState("");
  const [internshipEndDate, setInternshipEndDate] = useState("");

  // New state for "Enter number of work days:" input
  const [workDays, setWorkDays] = useState("0");

  // Create a ref for the extra fields container
  const extraFieldsRef = useRef(null);

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
      } catch (error) {
        console.error("Error fetching application:", error);
      }
    };

    getApplication();
  }, [id]);

  const handleDownload = () => {
    window.location.href = `http://localhost:3005/downloadFile/${documentId}`;
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
 

const handleAcceptAndDownload = async () => {
  try {
    const payload = {
      internStartDate: internshipStartDate,
      internEndDate: internshipEndDate,
      internDuration: internshipDuration,
      dutyAndTitle: dutyNtitle,
      workOnSaturday: workOnSaturday,
      workOnHoliday: question2,
      day: question2 === "yes" ? workDays : "0",
      sgk: question3,
    };

    await axios.post(
      `http://localhost:3005/applications/${id}/fillApplicationForm`,
      payload,
      {
        withCredentials: true,
      }
    );

    // Trigger file download after successful form submission.
    window.location.href = `http://localhost:3005/applications/download/${id}/Application Form`;
  } catch (error) {
    console.error("Error in handleAcceptAndDownload:", error);
  }
};


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!application) return <Loading />;

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
        <button className={styles.rejectButton}>Reject</button>
        {/* Only show the original Accept button if extra fields are not yet visible */}
        {!showExtraFields && (
          <button
            className={styles.acceptButton}
            onClick={() => setShowExtraFields(true)}
          >
            Accept
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

          <button onClick={handleAcceptAndDownload} className={styles.acceptDownloadButton}>
            Accept and Download
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyApplication;
