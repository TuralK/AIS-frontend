import React, { useReducer, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StudentCreateProfile.module.css';
import { fetchAllLanguages } from '../../../api/StudentApi/StudentProfileAPI/fetchAllLanguagesAPI';
import { fetchAllSkills } from '../../../api/StudentApi/StudentProfileAPI/fetchAllSkillsAPI';

// import { createStudentProfile } from '../../../api/StudentApi/StudentProfileAPI/createStudentProfileAPI';
// import StarRating from '../StudentProfileComponent/StudentProfile';

const steps = [
  'Personal Info',
  'Contact',
  'Bio',
  'Experience',
  'Certificates',
  'Skills',
  'Languages',
  'Review'
];

const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'ADD_EXPERIENCE':
      return { ...state, experiences: [...state.experiences, action.payload] };
    case 'UPDATE_EXPERIENCE':
      return {
        ...state,
        experiences: state.experiences.map((exp, i) =>
          i === action.index ? { ...exp, [action.field]: action.value } : exp
        )
      };
    case 'REMOVE_EXPERIENCE':
      return {
        ...state,
        experiences: state.experiences.filter((_, i) => i !== action.index)
      };
      case 'ADD_EXPERIENCE_SKILL': 
      return {
        ...state,
        experiences: state.experiences.map((exp, i) => 
          i === action.expIndex ? {
            ...exp,
            skills: [...exp.skills, action.skill]
          } : exp
        )
      };
    case 'REMOVE_EXPERIENCE_SKILL':
      return {
        ...state,
        experiences: state.experiences.map((exp, i) =>
          i === action.expIndex ? {
            ...exp,
            skills: exp.skills.filter((_, i) => i !== action.skillIndex)
          } : exp
        )
      };
    case 'ADD_CERTIFICATE':
      return { ...state, certificates: [...state.certificates, action.payload] };
    case 'UPDATE_CERTIFICATE':
      return {
        ...state,
        certificates: state.certificates.map((cert, i) =>
          i === action.index ? { ...cert, [action.field]: action.value } : cert
        )
      };
    case 'REMOVE_CERTIFICATE':
      return {
        ...state,
        certificates: state.certificates.filter((_, i) => i !== action.index)
      };
    case 'ADD_SKILL':
      return { ...state, skills: [...state.skills, action.payload] };
    case 'REMOVE_SKILL':
      return {
        ...state,
        skills: state.skills.filter((_, i) => i !== action.index)
      };
    case 'ADD_LANGUAGE':
      return { ...state, languages: [...state.languages, action.payload] };
    // case 'UPDATE_LANGUAGE':
    //   return {
    //     ...state,
    //     languages: state.languages.map((lang, i) =>
    //       i === action.index ? { ...lang, rating: action.rating } : lang
    //     )
    //   };
    case 'UPDATE_LANGUAGE':
      return {
        ...state,
        languages: state.languages.map((lang, i) =>
          i === action.index ? { ...lang, ...action.payload } : lang
        )
      };
    case 'REMOVE_LANGUAGE':
      return {
        ...state,
        languages: state.languages.filter((_, i) => i !== action.index)
      };
    default:
      return state;
  }
};

const initialState = {
  // username: '',
  // title: '',
  bio: '',
  email: '',
  phoneNumber: '',
  address: '',
  webSite: '',
  experiences: [],
  certificates: [],
  skills: [],
  languages: []
};

const StudentCreateProfile = ({StarRating}) => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [currentStep, setCurrentStep] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [allLanguages, setAllLanguages] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skills, languages] = await Promise.all([
          fetchAllSkills(),
          fetchAllLanguages()
        ]);
        setAllSkills(skills);
        setAllLanguages(languages);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const validateStep = () => {
    const newErrors = {};
    
    switch(currentStep) {
      // Validate images if needed
      // case 0:
      //   if (!state.username.trim()) newErrors.username = 'Username is required';
      //   if (!state.title.trim()) newErrors.title = 'Professional title is required';
      //   break;
      // case 1:
      //   if (!/^\S+@\S+\.\S+$/.test(state.email)) newErrors.email = 'Invalid email format';
      //   if (state.phoneNumber && !/^\+\d{1,3}\d{6,}$/.test(state.phoneNumber)) 
      //     newErrors.phoneNumber = 'Invalid phone format (e.g. +1234567890)';
      //   break;
      case 3:
        state.experiences.forEach((exp, index) => {
          if (!exp.pos) newErrors[`experience-${index}-pos`] = 'Position required';
          if (!exp.company) newErrors[`experience-${index}-company`] = 'Company required';
          if (!exp.startDate) newErrors[`experience-${index}-startDate`] = 'Start date required';
        });
        break;
      case 4:
        state.certificates.forEach((cert, index) => {
          if (!cert.title) newErrors[`certificate-${index}-title`] = 'Title required';
          if (!cert.issuingOrganization) newErrors[`certificate-${index}-org`] = 'Organization required';
          if (!cert.issueDate) newErrors[`certificate-${index}-issueDate`] = 'Issue date required';
        });
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleImageUpload = (file, isProfile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      isProfile ? setProfileImage(e.target.result) : setBannerImage(e.target.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      
      // Append images
      if (profileImage) {
        const blob = await fetch(profileImage).then(res => res.blob());
        formData.append('profilePicture', blob, 'profile.jpg');
      }
      if (bannerImage) {
        const blob = await fetch(bannerImage).then(res => res.blob());
        formData.append('bannerImage', blob, 'banner.jpg');
      }

      // Append other fields
      Object.keys(state).forEach(key => {
        if (['experiences', 'certificates', 'skills', 'languages'].includes(key)) {
          formData.append(key, JSON.stringify(state[key]));
        } else {
          formData.append(key, state[key]);
        }
      });

      // await createStudentProfile(formData);
      navigate('/profile');
    } catch (error) {
      console.error('Profile creation failed:', error);
      alert('Error creating profile. Please try again.');
    }
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 0: // Personal Info
        return (
          <div className={styles.stepContent}>
            <div className={styles.formGroup}>
              <label>Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0], true)}
              />
              {profileImage && (
                <img src={profileImage} alt="Profile Preview" className={styles.imagePreview} />
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Banner Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0], false)}
              />
              {bannerImage && (
                <img src={bannerImage} alt="Banner Preview" className={styles.bannerPreview} />
              )}
            </div>

            {/* <div className={styles.formGroup}>
              <label>Username *</label>
              <input
                value={state.username}
                onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'username', value: e.target.value })}
              />
              {errors.username && <span className={styles.error}>{errors.username}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Professional Title *</label>
              <input
                value={state.title}
                onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'title', value: e.target.value })}
              />
              {errors.title && <span className={styles.error}>{errors.title}</span>}
            </div> */}
          </div>
        );

      case 1: // Contact
        return (
          <div className={styles.stepContent}>
            <div className={styles.formGroup}>
              <label>Email *</label>
              <input
                type="email"
                value={state.email}
                onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'email', value: e.target.value })}
              />
              {errors.email && <span className={styles.error}>{errors.email}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input
                value={state.phoneNumber}
                onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'phoneNumber', value: e.target.value })}
                placeholder="+CountryCode Number"
              />
              {errors.phoneNumber && <span className={styles.error}>{errors.phoneNumber}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Location</label>
              <input
                value={state.address}
                onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'address', value: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Website</label>
              <input
                value={state.webSite}
                onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'webSite', value: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
          </div>
        );

      case 2: // Bio
        return (
          <div className={styles.stepContent}>
            <div className={styles.formGroup}>
              <label>About You</label>
              <textarea
                value={state.bio}
                onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'bio', value: e.target.value })}
                rows={6}
              />
            </div>
          </div>
        );

      case 3: // Experience
        return (
          <div className={styles.stepContent}>
            <button 
              className={styles.addButton}
              onClick={() => dispatch({
                type: 'ADD_EXPERIENCE',
                payload: { pos: '', company: '', startDate: '', endDate: '', description: '', skills: [] }
              })}
            >
              + Add Experience
            </button>

            {state.experiences.map((exp, index) => (
              <div key={index} className={styles.card}>
                <div className={styles.formGroup}>
                  <label>Position *</label>
                  <input
                    value={exp.pos}
                    onChange={(e) => dispatch({
                      type: 'UPDATE_EXPERIENCE',
                      index,
                      field: 'pos',
                      value: e.target.value
                    })}
                  />
                  {errors[`experience-${index}-pos`] && (
                    <span className={styles.error}>{errors[`experience-${index}-pos`]}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Company *</label>
                  <input
                    value={exp.company}
                    onChange={(e) => dispatch({
                      type: 'UPDATE_EXPERIENCE',
                      index,
                      field: 'company',
                      value: e.target.value
                    })}
                  />
                  {errors[`experience-${index}-company`] && (
                    <span className={styles.error}>{errors[`experience-${index}-company`]}</span>
                  )}
                </div>

                <div className={styles.dateGroup}>
                  <div className={styles.formGroup}>
                    <label>Start Date *</label>
                    <input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) => dispatch({
                        type: 'UPDATE_EXPERIENCE',
                        index,
                        field: 'startDate',
                        value: e.target.value
                      })}
                    />
                    {errors[`experience-${index}-startDate`] && (
                      <span className={styles.error}>{errors[`experience-${index}-startDate`]}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>End Date</label>
                    <input
                      type="date"
                      value={exp.endDate}
                      onChange={(e) => dispatch({
                        type: 'UPDATE_EXPERIENCE',
                        index,
                        field: 'endDate',
                        value: e.target.value
                      })}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => dispatch({
                      type: 'UPDATE_EXPERIENCE',
                      index,
                      field: 'description',
                      value: e.target.value
                    })}
                    rows={3}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Skills</label>
                  <div className={styles.skillsContainer}>
                    <div className={styles.availableSkills}>
                      {allSkills.map(skill => (
                        <button
                          key={skill.id}
                          className={`${styles.skillPill} ${
                            exp.skills.some(s => s.id === skill.id) ? styles.selected : ''
                          }`}
                          onClick={() => {
                            if (exp.skills.some(s => s.id === skill.id)) {
                              dispatch({
                                type: 'REMOVE_EXPERIENCE_SKILL',
                                expIndex: index,
                                skillIndex: exp.skills.findIndex(s => s.id === skill.id)
                              });
                            } else {
                              dispatch({
                                type: 'ADD_EXPERIENCE_SKILL',
                                expIndex: index,
                                skill: skill
                              });
                            }
                          }}
                        >
                          {skill.name}
                        </button>
                      ))}
                    </div>
                    <div className={styles.selectedSkills}>
                      {exp.skills.map((skill, skillIndex) => (
                        <div key={skill.id} className={styles.skillPill}>
                          {skill.name}
                          <button
                            className={styles.removeSkill}
                            onClick={() => dispatch({
                              type: 'REMOVE_EXPERIENCE_SKILL',
                              expIndex: index,
                              skillIndex: skillIndex
                            })}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <button 
                  className={styles.removeButton}
                  onClick={() => dispatch({ type: 'REMOVE_EXPERIENCE', index })}
                >
                  Remove Experience
                </button>
              </div>
            ))}
          </div>
        );

      case 4: // Certificates
        return (
          <div className={styles.stepContent}>
            <button 
              className={styles.addButton}
              onClick={() => dispatch({
                type: 'ADD_CERTIFICATE',
                payload: { title: '', issuingOrganization: '', issueDate: '', expirationDate: '' }
              })}
            >
              + Add Certificate
            </button>

            {state.certificates.map((cert, index) => (
              <div key={index} className={styles.card}>
                <div className={styles.formGroup}>
                  <label>Title *</label>
                  <input
                    value={cert.title}
                    onChange={(e) => dispatch({
                      type: 'UPDATE_CERTIFICATE',
                      index,
                      field: 'title',
                      value: e.target.value
                    })}
                  />
                  {errors[`certificate-${index}-title`] && (
                    <span className={styles.error}>{errors[`certificate-${index}-title`]}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Issuing Organization *</label>
                  <input
                    value={cert.issuingOrganization}
                    onChange={(e) => dispatch({
                      type: 'UPDATE_CERTIFICATE',
                      index,
                      field: 'issuingOrganization',
                      value: e.target.value
                    })}
                  />
                  {errors[`certificate-${index}-org`] && (
                    <span className={styles.error}>{errors[`certificate-${index}-org`]}</span>
                  )}
                </div>

                <div className={styles.dateGroup}>
                  <div className={styles.formGroup}>
                    <label>Issue Date *</label>
                    <input
                      type="date"
                      value={cert.issueDate}
                      onChange={(e) => dispatch({
                        type: 'UPDATE_CERTIFICATE',
                        index,
                        field: 'issueDate',
                        value: e.target.value
                      })}
                    />
                    {errors[`certificate-${index}-issueDate`] && (
                      <span className={styles.error}>{errors[`certificate-${index}-issueDate`]}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Expiration Date</label>
                    <input
                      type="date"
                      value={cert.expirationDate}
                      onChange={(e) => dispatch({
                        type: 'UPDATE_CERTIFICATE',
                        index,
                        field: 'expirationDate',
                        value: e.target.value
                      })}
                    />
                  </div>
                </div>

                <button 
                  className={styles.removeButton}
                  onClick={() => dispatch({ type: 'REMOVE_CERTIFICATE', index })}
                >
                  Remove Certificate
                </button>
              </div>
            ))}
          </div>
        );

      case 5: // Skills
        return (
          <div className={styles.stepContent}>
            <div className={styles.skillsContainer}>
              <div className={styles.availableSkills}>
                <h3>Available Skills</h3>
                <div className={styles.skillsGrid}>
                  {allSkills.map(skill => (
                    <button
                      key={skill.id}
                      className={`${styles.skillPill} ${
                        state.skills.some(s => s.id === skill.id) ? styles.selected : ''
                      }`}
                      onClick={() => {
                        if (state.skills.some(s => s.id === skill.id)) {
                          dispatch({
                            type: 'REMOVE_SKILL',
                            index: state.skills.findIndex(s => s.id === skill.id)
                          });
                        } else {
                          dispatch({ type: 'ADD_SKILL', payload: skill });
                        }
                      }}
                    >
                      {skill.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.selectedSkills}>
                <h3>Selected Skills ({state.skills.length})</h3>
                <div className={styles.skillsGrid}>
                  {state.skills.map((skill, index) => (
                    <div key={skill.id} className={styles.skillPill}>
                      {skill.name}
                      <button
                        className={styles.removeSkill}
                        onClick={() => dispatch({ type: 'REMOVE_SKILL', index })}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 6: // Languages
        return (
          <div className={styles.stepContent}>
            <button
              className={styles.addButton}
              onClick={() => dispatch({
                type: 'ADD_LANGUAGE',
                payload: { id: '', name: '', rating: 1 }
              })}
            >
              + Add Language
            </button>

            {state.languages.map((lang, index) => (
              <div key={index} className={styles.card}>
                <div className={styles.formGroup}>
                  <label>Language</label>
                  <select
                    value={lang.id || ''}
                    // onChange={(e) => {
                    //   const selectedLang = allLanguages.find(l => l.id === parseInt(e.target.value));
                    //   dispatch({
                    //     type: 'UPDATE_LANGUAGE',
                    //     index,
                    //     payload: {
                    //       id: selectedLang.id,
                    //       name: selectedLang.name,
                    //       rating: lang.rating
                    //     }
                    //   });
                    // }}
                    // Inside the select element's onChange handler
                    onChange={(e) => {
                      const selectedLang = allLanguages.find(l => l.id === parseInt(e.target.value));
                      if (selectedLang) {
                        dispatch({
                          type: 'UPDATE_LANGUAGE',
                          index,
                          payload: {
                            id: selectedLang.id,
                            name: selectedLang.name
                          }
                        });
                      }
                    }}
                  >
                    <option value="" disabled>Select a language</option>
                    {allLanguages.map(lang => (
                      <option key={lang.id} value={lang.id}>{lang.name}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Proficiency</label>
                  {/* <StarRating
                    rating={lang.rating}
                    onRatingChange={(rating) => dispatch({
                      type: 'UPDATE_LANGUAGE',
                      index,
                      rating
                    })}
                  /> */}
                  <StarRating
                    rating={lang.rating}
                    isEditing={true}
                    onRatingChange={(rating) => dispatch({
                      type: 'UPDATE_LANGUAGE',
                      index,
                      payload: { rating }
                    })}
                  />
                </div>

                <button
                  className={styles.removeButton}
                  onClick={() => dispatch({ type: 'REMOVE_LANGUAGE', index })}
                >
                  Remove Language
                </button>
              </div>
            ))}
          </div>
        );

      case 7: // Review
        return (
          <div className={styles.stepContent}>
            <div className={styles.reviewSection}>
              <h2>Profile Preview</h2>
              <div className={styles.profileHeader}>
                <div className={styles.banner}>
                  {bannerImage && <img src={bannerImage} alt="Banner" />}
                </div>
                <div className={styles.profileInfo}>
                  {profileImage && <img src={profileImage} alt="Profile" className={styles.profileImage} />}
                  <h3>{state.username}</h3>
                  <p>{state.title}</p>
                </div>
              </div>

              <div className={styles.reviewGroup}>
                <h3>Contact Information</h3>
                <p>Email: {state.email || 'Not provided'}</p>
                <p>Phone: {state.phoneNumber || 'Not provided'}</p>
                <p>Location: {state.address || 'Not provided'}</p>
                <p>Website: {state.webSite || 'Not provided'}</p>
              </div>

              <div className={styles.reviewGroup}>
                <h3>About</h3>
                <p>{state.bio || 'No bio provided'}</p>
              </div>

              <div className={styles.reviewGroup}>
                <h3>Experiences ({state.experiences.length})</h3>
                {state.experiences.map((exp, index) => (
                  <div key={index} className={styles.reviewItem}>
                    <p><strong>{exp.pos}</strong> at {exp.company}</p>
                    <p>{exp.startDate} - {exp.endDate || 'Present'}</p>
                  </div>
                ))}
              </div>

              <button className={styles.submitButton} onClick={handleSubmit}>
                Create Profile
              </button>
            </div>
          </div>
        );

      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        {steps.map((step, index) => (
          <div
            key={step}
            className={`${styles.progressStep} ${
              index <= currentStep ? styles.active : ''
            }`}
          >
            <div className={styles.stepNumber}>{index + 1}</div>
            <div className={styles.stepName}>{step}</div>
          </div>
        ))}
      </div>

      <div className={styles.mainContent}>
        {renderStepContent()}

        <div className={styles.navigation}>
          {currentStep > 0 && (
            <button className={styles.navButton} onClick={handlePrevious}>
              Previous
            </button>
          )}
          {currentStep < steps.length - 1 && (
            <button className={styles.navButton} onClick={handleNext}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCreateProfile;