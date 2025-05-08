import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';import { IoReturnUpBackSharp } from "react-icons/io5";

const NotFound = ({ homeRoute = '/' }) => {
  return (
    <div className={styles.background}>
      <div className={styles.formContainer}>
        <div className={styles.formTop}>
          <br/>
          <div className={styles.formTopMiddle}>
            <h1 className={styles.header}>404 - Page Not Found</h1>
          </div>
          <hr className={styles.formLine} />
          <div className={styles.pageName}>Sorry, the page you're looking for doesn't exist.</div>
          <br/>
          <br/>
          <Link to={homeRoute} className={styles.homeButton}>
            <span className={styles.homeIcon}><i class="fa-solid fa-house" className={styles.notFoundHomeIcon}></i> Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
