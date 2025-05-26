import React, { useState, useEffect } from 'react';
import { Link, useMatches, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, GraduationCap, Calendar, FileText, Download, Upload, Building, CheckCircle, Loader2 } from 'lucide-react';
import styles from './CompanyInternship.module.css';
import { getInternshipById } from '../../../api/CompanyApi/getInternshipAPI';
import Loading from '../../LoadingComponent/Loading';
import FileUploadSection from '../../StudentComponents/StudentInternship/components/FileUploadSection';
import { companyAPI } from '../../../services';
import { downloadApplicationForm } from '../../../api/CompanyApi/downloadApplicationFormAPI';
import { evaluateInternship } from '../../../api/CompanyApi/evaluateInternshipAPI';
import { uploadCompanyForm } from '../../../api/CompanyApi/uploadCompanyFormAPI';
import { set } from 'react-hook-form';
import downloadTemplateFile from "../../../api/downloadTemplateFilesApi";

const CompanyInternship = () => {
  const { id } = useParams();
  const matches = useMatches();
  const { t, i18n } = useTranslation();
  const currentMatch = matches[matches.length - 1];
  const titleKey = currentMatch?.handle?.titleKey;

  useEffect(() => {
    const baseTitle = 'IMS';
    document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle;
  }, [titleKey, t]);

  const [internship, setInternship] = useState(null);
  const [application, setApplication] = useState(null);
  const [student, setStudent] = useState(null);
  const [documentUrl, setDocumentUrl] = useState('');
  const [companyFormFile, setCompanyFormFile] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [feedbackToStudent, setFeedbackToStudent] = useState([]);
  const [feedbackFromAdmin, setFeedbackFromAdmin] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canReject, setCanReject] = useState(false);
  const [canAccept, setCanAccept] = useState(true);

  const [isDownloading, setIsDownloading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [showRejectFeedback, setShowRejectFeedback] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInternshipById(id);
        setInternship(data.internship);
        setApplication(data.internship.Application ? data.internship.Application : null);
        setStudent(data.internship.Student);
        setFeedbackToStudent(data.latestStudentFeedbacks || []);
        setFeedbackFromAdmin(data.latestCompanyFeedbacks || []);
        // Assuming documentId is always available for the preview
        setDocumentUrl(data.documentId ? `${companyAPI.defaults.baseURL}/serveFile/${data.documentId}` : '');
      } catch (err) {
        console.error('Error fetching internship:', err);
        setError('Failed to load internship details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleReject = async () => {
    let payload = {};
    if (!feedback.trim()) {
      alert('Feedback is required for rejection.');
      return;
    }
    setIsRejecting(true);
    try {
      payload.status = "FeedbackToStudent";
      payload.feedbackToStudent = feedback;
      await evaluateInternship(internship.id, payload);
      setFeedbackToStudent((prev) => [
        ...prev,
        {
          id: Date.now(),
          content: feedback,
          createdAt	: new Date().toISOString(),
        },
      ]);
      alert(`Rejection sent with feedback.`);
      setFeedback('');
      setShowRejectFeedback(false);
      setCanReject(false);
      setCanAccept(false);
      setCompanyFormFile(null);
    } catch (err) {
      console.error('Error rejecting internship:', err);
      alert('Failed to send rejection. Please try again.');
    } finally {
      setIsRejecting(false);
    }
  };

  const handleApprove = async () => {
    setIsApproving(true);
    let payload = {};
    try {
      payload.status = "Approved";
      await evaluateInternship(internship.id, payload);
      const formData = new FormData();
      formData.append('CompanyForm', companyFormFile);
      await uploadCompanyForm(internship.id, formData);
      setFeedback('');
      setShowRejectFeedback(false);
      setCanReject(false);
      setCanAccept(false);
      setCompanyFormFile(null);
      alert('Internship approved!');
    } catch(err) {
      console.error('Error approving internship:', err);
      alert('Failed to approve internship. Please try again.');
    } finally {
      setIsApproving(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (!application?.id) {
        alert('No application found to download.');
        return;
      }

      const { blobData, contentType } = await downloadApplicationForm(
        application.id,
        'Report'
      );

      const url = window.URL.createObjectURL(new Blob([blobData], { type: contentType }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Report_${application.Announcement?.announcementName || 'document'}.pdf`);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download document. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const getStudentStatusMessage = () => {
    const { studentStatus, feedbackContextStudent, companyStatus } = internship;

    switch (studentStatus) {
      case 1:
        return "The student has uploaded their report.";
      case 3:
        if (["Report", "Both"].includes(feedbackContextStudent) || (companyStatus === 1 || companyStatus === 3)) {
          return "The student's report has been approved.";
        } else {
          return "The student has uploaded their report.";
        }
      case 4:
        if (feedbackContextStudent === "SurveyMissing") {
          return "The student has updated their report.";
        } else if (["Report", "Both", "ReportMissing"].includes(feedbackContextStudent)) {
          return "Awaiting report update from the student after admin feedback.";
        }
        break;
      case 5:
        return "Awaiting report update from the student after feedback.";
      case 6:
        if (feedbackContextStudent === "SurveyMissing") {
          return "The student's report has been approved.";
        } else if (["Report", "Both"].includes(feedbackContextStudent)) {
          return "The student has updated their report.";
        }
        break;
      case 7:
        return "The student has updated their report.";
      default:
        return null;
    }
  };

  const getCompanyStatusMessage = () => {
    switch (internship?.companyStatus) {
      case 0:
        return "You have not yet approved the student's report.";
      case 1:
        return "You have approved the student's report.";
      case 2:
        return "You have uploaded the company form.";
      case 3:
        return "You have approved the report and uploaded the company form.";
      case 4:
        return "The admin has requested changes to the submission.";
      default:
        return null;
    }
  };

  const canGiveFeedback = () => {
    const { studentStatus, feedbackContextStudent, companyStatus } = internship;
    if (companyStatus === 3 || companyStatus === 5) {
      return false;
    }
    switch (studentStatus) {
      case 1:
        return true;
      case 3:
        if (["Report", "Both"].includes(feedbackContextStudent) || companyStatus === 1) {
          return false;
        } else {
          return true;
        }
      case 4:
        if (feedbackContextStudent === "Report" || feedbackContextStudent === "Both" || feedbackContextStudent === "ReportMissing") {
          return false;
        } else if (feedbackContextStudent === "SurveyMissing") {
          return true;
        }
        break;
      case 5:
        return false;
      case 6:
        if (feedbackContextStudent === "Report" || feedbackContextStudent === "Both") {
          return true;
        } else if (feedbackContextStudent === "SurveyMissing") {
          return false;
        }
        break;
      case 7:
        return true;
      default:
        return false;
    }
  };

  const canApprove = () => {
    const { studentStatus, companyStatus, feedbackContextStudent } = internship;
    if (companyStatus === 3 || companyStatus === 5) {
      return false;
    } else {
      switch (studentStatus) {
        case 1:
          return true;
        case 3:
          if (["Report", "Both"].includes(feedbackContextStudent)) {
            return false;
          } else {
            return true;
          }
        case 4:
          if (feedbackContextStudent === "Report" || feedbackContextStudent === "Both" || feedbackContextStudent === "ReportMissing") {
            return false;
          } else if (feedbackContextStudent === "SurveyMissing") {
            return true;
          }
          break;
        case 5:
          return false;
        case 6:
          if (feedbackContextStudent === "Report" || feedbackContextStudent === "Both") {
            return true;
          } else if (feedbackContextStudent === "SurveyMissing") {
            return false;
          }
          break;
        case 7:
          return true;
        default:
          return false;
      }
    }
  };

   const handleTemplateDownload = async (fileName) => {
    try {
      const result = await downloadTemplateFile(companyAPI.defaults.baseURL, fileName);

      if (result.success) {
        
      } else {
        showAlert(result.message || t("templateDownloadFailed"));
        console.error(result.message);
      }
    } catch (error) {
      showAlert(t("templateDownloadFailed"));
      console.error('Download error:', error);
    }
  };

  if (loading) return <Loading />;
  if (!internship || !application || !student) return <div className={styles.error}>No internship data available.</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Internship Details</h2>
        <div className={styles.infoItem}>
          <User className={styles.icon} />
          <span className={styles.label}>Student Name:</span>
          <Link to={`/company/student-profile/${student.id}`} className={styles.valueLink}>
            {student.username}
          </Link>
        </div>

        <div className={styles.infoItem}>
          <GraduationCap className={styles.icon} />
          <span className={styles.label}>Announcement Title:</span>
          <span className={styles.value}>{application.Announcement?.announcementName || 'N/A'}</span>
          {/* <Link
            to={`/announcement/${application.Announcement.id}`}
            className={styles.valueLink}
          >
            {application.Announcement.announcementName}
          </Link> */}
        </div>

        <div className={styles.documentSection}>
          <div className={styles.infoItem}>
            <FileText className={styles.icon} />
            <span className={styles.label}>Practice Report Preview:</span>
            <button 
              className={styles.downloadBtn} 
              onClick={handleDownload} 
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className={styles.spinner} size={16} /> <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Download Report</span>
                </>
              )}
            </button>
          </div>
          <div className={styles.documentPreview}>
            {documentUrl ? (
              <iframe src={documentUrl} className={styles.pdfViewer} title="Document Preview"></iframe>
            ) : (
              <div className={styles.noPreview}>No document to preview.</div>
            )}
            <span className={styles.previewLabel}>Preview Only</span>
          </div>
        </div>
        {!showRejectFeedback && (
          <button 
            className={styles.rejectBtn}
            disabled={!canGiveFeedback() || !canReject }
            onClick={() => setShowRejectFeedback(true)}
          >
            Reject Report
          </button>
        )}
        {showRejectFeedback && (
          <div className={styles.feedbackSection}>
            <h3>Provide Feedback for Rejection</h3>
            <textarea
              className={styles.feedbackInput}
              placeholder={(canGiveFeedback() || canReject)
              ? "Type your feedback for the student here..." 
              : "Feedback disabled - awaiting student/company action"}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              disabled={!canGiveFeedback() || !canReject}
              required
            />
            <button
              className={styles.rejectWithFeedbackBtn}
              onClick={handleReject}
              disabled={!feedback.trim() || isRejecting || !canGiveFeedback() || !canReject}
            >
              {isRejecting ? (
                <>
                  <Loader2 className={styles.spinner} size={16} /> Sending...
                </>
              ) : (
                'Reject with Feedback'
              )}
            </button>
          </div>
        )} 
        {feedbackToStudent.length > 0 && (
          <div className={styles.feedbackSection}>
            <h3>Feedback Sent to Student</h3>
            {[...feedbackToStudent]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((feedback) => (
              <div key={feedback.id} className={styles.feedbackItem}>
                <p>{feedback.content}</p>
                <span className={styles.feedbackDate}>
                  {new Date(feedback.createdAt).toLocaleDateString(i18n.language, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            ))}
          </div>
        )}

        {feedbackFromAdmin.length > 0 && (
          <div className={styles.feedbackSection}>
            <h3>Feedback from Administration</h3>
            {[...feedbackFromAdmin]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((feedback) => (
              <div key={feedback.id} className={styles.feedbackItem}>
                <p>{feedback.content}</p>
                <span className={styles.feedbackDate}>
                  {new Date(feedback.createdAt).toLocaleDateString(i18n.language, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.card1}>
        <div className={styles.statusSection}>
          <h2 className={styles.sectionTitle}>Internship Status & Actions</h2>

          <div className={styles.coordinatorStatus}>
            <User className={styles.icon} />
            <span className={styles.label}>Student's Status:</span>
            <span className={styles.statusValue}>
              {getStudentStatusMessage() || 'N/A'}
            </span>
          </div>
          <div className={styles.coordinatorStatus}>
            <Building className={styles.icon} />
            <span className={styles.label}>Your Status:</span>
            <span className={styles.statusValue}>
              {getCompanyStatusMessage() || 'N/A'}
            </span>
          </div>
        </div>

        <div className={styles.uploadSection}>
          <FileUploadSection
            label={"Company Form"}
            uploadedFile={companyFormFile}
            onFileChange={setCompanyFormFile}
            onRemove={() => setCompanyFormFile(null)}
            showQuestionMark={false}
            disabled={!canApprove() || !canAccept}
            showDownloadButton={true}
            downloadTooltip={t("downloadSPESTemplate")}
            onDownload={() => handleTemplateDownload('SummerPracticeCompanyFormTemplate.docx')}
          />

          <button 
            className={styles.approveBtn} 
            onClick={handleApprove}
            disabled={!canApprove() || isApproving || !canAccept}
          >
            {isApproving ? (
                <>
                  <Loader2 className={styles.spinner} size={16} /> Submitting Form...
                </>
              ) : (
                'Approve Internship & Submit Form'
              )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyInternship;