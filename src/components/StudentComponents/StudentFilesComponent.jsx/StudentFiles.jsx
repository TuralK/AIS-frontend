import React from 'react'
import { useEffect, useRef, useState } from "react";
import styles from './StudentFiles.module.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FaDownload, FaUpload, FaFile, FaTrash, FaFilePdf, FaRegFilePdf } from "react-icons/fa";
import { fetchStudentFiles } from '../../../api/StudentApi/fetchStudentFilesAPI';
import Loading from '../../LoadingComponent/Loading';
import { downloadEmploymentCertificate } from '../../../api/StudentApi/downloadEmploymentCertificateAPI';
import { uploadSpes } from '../../../api/StudentApi/uploadSpesAPI';

const StudentFiles = () => {
  const [loading, setLoading] = useState(true);

  const [employmentCertificateAvailable, setEmploymentCertificateAvailable] = useState(false); // change to true if certificate exists
  const [employmentCertificate, setEmploymentCertificate] = useState(null);
  const [score, setScore] = useState(null); // set a number if score is available

  const [selectedFileName, setSelectedFileName] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileClick = () => {
    document.getElementById("fileInput").click();
  };
  const handleDeleteFile = (e) => {
    e.stopPropagation();
    setSelectedFileName(null);
    setSelectedFile(null);
    document.getElementById("fileInput").value = "";
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      setSelectedFile(file)
    }
  };

  const handleDownloadSSI = () => {
    if (employmentCertificateAvailable) {
      downloadFile("Employment Certificate", "pdf");
    }
  };

  useEffect(() => {
    const fetchCertificate = async () => {
      // backend fetches files that match student id, but some "Employment Certificate"s' student id field is null
      const files = await fetchStudentFiles();
      const certificate = files.find(file => file.fileType == 'Employment Certificate');
      setEmploymentCertificate(certificate);
      if(certificate) {
        setEmploymentCertificateAvailable(true);
      }
      setLoading(false);
    };
  
    fetchCertificate();
  }, []);
  
  const downloadFile = async (fileDisplayName, fileType) => {
    try {
      const { blobData, contentType } = await downloadEmploymentCertificate();
      const fileBlob = new Blob([blobData], { type: contentType });
      const downloadUrl = window.URL.createObjectURL(fileBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", fileDisplayName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file.");
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
    
    try {
      const response = await uploadSpes(selectedFile);
      console.log("Upload successful:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  if (loading) {
    return (
        <Loading />
    )
  }

  return (
    <div className={styles.container}>

      {/* Part 1: Application Form and SSI Certificate */}
      <section className={styles.section}>
        <h2>Application Form</h2>
        <div className={styles.part}>
          {employmentCertificateAvailable ? 
          <button onClick={handleDownloadSSI} className={styles.downloadFile}>
            <FontAwesomeIcon icon={faFilePdf} /> Download SSI Certificate <FaDownload />
          </button>
         : 
          <button className={`${styles.downloadFile} ${styles.disabled}`}>
            <FontAwesomeIcon icon={faFilePdf} /> SSI Certificate is not available <FaDownload />
          </button>
        }
        </div>
        
      </section>

      {/* Part 2: Internship Files Upload */}
      <section className={styles.section}>
        <h2>Internship Files</h2>
        <div className={styles.spesSubmit}>
          <div className={styles.part}>
            <div className={styles.uploadFile} onClick={handleFileClick}>
              {selectedFileName ? (
                <>
                  <FontAwesomeIcon icon={faFilePdf} /> {selectedFileName}
                  <FaTrash className={styles.deleteIcon} onClick={handleDeleteFile} />
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faFilePdf} /> Upload SPES File <FaUpload /> 
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
          <button className={`${styles.spesSubmitButton} ${styles.part}`} onClick={uploadFile}>Submit</button>
        </div>
      </section>

      {/* Part 3: View Score */}
      <section className={styles.section}>
        <h2>Score</h2>
        <div className={styles.part}>
          {score !== null ? (
            <p>Your score: {score}</p>
          ) : (
            <p>Score is not available.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentFiles;