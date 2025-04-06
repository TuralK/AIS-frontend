import React, { useState } from 'react';
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
const NavigationTabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["About", "Experiences", "Certificates", "Skills"];
  return (
    <div className={styles.navTabsContainer}>
      <ul className={styles.navTabsList}>
        {tabs.map((tab, index) => (
          <li
            key={index}
            className={`${styles.navTabItem} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {/* Wrap the text in a span with a data-text attribute */}
            <span data-text={tab} className={styles.navTabLabel}>{tab}</span>
          </li>
        ))}
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
  const [activeTab, setActiveTab] = useState("About");

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

  // Random data for each tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "About":
        return (
          <div className={styles.tabContent}>
            <h2>About Me</h2>
            <p>
              I am a Computer Engineering student with a passion for coding, robotics, and AI. I enjoy tackling challenging projects and continuously learning new technologies.
            </p>
            <p>
              In my spare time, I like to explore nature, read tech blogs, and participate in hackathons.
            </p>
          </div>
        );
      case "Experiences":
        return (
          <div className={styles.tabContent}>
            <h2>Experiences</h2>
            <ul>
              <li>
                <strong>Software Developer Intern</strong> at Tech Innovations Inc. (Summer 2023)
                <p>Developed features for the company’s main application using React and Node.js.</p>
              </li>
              <li>
                <strong>Freelance Web Developer</strong> (2022 - Present)
                <p>Created responsive websites for various local businesses.</p>
              </li>
              <li>
                <strong>University Project</strong> (2021)
                <p>Led a team to develop an AI-driven chatbot for the campus portal.</p>
              </li>
            </ul>
          </div>
        );
      case "Certificates":
        return (
          <div className={styles.tabContent}>
            <h2>Certificates</h2>
            <ul>
              <li>
                <strong>Full Stack Web Development</strong> - Coursera (2023)
              </li>
              <li>
                <strong>Machine Learning Specialization</strong> - edX (2022)
              </li>
              <li>
                <strong>React & Redux Bootcamp</strong> - Udemy (2021)
              </li>
            </ul>
          </div>
        );
      case "Skills":
        return (
          <div className={styles.tabContent}>
            <h2>Skills</h2>
            <ul>
              <li>JavaScript / React</li>
              <li>Node.js / Express</li>
              <li>Python / Django</li>
              <li>Machine Learning</li>
              <li>UI/UX Design</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

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
          <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
