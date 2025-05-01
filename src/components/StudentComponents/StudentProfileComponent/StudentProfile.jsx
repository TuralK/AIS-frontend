import React, { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import styles from "./StudentProfile.module.css";
import StudentBackgound from "../../../assets/student_default_bg1.jpg";
import ProfilePic from "../../../assets/profile_pic.png";
import { fetchStudentProfile } from '../../../api/StudentApi/fetchStudentProfileAPI';
import Loading from '../../LoadingComponent/Loading';

const starDescriptions = {
  1: "Beginner",
  2: "Novice",
  3: "Intermediate",
  4: "Proficient",
  5: "Advanced"
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

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
      {...(!isEditing && { 'data-tooltip': starDescriptions[rating] })}
    >
      {Array.from({ length: totalStars }, (_, i) => {
        const starValue = i + 1;
        return (
          <span
            key={starValue}
            className={`${starValue <= rating ? styles.checkedStar : styles.uncheckedStar} ${isEditing ? "cursor-pointer" : ""}`}
            onClick={() => handleStarClick(starValue)}
            {...(isEditing && { title: starDescriptions[starValue] })}
          >
            &#9733;
          </span>
        );
      })}
    </div>
  );
};


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
            <span data-text={tab} className={styles.navTabLabel}>{tab}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
  

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

  // new state slices for editable tabs
  const [aboutText, setAboutText] = useState("");
  const [experiences, setExperiences] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [skillsList, setSkillsList] = useState([]);

  // for restoring on Cancel
  const [originalState, setOriginalState] = useState({});

  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add a blank skill to an experience
  const addSkillToExp = idx => {
    const ex = [...experiences];
    ex[idx].skills = ex[idx].skills || [];
    ex[idx].skills.push({ name: "" });
    setExperiences(ex);
  };

  // Update one skill’s name
  const updateExpSkill = (expIdx, skillIdx, value) => {
    const ex = [...experiences];
    ex[expIdx].skills[skillIdx].name = value;
    setExperiences(ex);
  };

  // Remove one skill from an experience
  const removeExpSkill = (expIdx, skillIdx) => {
    const ex = [...experiences];
    ex[expIdx].skills.splice(skillIdx, 1);
    setExperiences(ex);
  };

  useEffect(() => {
    fetchStudentProfile()
      .then(fetched => {
        setStudentData(fetched);
        // initialize all editing state from fetched data:
        setAboutText(fetched.bio || "");
        setExperiences(fetched.experiences || []);
        setCertificates(fetched.certificates || []);
        setSkillsList(fetched.skills.map(s => s.name) || []);
      })
      .finally(() => setLoading(false))
      .catch(err => console.error(err));
  }, []);

  const handleEditToggle = () => {
    if (!isEditing) {
      // save originals for cancel
      setOriginalState({
        profilePic,
        backgroundPic,
        bioFields: JSON.parse(JSON.stringify(bioFields)),
        languages: JSON.parse(JSON.stringify(languages)),
        aboutText,
        experiences: JSON.parse(JSON.stringify(experiences)),
        certificates: JSON.parse(JSON.stringify(certificates)),
        skillsList: JSON.parse(JSON.stringify(skillsList))
      });
      setIsEditing(true);
    } else {
      // here you could call an API to save `aboutText`, `experiences`, etc.
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    const orig = originalState;
    setProfilePic(orig.profilePic);
    setBackgroundPic(orig.backgroundPic);
    setBioFields(orig.bioFields);
    setLanguages(orig.languages);
    setAboutText(orig.aboutText);
    setExperiences(orig.experiences);
    setCertificates(orig.certificates);
    setSkillsList(orig.skillsList);
    setIsEditing(false);
  };

  // handlers for dynamic lists
  const addExperience = () => setExperiences([
    ...experiences,
    { id: Date.now(), pos: "", company: "", startDate: "", endDate: "", description: "", skills: [] }
  ]);
  const updateExperience = (idx, field, value) => {
    const ex = [...experiences];
    ex[idx][field] = value;
    setExperiences(ex);
  };
  const removeExperience = idx => setExperiences(experiences.filter((_, i) => i !== idx));

  const addCertificate = () => setCertificates([
    ...certificates,
    { id: Date.now(), title: "", issuingOrganization: "", issueDate: "", expirationDate: "" }
  ]);
  const updateCertificate = (idx, field, value) => {
    const certs = [...certificates];
    certs[idx][field] = value;
    setCertificates(certs);
  };
  const removeCertificate = idx => setCertificates(certificates.filter((_, i) => i !== idx));

  const addSkill = () => setSkillsList([...skillsList, ""]);
  const updateSkill = (idx, value) => {
    const list = [...skillsList];
    list[idx] = value;
    setSkillsList(list);
  };
  const removeSkill = idx => setSkillsList(skillsList.filter((_, i) => i !== idx));

  if (loading) return <Loading />;

  const renderTabContent = () => {
    if (!studentData) return null;
    switch (activeTab) {
      case "About":
        return (
          <div className={styles.tabContent}>
            <h2>About Me</h2>
            {isEditing
              ? (
                <textarea
                  value={aboutText}
                  onChange={e => setAboutText(e.target.value)}
                  className="w-full border p-2"
                  rows={6}
                />
              )
              : <p>{aboutText}</p>
            }
          </div>
        );

        case "Experiences":
        return (
          <div className={styles.tabContent}>
            <h2>Experiences</h2>
            {experiences.map((exp, idx) => (
              <div key={exp.id} className="mb-6 border-b pb-4">
                {isEditing ? (
                  <>
                    {/* Position / Company / Dates */}
                    <input
                      type="text"
                      placeholder="Position"
                      value={exp.pos}
                      onChange={e => updateExperience(idx, "pos", e.target.value)}
                      className="w-full mb-1 border-b"
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={e => updateExperience(idx, "company", e.target.value)}
                      className="w-full mb-1 border-b"
                    />
                    <div className="flex space-x-2 mb-1">
                      <input
                        type="date"
                        value={exp.startDate}
                        onChange={e => updateExperience(idx, "startDate", e.target.value)}
                        className="flex-1 border-b"
                      />
                      <input
                        type="date"
                        value={exp.endDate}
                        onChange={e => updateExperience(idx, "endDate", e.target.value)}
                        className="flex-1 border-b"
                      />
                    </div>
      
                    {/* Description */}
                    <textarea
                      placeholder="Description"
                      value={exp.description}
                      onChange={e => updateExperience(idx, "description", e.target.value)}
                      className="w-full mb-3 border p-1"
                      rows={3}
                    />
      
                    {/* Skills */}
                    <div className="mb-2">
                      <p className="font-medium mb-1">Skills:</p>
                      {exp.skills?.map((s, sIdx) => (
                        <div key={sIdx} className="flex items-center mb-1">
                          <input
                            type="text"
                            placeholder="Skill name"
                            value={s.name}
                            onChange={e => updateExpSkill(idx, sIdx, e.target.value)}
                            className="border-b flex-1"
                          />
                          <button
                            onClick={() => removeExpSkill(idx, sIdx)}
                            className="text-red-500 ml-2"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addSkillToExp(idx)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        + Add Skill
                      </button>
                    </div>
      
                    <button
                      onClick={() => removeExperience(idx)}
                      className="text-red-500 text-sm mt-1"
                    >
                      Remove Experience
                    </button>
                  </>
                ) : (
                  <>
                    <strong>{exp.pos}</strong> at {exp.company} (
                    {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : "Present"})
                    <p className="mt-1">{exp.description}</p>
                    {exp.skills?.length > 0 && (
                      <p className="mt-1">
                        <em>Skills:</em> {exp.skills.map(s => s.name).join(", ")}
                      </p>
                    )}
                  </>
                )}
              </div>
            ))}
            {isEditing && (
              <button
                onClick={addExperience}
                className="text-blue-600 hover:underline"
              >
                + Add Experience
              </button>
            )}
          </div>
        );        

      case "Certificates":
        return (
          <div className={styles.tabContent}>
            <h2>Certificates</h2>
            {certificates.map((cert, idx) => (
              <div key={cert.id} className="mb-2 border-b pb-1">
                {isEditing
                  ? (
                    <>
                      <input
                        type="text"
                        placeholder="Title"
                        value={cert.title}
                        onChange={e => updateCertificate(idx, "title", e.target.value)}
                        className="w-full mb-1 border-b"
                      />
                      <input
                        type="text"
                        placeholder="Organization"
                        value={cert.issuingOrganization}
                        onChange={e => updateCertificate(idx, "issuingOrganization", e.target.value)}
                        className="w-full mb-1 border-b"
                      />
                      <div className="flex space-x-2 mb-1">
                        <input
                          type="date"
                          value={cert.issueDate}
                          onChange={e => updateCertificate(idx, "issueDate", e.target.value)}
                          className="flex-1 border-b"
                        />
                        <input
                          type="date"
                          value={cert.expirationDate}
                          onChange={e => updateCertificate(idx, "expirationDate", e.target.value)}
                          className="flex-1 border-b"
                        />
                      </div>
                      <button onClick={() => removeCertificate(idx)} className="text-red-500 text-sm">Remove</button>
                    </>
                  )
                  : (
                    <li>
                      <strong>{cert.title}</strong> – {cert.issuingOrganization} ({formatDate(cert.issueDate)}{cert.expirationDate ? ` – ${formatDate(cert.expirationDate)}` : ""})
                    </li>
                  )}
              </div>
            ))}
            {isEditing && <button onClick={addCertificate} className="text-blue-600 hover:underline">+ Add Certificate</button>}
          </div>
        );

      case "Skills":
        return (
          <div className={styles.tabContent}>
            <h2>Skills</h2>
            {skillsList.map((skill, idx) => (
              <div key={idx} className="flex items-center mb-2">
                {isEditing
                  ? (
                    <>
                      <input
                        type="text"
                        value={skill}
                        onChange={e => updateSkill(idx, e.target.value)}
                        className="border-b flex-1"
                      />
                      <button onClick={() => removeSkill(idx)} className="text-red-500 ml-2">✕</button>
                    </>
                  )
                  : <li>{skill}</li>
                }
              </div>
            ))}
            {isEditing && <button onClick={addSkill} className="text-blue-600 hover:underline">+ Add Skill</button>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.studentProfileContainer}>
      <div className={styles.studentProfileBackgroundContainer}>
        <ImageUpload isProfilePic={false} currentImage={backgroundPic} onImageChange={setBackgroundPic} isEditing={isEditing} />
      </div>
      <div className={styles.studentProfileContent}>
        <div className={styles.studentProfileInfoBox}>
          <ImageUpload isProfilePic={true} currentImage={profilePic} onImageChange={setProfilePic} isEditing={isEditing} />
          <h1 className={styles.studentProfileTitle}>{studentData.studentName || 'Student'}</h1>
          <p className={styles.studentProfileSubtitle}>{studentData.title || 'Student Profile'}</p>

          {isEditing ? (
            <div className="flex space-x-2 mb-5">
              <button className="flex-1 py-2.5 bg-black text-white font-medium" onClick={handleEditToggle}>Save</button>
              <button className="flex-1 py-2.5 bg-gray-200 text-gray-800 font-medium" onClick={handleCancelEdit}>Cancel</button>
            </div>
          ) : (
            <button className="w-full py-2.5 bg-black text-white font-medium mb-5" onClick={handleEditToggle}>Edit Details</button>
          )}

          <div className={styles.studentBioContainer}>
            {bioFields.map((field, idx) => <BioField key={idx} {...field} isEditing={isEditing} onChange={(l,v)=>setBioFields(bs=>bs.map(f=>f.label===l?{...f,value:v}:f))} />)}
          </div>

          <div className={styles.languagesContainer}>
            <h2 className={styles.studentBioFieldLabel}>Languages</h2>
            {languages.map((lang, idx) => (
              <div key={idx} className={styles.languageField}>
                {isEditing ? (
                  <div className="flex items-center">
                    <input type="text" value={lang.name} onChange={e => {
                      const l = [...languages]; l[idx].name = e.target.value; setLanguages(l);
                    }} className="border-b" />
                    <button onClick={() => {
                      setLanguages(languages.filter((_,i)=>i!==idx));
                    }} className="text-red-500 ml-2">✕</button>
                  </div>
                ) : <p className="font-medium">{lang.name}</p>}
                <StarRating rating={lang.rating} isEditing={isEditing} onRatingChange={r => {
                  const l = [...languages]; l[idx].rating = r; setLanguages(l);
                }} />
              </div>
            ))}
            {isEditing && <button onClick={() => setLanguages([...languages, { name: "New Language", rating: 1 }])} className="mt-3 text-sm text-blue-600 hover:underline">+ Add Language</button>}
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
