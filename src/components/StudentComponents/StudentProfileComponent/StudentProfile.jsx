import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import styles from "./StudentProfile.module.css";
import StudentBackgound from "../../../assets/default_background.jpg";
import ProfilePic from "../../../assets/default_profile_icon.png";
import { fetchStudentProfile } from '../../../api/StudentApi/StudentProfileAPI/fetchStudentProfileAPI';
import Loading from '../../LoadingComponent/Loading';
import { updateStudentBio } from '../../../api/StudentApi/StudentProfileAPI/updateStudentBioAPI';
import { updateStudentPhoneNumber } from '../../../api/StudentApi/StudentProfileAPI/updateStudentPhoneNumberAPI';
import { updateStudentEmail } from '../../../api/StudentApi/StudentProfileAPI/updateStudentEmailAPI';
import { updateStudentAddress } from '../../../api/StudentApi/StudentProfileAPI/updateStudentAddressAPI';
import { updateStudentProfilePhoto } from '../../../api/StudentApi/StudentProfileAPI/updateStudentProfilePhotoAPI';
import { updateStudentExperience } from '../../../api/StudentApi/StudentProfileAPI/updateStudentExperienceAPI';
import { deleteStudentExperience } from '../../../api/StudentApi/StudentProfileAPI/deleteStudentExperienceAPI';
import { createStudentExperience } from '../../../api/StudentApi/StudentProfileAPI/createStudentExperienceAPI';
import { updateStudentWebsite } from '../../../api/StudentApi/StudentProfileAPI/updateStudentWebsiteAPI';
import { deleteStudentCertificate } from '../../../api/StudentApi/StudentProfileAPI/deleteStudentCertificateAPI';
import { createStudentCertificate } from '../../../api/StudentApi/StudentProfileAPI/createStudentCertificateAPI';
import { updateStudentCertificate } from '../../../api/StudentApi/StudentProfileAPI/updateStudentCertificateAPI';
import { createStudentSkill } from  '../../../api/StudentApi/StudentProfileAPI/createStudentSkillAPI';
import { deleteStudentSkill } from  '../../../api/StudentApi/StudentProfileAPI/deleteStudentSkillAPI';
import { fetchAllSkills } from '../../../api/StudentApi/StudentProfileAPI/fetchAllSkillsAPI';
import { fetchAllLanguages } from '../../../api/StudentApi/StudentProfileAPI/fetchAllLanguagesAPI';
import { updateStudentBannerImage } from '../../../api/StudentApi/StudentProfileAPI/updateStudentBannerImageAPI';
import { createStudentLanguage } from '../../../api/StudentApi/StudentProfileAPI/createStudentLanguageAPI';
import { updateStudentLanguage } from '../../../api/StudentApi/StudentProfileAPI/updateStudentLanguageAPI';
import { deleteStudentLanguage } from '../../../api/StudentApi/StudentProfileAPI/deleteStudentLanguageAPI';
import { deleteStudentBannerImage } from '../../../api/StudentApi/StudentProfileAPI/deleteStudentBannerImageAPI';
import { deleteStudentProfilePhoto } from '../../../api/StudentApi/StudentProfileAPI/deleteStudentProfilePhotoAPI';
import StudentCreateProfile from '../StudentCreateProfileComponent/StudentCreateProfile';

document.title = `AIS | Profile`;

const baseUrl = 'http://localhost:3004';

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
  const handleChange = (newValue) => {
    if (label === "Phone" && newValue && !/^\+?\d*$/.test(newValue)) {
      return;
    }
    onChange(label, newValue);
  };

  const renderValue = () => {
    if (isEditing) {
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(label, e.target.value)}
          className="w-full border-b border-gray-300 focus:outline-none focus:border-black text-right"
          style={{ minWidth: "100%" }} /* Ensure full width */
        />
      );
    }

    if (!isClickable) return value;
    switch (label) {
      case "Email":
        return <a href={`mailto:${value}`}>{value}</a>;
      case "Website":
        const normalizedUrl = /^(https?:\/\/)/i.test(value)
              ? value
              : `https://${value}`;
        return (
          <a
            href={normalizedUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {value}
          </a>
        );
      case "Phone":
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
      <div className={styles.studentBioFieldValue}>
        {isEditing ? (
          <input
            type={label === "Email" ? "email" : label === "Phone" ? "tel" : "text"}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full border-b border-gray-300 focus:outline-none focus:border-black text-right"
            pattern={label === "Phone" ? "\\+\\d{1,3}\\d{6,}" : null}
          />
        ) : (
          <p className={isClickable ? styles.studentBioFieldClickable : ''}>
            {renderValue()}
          </p>
        )}
      </div>
    </div>
  );
};


const ImageUpload = ({ isProfilePic, currentImage, onImageChange, isEditing, defaultImage }) => {
  const fileInputRef = React.useRef(null);
  
  const handleClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const allowed = ["image/png", "image/jpeg"];
    if (!allowed.includes(file.type)) {
      alert("Invalid file type. Please upload a PNG or JPG/JPEG image.");
      e.target.value = "";
      return;
    }
  
    // inside handleFileChange
    const reader = new FileReader();
    reader.onload = (event) => {
      onImageChange({
        file,
        preview: event.target.result
      });
    };
    reader.readAsDataURL(file);

  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    onImageChange({ file: "Deleted", preview: defaultImage });
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
          {currentImage !== defaultImage && (
              <Trash2
                className="text-white"
                size={24}
                onClick={handleDelete}
              />
            )}
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".png, .jpg, .jpeg"
        className="hidden"
      />

    </div>
  );
};

const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState("About");
  const [isEditing, setIsEditing] = useState(false);

  const [profilePicPreview, setProfilePicPreview] = useState(ProfilePic);
  const [profilePicFile, setProfilePicFile] = useState(null);
  
  const [backgroundPicPreview, setBackgroundPicPreview] = useState(StudentBackgound);
  const [backgroundPic, setBackgroundPic] = useState(null);

  // new state slices for editable tabs
  const [aboutText, setAboutText] = useState("");
  const [experiences, setExperiences] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [skillsList, setSkillsList] = useState([]);

  // for restoring on Cancel
  const [originalState, setOriginalState] = useState({});

  const [studentData, setStudentData] = useState(null);
  const [location, setLocation] = useState(null);
  const [email, setEmail] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [website, setWebsite] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [allLanguages, setAllLanguages] = useState([]);

  const [loading, setLoading] = useState(true);

  const [bioFields, setBioFields] = useState([
    { label: "Location", value: "", isClickable: true },
    { label: "Email", value: "", isClickable: true },
    { label: "Phone", value: "", isClickable: true },
    { label: "Website", value: "", isClickable: true }
  ]);
  const [languages, setLanguages] = useState([]);

  const isValidPhone = (phone) => {
    const regex = /^\+\d{1,3}\d{6,}$/;
    return regex.test(phone);
  };
  
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  // Add a blank skill to an experience
  const addSkillToExp = idx => {
    const ex = [...experiences];
    ex[idx].skills = ex[idx].skills || [];
    ex[idx].skills.push({ name: "" });
    setExperiences(ex);
  };

  // Update one skill’s name
  const updateExpSkill = (expIdx, skillIdx, skill) => {
    const ex = [...experiences];
    ex[expIdx].skills[skillIdx] = { id: skill.id, name: skill.name };
    setExperiences(ex);
  };

  // Remove one skill from an experience
  const removeExpSkill = (expIdx, skillIdx) => {
    const ex = [...experiences];
    ex[expIdx].skills.splice(skillIdx, 1);
    setExperiences(ex);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [profile, skillsData, languagesData] = await Promise.all([
          fetchStudentProfile(),
          fetchAllSkills(),
          fetchAllLanguages()
        ]);

        setAllSkills(skillsData);
        setAllLanguages(languagesData);

        setStudentData(profile);
        // initialize all editing state from fetched data:
        setAboutText(profile.bio || "");
        setExperiences(profile.experiences || []);
        setCertificates(profile.certificates || []);
        setSkillsList(profile.skills || []);
        setLocation(profile.address || "");
        setEmail(profile.email || "");
        setPhoneNumber(profile.phoneNumber || "");
        setWebsite(profile.webSite || "")
        setLanguages(profile.languages?.map(lang => ({
          id: lang.id,
          name: lang.name,
          rating: lang.level
        })) || []);
        setProfilePicPreview(profile.profilePicture ? `${baseUrl}/${profile.profilePicture}` : ProfilePic);
        setBackgroundPicPreview(profile.bannerImage ? `${baseUrl}/${profile.bannerImage}` : StudentBackgound);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);



  useEffect(() => {
    setBioFields(prevBioFields => 
      prevBioFields.map(field => {
        switch (field.label) {
          case "Location":
            return { ...field, value: location };
          case "Email":
            return { ...field, value: email };
          case "Phone":
            return { ...field, value: phoneNumber };
          case "Website":
            return { ...field, value: website };
          default:
            return field;
        }
      })
    );
  }, [location, email, phoneNumber, website]); // Runs when any of these dependencies change

  const handleEditToggle = async () => {
    if (!isEditing) {
      // save originals for cancel
      setOriginalState({
        profilePicFile,
        profilePicPreview,
        backgroundPic,
        backgroundPicPreview,
        bioFields: JSON.parse(JSON.stringify(bioFields)),
        languages: JSON.parse(JSON.stringify(languages)),
        aboutText,
        experiences: JSON.parse(JSON.stringify(experiences)),
        certificates: JSON.parse(JSON.stringify(certificates)),
        skillsList: JSON.parse(JSON.stringify(skillsList))
      });
      setIsEditing(true);
    } else {
        const errors = [];
        if (email && !isValidEmail(email)) {
          errors.push("Please enter a valid email address");
        }
        if (phoneNumber && !isValidPhone(phoneNumber)) {
          errors.push("Phone number must include country code and numbers (e.g., +1234567890)");
        }
        if (website) {
          let websiteValue = website;
          if (!/^(https?:\/\/)/i.test(websiteValue)) {
            websiteValue = `https://${websiteValue}`;
          }
          if (!isValidUrl(websiteValue)) {
            errors.push("Please enter a valid website URL");
          }
        }

        // Experience validation
        experiences.forEach((exp, idx) => {
          if (!exp.pos.trim()) {
            errors.push(`Experience ${idx + 1}: Position is required`);
          }
          if (!exp.company.trim()) {
            errors.push(`Experience ${idx + 1}: Company is required`);
          }
          if (!exp.startDate) {
            errors.push(`Experience ${idx + 1}: Start date is required`);
          }
          if (exp.endDate && new Date(exp.startDate) > new Date(exp.endDate)) {
            errors.push(`Experience ${idx + 1}: Start date must be before end date`);
          }
        });

        // Certificate validation
        certificates.forEach((cert, idx) => {
          if (!cert.title.trim()) {
            errors.push(`Certificate ${idx + 1}: Title is required`);
          }
          if (!cert.issuingOrganization.trim()) {
            errors.push(`Certificate ${idx + 1}: Issuing organization is required`);
          }
          if (!cert.issueDate) {
            errors.push(`Certificate ${idx + 1}: Issue date is required`);
          }
          if (cert.expirationDate && new Date(cert.issueDate) > new Date(cert.expirationDate)) {
            errors.push(`Certificate ${idx + 1}: Issue date must be before expiration date`);
          }
        });

        if (errors.length > 0) {
          alert("Please fix the following errors:\n\n" + errors.join("\n"));
          return;
        }

        try {
          // Update bio if changed
          if (aboutText !== originalState.aboutText) {
            await updateStudentBio(aboutText);
          }

          // Update phone if changed
          const originalPhone = originalState.bioFields.find(f => f.label === 'Phone').value;
          if (phoneNumber !== originalPhone) {
            await updateStudentPhoneNumber(phoneNumber);
          }

          // Update email if changed
          const originalEmail = originalState.bioFields.find(f => f.label === 'Email').value;
          if (email !== originalEmail) {
            await updateStudentEmail(email);
          }

          // Update location if changed
          const originalLocation = originalState.bioFields.find(f => f.label === 'Location').value;
          if (location !== originalLocation) {
            await updateStudentAddress(location);
          }

          // Update website if changed
          const originalWebsite = originalState.bioFields.find(f => f.label === 'Website').value;
          if (website !== originalWebsite) {
            await updateStudentWebsite(website);
          }

          if (backgroundPic == "Deleted") {
            setBackgroundPic(null);
            deleteStudentBannerImage();
          } else if(backgroundPic && (backgroundPic != originalState.backgroundPic)) {
            const formData = new FormData();
            formData.append('bannerImage', backgroundPic);
            await updateStudentBannerImage(formData);
          }

          if (profilePicFile == 'Deleted') {
            setProfilePicFile(null);
            deleteStudentProfilePhoto();
          } else if (profilePicFile && (profilePicFile != originalState.profilePicFile)) {
            const formData = new FormData();
            formData.append('profilePicture', profilePicFile);
            await updateStudentProfilePhoto(formData);
          }

          // Process experiences
          const originalExperiences = originalState.experiences || [];
          const currentExperiences = experiences;

          // Delete removed experiences
          const idsToDelete = originalExperiences
            .filter(oe => !currentExperiences.some(ce => ce.id === oe.id))
            .map(e => e.id);
          
          await Promise.all(idsToDelete.map(async (id) => 
            deleteStudentExperience(id)
          ));

          // Update modified experiences
          await Promise.all(currentExperiences.map(async (exp) => {
            if (!exp.id) {
              createStudentExperience({
                ...exp,
                skills: exp.skills.map(s => s.id)
              });
            } else {
              const originalExp = originalExperiences.find(oe => oe.id === exp.id);
              if (originalExp && JSON.stringify(exp) !== JSON.stringify(originalExp)) {
                updateStudentExperience(exp.id, {
                  pos: exp.pos,
                  company: exp.company,
                  startDate: exp.startDate,
                  endDate: exp.endDate || null,
                  description: exp.description,
                  skills: exp.skills.map(s => s.id) // Send skill IDs to backend
                });
              }
            }
          }));

          // Process Certificates
          const originalCertificates = originalState.certificates || [];
          const currentCertificates = certificates;

          // Delete removed certificates
          const certsToDelete = originalCertificates.filter(oc => 
            !currentCertificates.some(cc => cc.id === oc.id)
          );
          await Promise.all(certsToDelete.map(async (cert) => 
            deleteStudentCertificate(cert.id)
          ));

          // Create new certificates and update modified ones
          await Promise.all(currentCertificates.map(async (cert) => {
            if (!cert.id) {
              // Create new certificate
              createStudentCertificate({
                title: cert.title,
                issuingOrganization: cert.issuingOrganization,
                issueDate: cert.issueDate,
                expirationDate: cert.expirationDate,
                studentId: studentData.id // From fetched student data
              });
            } else {
              // Update existing certificate if modified
              const originalCert = originalCertificates.find(oc => oc.id === cert.id);
              if (originalCert && JSON.stringify(cert) !== JSON.stringify(originalCert)) {
                updateStudentCertificate(cert.id, {
                  title: cert.title,
                  issuingOrganization: cert.issuingOrganization,
                  issueDate: cert.issueDate,
                  expirationDate: cert.expirationDate || null
                });
              }
            }
          }));

          // Process Skills
          const originalSkills = originalState.skillsList || [];
          const currentSkills = skillsList;

          // Determine skills to add (new or modified)
          const skillsToAdd = currentSkills.filter(cs => 
            !originalSkills.some(os => os.id === cs.id)
          );

          // Determine skills to remove
          const skillsToRemove = originalSkills.filter(os => 
            !currentSkills.some(cs => cs.id === os.id)
          );

          // Add new skills with hardcoded ID
          await Promise.all(skillsToAdd.map(async (skill) => {
            createStudentSkill(skill.id);
          }));

          // Remove deleted skills
          await Promise.all(skillsToRemove.map(async (skill) => {
            deleteStudentSkill(skill.id);
          }));

          // Process Languages
          const originalLangs = originalState.languages || [];
          const currentLangs  = languages;

          // 1) Delete languages the user removed
          const langsToDelete = originalLangs
            .filter(ol => !currentLangs.some(cl => cl.id === ol.id))
            .map(l => l.id);
          await Promise.all(
            langsToDelete.map(id => deleteStudentLanguage(id))
          );

          // 2) Create new languages the user just added
          const langsToAdd = currentLangs
            .filter(cl => !originalLangs.some(ol => ol.id === cl.id));
          await Promise.all(
            langsToAdd.map(lang =>
              createStudentLanguage({
                languageId: lang.id,
                level:      lang.rating
              })
            )
          );

          // 3) Update languages whose rating changed
          const langsToUpdate = currentLangs
            .filter(cl =>
              originalLangs.some(ol => ol.id === cl.id && ol.rating !== cl.rating)
            );
          await Promise.all(
            langsToUpdate.map(lang =>
              updateStudentLanguage(
                lang.id,
                { languageId: lang.id, newLevel: lang.rating }
              )
            )
          );

          // Refresh data
          // const freshData = await fetchStudentProfile();
          // setStudentData(freshData);
          // setExperiences(freshData.experiences || []);
          // setCertificates(freshData.certificates || []);
          // setSkillsList(freshData.skills || []);

        } catch (error) {
          console.error('Save failed:', error);
          alert('Error saving changes. Please try again.');
        }
        setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    const orig = originalState;
    setProfilePicFile(orig.profilePicFile);
    setProfilePicPreview(orig.profilePicPreview);
    setBackgroundPic(orig.backgroundPic);
    setBackgroundPicPreview(orig.backgroundPicPreview);
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
    { pos: "", company: "", startDate: "", endDate: null, description: null, skills: [] }
  ]);
  const updateExperience = (idx, field, value) => {
    const ex = [...experiences];
    ex[idx][field] = value === "" ? null : value;
    setExperiences(ex);
  };
  const removeExperience = idx => setExperiences(experiences.filter((_, i) => i !== idx));

  const addCertificate = () => setCertificates([
    ...certificates,
    {
      title: "", 
      issuingOrganization: "", 
      issueDate: null,
      expirationDate: null 
    }
  ]);

  const updateCertificate = (idx, field, value) => {
    const certs = [...certificates];
    certs[idx][field] = value === "" ? null : value;
    // certs[idx][field] = value;
    setCertificates(certs);
  };
  const removeCertificate = idx => setCertificates(certificates.filter((_, i) => i !== idx));

  const addSkill = () => setSkillsList([...skillsList, { 
    name: "", 
    id: null
  }]);
  
  const updateSkill = (idx, skill) => {
    const list = [...skillsList];
    list[idx] = { id: skill.id, name: skill.name };
    setSkillsList(list);
  };
  
  const removeSkill = idx => setSkillsList(skillsList.filter((_, i) => i !== idx));

  if (loading) return <Loading />;

  if (!studentData) {return <StudentCreateProfile StarRating={StarRating}/>}

  const renderTabContent = () => {
    if (!studentData) return null;
    switch (activeTab) {
      case "About":
      return (
        <div className={styles.tabContent}>
          <h2>About Me</h2>
          {isEditing ? (
            <textarea
              value={aboutText}
              onChange={e => setAboutText(e.target.value)}
              className="w-full border p-2"
              rows={6}
            />
          ) : (
            <div className={styles.aboutText}>
              {aboutText.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
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
                        value={exp.endDate || ""}
                        onChange={e => updateExperience(idx, "endDate", e.target.value || null)}
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
                          <select
                            value={s.id || ''}
                            onChange={(e) => {
                              const selectedId = parseInt(e.target.value);
                              const selectedSkill = allSkills.find(sk => sk.id === selectedId);
                              updateExpSkill(idx, sIdx, selectedSkill);
                            }}
                            className="border-b flex-1"
                          >
                            <option value="" disabled>Select a skill</option>
                            {allSkills
                              .filter(skill => 
                                !exp.skills.some(s => s.id === skill.id) || 
                                skill.id === s.id
                              )
                              .map(skill => (
                                <option key={skill.id} value={skill.id}>{skill.name}</option>
                            ))}
                          </select>
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
                          value={cert.expirationDate || ""}
                          // value={cert.expirationDate}
                          onChange={e => updateCertificate(idx, "expirationDate", e.target.value || null)}
                          // onChange={e => updateCertificate(idx, "expirationDate", e.target.value)}
                          className="flex-1 border-b"
                        />
                      </div>
                      <button onClick={() => removeCertificate(idx)} className="text-red-500 text-sm">Remove</button>
                      <br/>
                      <br/>
                    </>
                  )
                  : (
                    <li>
                      <strong>{cert.title}</strong> – {cert.issuingOrganization} ({formatDate(cert.issueDate)}{cert.expirationDate ? ` – ${formatDate(cert.expirationDate)}` : " – Present"})
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
                <div key={skill.id || idx} className="flex items-center mb-2">
                  {isEditing ? (
                    <>
                      <select
                        value={skill.id || ''}
                        onChange={(e) => {
                          const selectedId = parseInt(e.target.value)
                          const selectedSkill = allSkills.find(s => s.id === selectedId)
                          updateSkill(idx, selectedSkill)
                        }}
                      >
                        <option value="" disabled>Select a skill</option>
                        {allSkills
                          .filter(s => 
                            !skillsList.some(sl => sl.id === s.id) || 
                            s.id === skill.id
                          )
                          .map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                      </select>
                      <button 
                        onClick={() => removeSkill(idx)} 
                        className="text-red-500 ml-2"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <li>{skill.name}</li>
                  )}
                </div>
              ))}
              {isEditing && (
                <button 
                  onClick={addSkill} 
                  className="text-blue-600 hover:underline"
                >
                  + Add Skill
                </button>
              )}
            </div>
          );

      default:
        return null;
    }
  };

  return (
    <div className={styles.studentProfileContainer}>
      <div className={styles.studentProfileBackgroundContainer}>
        <ImageUpload 
          isProfilePic={false} 
          currentImage={backgroundPicPreview} 
          isEditing={isEditing} 
          onImageChange={({ file, preview }) => {
            setBackgroundPicPreview(preview);
            setBackgroundPic(file);
          }}
          defaultImage={StudentBackgound}
        />
      </div>
      
      <div className={styles.studentProfileContent}>
        <div className={styles.studentProfileInfoBox}>
        <ImageUpload
          isProfilePic
          currentImage={profilePicPreview}
          isEditing={isEditing}
          onImageChange={({ file, preview }) => {
            setProfilePicPreview(preview);
            setProfilePicFile(file);
          }}
          defaultImage={ProfilePic}
        />

          <h1 className={styles.studentProfileTitle}>{studentData.username || 'Student'}</h1>
          <p className={styles.studentProfileSubtitle}>{studentData.title || 'Computer Enginner'}</p>

          {isEditing ? (
            <div className="flex space-x-2 mb-5">
              <button className="flex-1 py-2.5 bg-black text-white font-medium" onClick={handleEditToggle}>Save</button>
              <button className="flex-1 py-2.5 bg-gray-200 text-gray-800 font-medium" onClick={handleCancelEdit}>Cancel</button>
            </div>
          ) : (
            <button className="w-full py-2.5 bg-black text-white font-medium mb-5" onClick={handleEditToggle}>Edit Details</button>
          )}

          <div className={styles.studentBioContainer}>
            {bioFields.map((field, idx) => (
              <BioField
                key={idx}
                {...field}
                isEditing={isEditing}
                onChange={(label, value) => {
                  // Update bioFields
                  setBioFields(bs => bs.map(f => f.label === label ? { ...f, value } : f));
                  // Update individual state variables based on the label
                  switch (label) {
                    case 'Phone':
                      setPhoneNumber(value);
                      break;
                    case 'Email':
                      setEmail(value);
                      break;
                    case 'Location':
                      setLocation(value);
                      break;
                    case 'Website':
                      setWebsite(value);
                      break;
                    default:
                      break;
                  }
                }}
              />
            ))}
          </div>

          <div className={styles.languagesContainer}>
            <h2 className={styles.studentBioFieldLabel}>Languages</h2>
            {languages.map((lang, idx) => (
              <div key={idx} className={styles.languageField}>
                {isEditing ? (
                  <div className="flex items-center">
                    <select
                      value={lang.id || ''}
                      onChange={(e) => {
                        const selectedId = parseInt(e.target.value);
                        const selectedLang = allLanguages.find(l => l.id === selectedId);
                        const newLangs = [...languages];
                        newLangs[idx] = {
                          id: selectedLang.id,
                          name: selectedLang.name,
                          rating: newLangs[idx].rating
                        };
                        setLanguages(newLangs);
                      }}
                    >
                      <option value="" disabled>Select a language</option>
                      {allLanguages
                        .filter(lang => 
                          !languages.some(l => l.id === lang.id) || 
                          lang.id === languages[idx].id
                        )
                        .map(lang => (
                          <option key={lang.id} value={lang.id}>{lang.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        setLanguages(languages.filter((_,i)=>i!==idx));
                      }}
                      className="text-red-500 ml-2"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <p className="font-medium">{lang.name}</p>
                )}
                <StarRating rating={lang.rating} isEditing={isEditing} onRatingChange={r => {
                  const l = [...languages]; 
                  l[idx].rating = r; 
                  setLanguages(l);
                }} />
              </div>
            ))}
            {/* {isEditing && <button onClick={() => setLanguages([...languages, { name: "New Language", rating: 1 }])} className="mt-3 text-sm text-blue-600 hover:underline">+ Add Language</button>} */}
            {isEditing && (
              <button 
                onClick={() => setLanguages([...languages, { id: null, name: "", rating: 1 }])}
                disabled={languages.length === allLanguages.length}
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
