import React, { useState, useEffect } from 'react';
import { Link, useMatches, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, GraduationCap, Calendar, FileText, Download, Upload } from 'lucide-react';
import styles from './CompanyInternship.module.css';
import { getInternshipById } from '../../../api/CompanyApi/getInternshipAPI';
import Loading from '../../LoadingComponent/Loading';
import FileUploadSection from '../../StudentComponents/StudentInternship/components/FileUploadSection';
import { companyAPI } from '../../../services';
import { downloadApplicationForm } from '../../../api/CompanyApi/downloadApplicationFormAPI';

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
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getInternshipById(id);
        setInternship(data.internship);
        setApplication(data.internship.Application);
        setStudent(data.internship.Student);
        // Assuming documentId is always available for the preview
        setDocumentUrl(`${companyAPI.defaults.baseURL}/serveFile/${data.documentId}`);
      } catch (err) {
        console.error('Error fetching internship:', err);
        setError('Failed to load internship details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSendFeedback = () => {
    alert(`Feedback sent: ${feedback}`);
    setFeedback('');
  };

  const handleApprove = () => {
    alert('Internship approved!');
    console.log(internship);
    console.log(application);
    console.log(student);
  };

  const handleDownload = async () => {
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
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!internship || !application || !student) return <div className={styles.error}>No internship data available.</div>;

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
            <button className={styles.downloadBtn} onClick={handleDownload}>
              <Download size={16} />
              <span>Download Report</span>
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

        <div className={styles.feedbackSection}>
          <h3>Provide Feedback</h3>
          <textarea
            className={styles.feedbackInput}
            placeholder="Type your feedback for the student here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <button className={styles.sendFeedbackBtn} onClick={handleSendFeedback}>
            Send Feedback
          </button>
        </div>
      </div>

      <div className={styles.card1}>
        <h2 className={styles.sectionTitle}>Internship Status & Actions</h2>
        <div className={styles.statusSection}>
          {/* <h3>Status Overview</h3>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${internship.status.completion}%` }}></div>
            <span className={styles.progressText}>{internship.status.completion}%</span>
          </div> */}

          <div className={styles.coordinatorStatus}>
            <User className={styles.icon} />
            <span className={styles.label}>Coordinator Status:</span>
            <span className={styles.statusValue}>{internship.status?.coordinatorStatus || 'N/A'}</span>
          </div>
        </div>

        <div className={styles.uploadSection}>
          <h3>Company Form (Read-Only)</h3>
          <FileUploadSection
            // label={t("uploadSPR")}
            // uploadedFile={fileSPES}
            // onFileChange={setFileSPES}
            // onRemove={() => setFileSPES(null)}
            showQuestionMark={false}
            disabled={true}
            // You might want to pass a prop here if there's a file already uploaded for the company form
            // e.g., uploadedFile={internship.companyFormFile}
          />

          <button className={styles.approveBtn} onClick={handleApprove}>
            Approve Internship
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyInternship;