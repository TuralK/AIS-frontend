import React, { useState, useEffect } from 'react'
import { useMatches, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, GraduationCap, Calendar, FileText, Download, Upload } from "lucide-react"
import styles from './CompanyInternship.module.css'
import { getInternship } from '../../../api/CompanyApi/getInternshipAPI';
import Loading from '../../LoadingComponent/Loading';
import FileUploadSection from '../../StudentComponents/StudentInternship/components/FileUploadSection';

const CompanyInternship = () => {
  const { id } = useParams();

  const matches = useMatches();
  const { t, i18n } = useTranslation();
  const currentMatch = matches[matches.length - 1];
  const titleKey = currentMatch?.handle?.titleKey;

  React.useEffect(() => {
    const baseTitle = 'IMS';
    document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle;
  }, [titleKey, t]);

  const [internship, setInternship] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);

  const getInternship = async (id) => {
  // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      student: {
      name: "Elif Yılmaz",
      internshipTitle: "Software Engineering Intern",
      endDate: "12.07.2024",
      reportPreview: "/placeholder.svg?height=150&width=150",
      },
      status: {
      completion: 72,
      coordinatorStatus: "Pending Approval",
      },
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
          const data = await getInternship(id)
          setInternship(data)
      } catch (error) {
          console.error("Error fetching internship:", error)
      } finally {
          setLoading(false)
      }
    }
    fetchData();
  }, [])

  const handleSendFeedback = () => {
    alert(`Feedback sent: ${feedback}`)
    setFeedback("")
  }

  const handleApprove = () => {
    alert("Internship approved!")
  }

  if(loading) return <Loading />

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.infoItem}>
          <User className={styles.icon} />
          <span className={styles.label}>Student Name:</span>
          <span className={styles.value}>{internship.student.name}</span>
        </div>

        <div className={styles.infoItem}>
          <GraduationCap className={styles.icon} />
          <span className={styles.label}>Internship Title:</span>
          <span className={styles.value}>{internship.student.internshipTitle}</span>
        </div>

        <div className={styles.infoItem}>
          <Calendar className={styles.icon} />
          <span className={styles.label}>End Date:</span>
          <span className={styles.value}>{internship.student.endDate}</span>
        </div>

        <div className={styles.infoItem}>
          <FileText className={styles.icon} />
          <span className={styles.label}>Practice Report Preview</span>
          <button className={styles.downloadBtn}>
            <Download size={16} />
            <span>Download</span>
          </button>
        </div>

        <div className={styles.previewContainer}>
          <img
            src={internship.student.reportPreview || "/placeholder.svg"}
            alt="Report preview"
            className={styles.previewImage}
          />
          <span className={styles.previewLabel}>Preview Only</span>
        </div>

        <div className={styles.feedbackSection}>
          <h3>Feedback</h3>
          <textarea
            className={styles.feedbackInput}
            placeholder="Type your feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <button className={styles.sendFeedbackBtn} onClick={handleSendFeedback}>
            Send Feedback
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.statusSection}>
          <h3>Status</h3>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${internship.status.completion}%` }}></div>
            <span className={styles.progressText}>{internship.status.completion}%</span>
          </div>

          <div className={styles.coordinatorStatus}>
            <User className={styles.icon} />
            <span className={styles.label}>Coordinator Status:</span>
            <span className={styles.statusValue}>{internship.status.coordinatorStatus}</span>
          </div>
        </div>

        <div className={styles.uploadSection}>
          <h3>Staj Değerlendirme Anketini Yükle</h3> {/*CompanyForm*/}
          <FileUploadSection 
            label={t("uploadSPR")}
            // uploadedFile={fileSPES}
            // onFileChange={setFileSPES}
            // onRemove={() => setFileSPES(null)}
            showQuestionMark={true}
            disabled={true}
          />

          <button className={styles.approveBtn} onClick={handleApprove}>
            Approve
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompanyInternship