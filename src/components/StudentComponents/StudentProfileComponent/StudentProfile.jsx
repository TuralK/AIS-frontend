import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
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
const StarRating = ({ rating, isEditing, onRatingChange }) => {
  const totalStars = 5;

  const handleStarClick = (starValue) => {
    if (isEditing) {
      onRatingChange(starValue);
    }
  };

  return (
    <div
      className={styles.starRating}
      // Only attach the tooltip to the container if not in editing mode
      {...(!isEditing && { 'data-tooltip': starDescriptions[rating] })}
    >
      {Array.from({ length: totalStars }, (_, i) => {
        const starValue = i + 1;
        return (
          <span
            key={starValue}
            className={`${starValue <= rating ? styles.checkedStar : styles.uncheckedStar} ${isEditing ? "cursor-pointer" : ""}`}
            onClick={() => handleStarClick(starValue)}
            // When in editing mode, attach a tooltip for each star
            {...(isEditing && { title: starDescriptions[starValue] })}
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
const BioField = ({ label, value, isClickable, isEditing, onChange }) => {
  const renderValue = () => {
    if (isEditing) {
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(label, e.target.value)}
          className="w-full border-b border-gray-300 focus:outline-none focus:border-black mt-[1px] text-right"
        />
      );
    }

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

// Image Upload Component
const ImageUpload = ({ isProfilePic, currentImage, onImageChange, isEditing }) => {
  const fileInputRef = React.useRef(null);
  
  const handleClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageChange(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  return (
    <div 
      className={`relative ${isProfilePic ? "w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white shadow-md" : "w-full h-[360px]"}`}
      onClick={handleClick}
    >
      <img
        src={currentImage || (isProfilePic ? "/placeholder.svg?height=120&width=120" : "/placeholder.svg?height=360&width=1200")}
        alt={isProfilePic ? "Profile" : "Background"}
        className={`w-full h-full ${isProfilePic ? "object-cover" : "object-cover"}`}
      />
      
      {isEditing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
          <Pencil className="text-white" size={24} />
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState("About");
  const [isEditing, setIsEditing] = useState(false);

  const [profilePic, setProfilePic] = useState(ProfilePic);
  const [backgroundPic, setBackgroundPic] = useState(StudentBackgound);

  const [bioFields, setBioFields] = useState([
    { label: "Location", value: "Izmir, Turkiye", isClickable: true },
    { label: "Email", value: "turalk2004@gmail.com", isClickable: true },
    { label: "Phone", value: "+905342361551", isClickable: true },
    { label: "Website", value: "https://github.com/TuralK", isClickable: true }
  ]);

  const [languages, setLanguages] = useState([
    { name: "Turkish", rating: 5 },
    { name: "English", rating: 4 },
    { name: "Spanish", rating: 3 }
  ]);

  const [originalState, setOriginalState] = useState({
    profilePic,
    backgroundPic,
    bioFields: [...bioFields],
    languages: [...languages]
  });

  const handleEditToggle = () => {
    if (!isEditing) {
      // Starting to edit - save the current state
      setOriginalState({
        profilePic,
        backgroundPic,
        bioFields: JSON.parse(JSON.stringify(bioFields)),
        languages: JSON.parse(JSON.stringify(languages))
      });
      setIsEditing(true);
    } else {
      // Already editing - save changes
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    // Restore original state
    setProfilePic(originalState.profilePic);
    setBackgroundPic(originalState.backgroundPic);
    setBioFields(originalState.bioFields);
    setLanguages(originalState.languages);
    setIsEditing(false);
  };

  const handleBioFieldChange = (label, newValue) => {
    setBioFields(bioFields.map(field => 
      field.label === label ? { ...field, value: newValue } : field
    ));
  };

  const handleAddLanguage = () => {
    setLanguages([...languages, { name: "New Language", rating: 1 }]);
  };

  const handleLanguageRatingChange = (index, newRating) => {
    const updatedLanguages = [...languages];
    updatedLanguages[index].rating = newRating;
    setLanguages(updatedLanguages);
  };

  const handleRemoveLanguage = (index) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const handleLanguageNameChange = (index, newName) => {
    const updatedLanguages = [...languages];
    updatedLanguages[index].name = newName;
    setLanguages(updatedLanguages);
  };

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
        {/* <img
          className={styles.studentProfileBackgroundPic}
          src={StudentBackgound}
          alt="Student Background"
        /> */}
         <ImageUpload 
          isProfilePic={false} 
          currentImage={backgroundPic} 
          onImageChange={setBackgroundPic}
          isEditing={isEditing}
        />
      </div>
      <div className={styles.studentProfileContent}>
        <div className={styles.studentProfileInfoBox}>
          {/* <div className={styles.studentProfileImageContainer}> */}
            {/* <img
              className={styles.studentProfilePic}
              src={ProfilePic}
              alt="Profile"
            /> */}
            <ImageUpload 
            isProfilePic={true} 
            currentImage={profilePic} 
            onImageChange={setProfilePic}
            isEditing={isEditing}
          />
          {/* </div> */}
          <h1 className={styles.studentProfileTitle}>Tural Karimli</h1>
          <p className={styles.studentProfileSubtitle}>Computer Engineering Student</p>
          {/* <h1 className="text-xl font-semibold text-center mb-1">Tural Karimli</h1>
          <p className="text-sm text-gray-600 text-center mb-5">Computer Engineering Student</p> */}


          {isEditing ? (
            <div className="flex space-x-2 mb-5">
              <button 
                className="flex-1 py-2.5 bg-black text-white font-medium cursor-pointer mb-2.5"
                onClick={handleEditToggle}
              >
                Save
              </button>
              <button 
                className="flex-1 py-2.5 bg-gray-200 text-gray-800 font-medium cursor-pointer mb-2.5"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button 
              className="w-full py-2.5 bg-black text-white font-medium cursor-pointer mb-5"
              onClick={handleEditToggle}
            >
              Edit Details
            </button>
          )}
          {/* <button className={styles.studentInfoEditButton} onClick={handleEditToggle}>Edit Details</button> */}


          <div className={styles.studentBioContainer}>
            {bioFields.map((field, index) => (
              <BioField key={index} {...field} isEditing={isEditing} onChange={handleBioFieldChange}/>
            ))}
          </div>
          {/* Languages Section */}
          <div className={styles.languagesContainer}>
            <h2 className={styles.studentBioFieldLabel}>Languages</h2>
            {languages.map((lang, index) => (
              <div key={index} className={styles.languageField}>
                {isEditing ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={lang.name}
                      onChange={(e) => handleLanguageNameChange(index, e.target.value)}
                      className="border-b border-gray-300 focus:outline-none focus:border-black mr-2 font-medium mt-[1px]"
                    />
                    <button 
                      onClick={() => handleRemoveLanguage(index)}
                      className="text-red-500 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <p className="font-medium">{lang.name}</p>
                )}
                {/* <p className={styles.languageName}>{lang.name}</p> */}
                <StarRating rating={lang.rating} isEditing={isEditing} onRatingChange={(newRating) => handleLanguageRatingChange(index, newRating)}/>
              </div>
            ))}
            {isEditing && (
              <button 
                onClick={handleAddLanguage}
                className="mt-3 text-sm text-blue-600 hover:underline"
              >
                + Add Language
              </button>
            )}
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
