import React from 'react'
import { useEffect, useRef, useState } from "react";
import styles from './StudentFiles.module.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FaDownload, FaUpload, FaFile, FaTrash, FaFilePdf, FaRegFilePdf } from "react-icons/fa";

const StudentFiles = () => {
  // Simulated state for demonstration
  const [ssiAvailable, setSsiAvailable] = useState(false); // change to true if certificate exists
  const [score, setScore] = useState(null); // set a number if score is available

  const [applicationFile, setApplicationFile] = useState(null);
  const [sprFile, setSprFile] = useState(null);
  const [cfFile, setCfFile] = useState(null);
  const [spesFile, setSpesFile] = useState(null);

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


  const handleApplicationUpload = (e) => {
    setApplicationFile(e.target.files[0]);
    // Implement your file upload logic here
  };

  const handleSPRUpload = (e) => {
    setSprFile(e.target.files[0]);
    // Implement your file upload logic here
  };

  const handleCFUpload = (e) => {
    setCfFile(e.target.files[0]);
    // Implement your file upload logic here
  };

  const handleSPESUpload = (e) => {
    setSpesFile(e.target.files[0]);
    // Implement your file upload logic here
  };

  const handleDownloadSSI = () => {
    if (ssiAvailable) {
      // Replace this with actual download logic
      alert('Downloading SSI Certificate...');
    }
  };

  return (
    <div className={styles.container}>

      {/* Part 1: Application Form and SSI Certificate */}
      <section className={styles.section}>
        <h2>Application Form</h2>
        <div className={styles.part}>
          <label htmlFor="spesUpload">Upload SPES:</label>
            <input 
              type="file" 
              id="spesUpload" 
              onChange={handleSPESUpload}
              className={styles.fileInput}
            />
          
          {/* <div className={styles.uploadFile} onClick={handleFileClick}>
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
          /> */}
        </div>
        <div className={styles.part}>
          {ssiAvailable ? 
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
        <div className={styles.part}>
          <label htmlFor="spesUpload">Upload SPES:</label>
          <input 
            type="file" 
            id="spesUpload" 
            onChange={handleSPESUpload}
            className={styles.fileInput}
          />
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
