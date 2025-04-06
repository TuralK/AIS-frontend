import React from 'react';
import styles from "./StudentProfile.module.css";
import StudentBackgound from "../../../assets/student_background.webp";
import ProfilePic from "../../../assets/profile_pic.png";

// Mapping for star descriptions (if needed for tooltips or additional info)
const starDescriptions = {
  1: "Beginner",
  2: "Novice",
  3: "Intermediate",
  4: "Proficient",
  5: "Advanced"
};

// StarRating component renders 5 stars based on the rating
const StarRating = ({ rating }) => {
  const totalStars = 5;
  return (
    <div
      className={styles.starRating}
      data-tooltip={starDescriptions[rating]} // Attach tooltip text to container
    >
      {Array.from({ length: totalStars }, (_, i) => {
        const starValue = i + 1;
        return (
          <span
            key={starValue}
            className={starValue <= rating ? styles.checkedStar : styles.uncheckedStar}
          >
            &#9733;
          </span>
        );
      })}
    </div>
  );
};

// Navigation Tabs
const NavigationTabs = () => {
  return (
    <div className={styles.navTabsContainer}>
      <ul className={styles.navTabsList}>
        <li className={styles.navTabItem}>About</li>
        <li className={styles.navTabItem}>Experiences</li>
        <li className={styles.navTabItem}>Certificates</li>
        <li className={styles.navTabItem}>Skills</li>
      </ul>
    </div>
  );
};
  

// BioField component to handle the clickable/non-clickable fields
const BioField = ({ label, value, isClickable }) => {
  const renderValue = () => {
    if (!isClickable) return value;
    switch (label) {
      case "Email":
        return <a href={`mailto:${value}`}>{value}</a>;
      case "Website":
        return (
          <a href={value} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        );
      case "Phone Number":
        return <a href={`tel:${value}`}>{value}</a>;
      case "Location":
        return (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {value}
          </a>
        );
      default:
        return value;
    }
  };

  return (
    <div className={styles.studentBioField}>
      <p className={styles.studentBioFieldLabel}>{label}</p>
      <p className={isClickable ? styles.studentBioFieldClickable : ''}>
        {renderValue()}
      </p>
    </div>
  );
};

const StudentProfile = () => {
  const bioFields = [
    { label: "Location", value: "Izmir, Turkiye", isClickable: true },
    { label: "Email", value: "turalk2004@gmail.com", isClickable: true },
    { label: "Phone Number", value: "+905342361551", isClickable: true },
    { label: "Website", value: "https://github.com/TuralK", isClickable: true }
  ];

  const languages = [
    { name: "Turkish", rating: 5 },
    { name: "English", rating: 4 },
    { name: "Spanish", rating: 3 }
  ];

  return (
    <div className={styles.studentProfileContainer}>
      <div className={styles.studentProfileBackgroundContainer}>
        <img
          className={styles.studentProfileBackgroundPic}
          src={StudentBackgound}
          alt="Student Background"
        />
      </div>
      <div className={styles.studentProfileContent}>
        <div className={styles.studentProfileInfoBox}>
          <div className={styles.studentProfileImageContainer}>
            <img
              className={styles.studentProfilePic}
              src={ProfilePic}
              alt="Profile"
            />
          </div>
          <h1 className={styles.studentProfileTitle}>Tural Karimli</h1>
          <p className={styles.studentProfileSubtitle}>Computer Engineering Student</p>
          <button className={styles.studentInfoEditButton}>Edit Details</button>
          <div className={styles.studentBioContainer}>
            {bioFields.map((field, index) => (
              <BioField key={index} {...field} />
            ))}
          </div>
          {/* Languages Section */}
          <div className={styles.languagesContainer}>
            <h2 className={styles.studentBioFieldLabel}>Languages</h2>
            {languages.map((lang, index) => (
              <div key={index} className={styles.languageField}>
                <p className={styles.languageName}>{lang.name}</p>
                <StarRating rating={lang.rating} />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.studentProfileNavTabsContainer}>
            <NavigationTabs />
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
