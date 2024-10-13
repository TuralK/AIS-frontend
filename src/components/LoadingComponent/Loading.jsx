import React from 'react';
import styles from './Loading.module.css';
import IYTElogo from "../../assets/iyte_logo_eng.png"

const Loading = () => {
  return (
    <div className={styles.container}>
      <img src={IYTElogo} alt="Loading" className={styles.logo} />
      <div className={styles.spinner}></div>
    </div>
  );
}

export default Loading;

/*
import styles from './Loading.module.css'

export default function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.logoContainer}>
        <img
          src="https://bhib.iyte.edu.tr/wp-content/uploads/sites/115/2018/09/iyte_logo-eng.png"
          alt="IYTE Logo"
          className={styles.logo}
        />
      </div>
      <div className={styles.circle1}></div>
      <div className={styles.circle2}></div>
      <div className={styles.circle3}></div>
    </div>
  )
}
  */