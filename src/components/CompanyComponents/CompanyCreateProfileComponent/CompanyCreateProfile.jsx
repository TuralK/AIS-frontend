import React, { useReducer, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin, FaYoutube, FaGlobe, FaTimes } from 'react-icons/fa';
import styles from './CompanyCreateProfile.module.css';
import { createCompanyProfile } from '../../../api/CompanyApi/CompanyProfileApi/createCompanyProfileAPI'
import ProfilePic from '../../../assets/default_profile_icon.png'
import CompanyBackgound from "../../../assets/default_background.jpg";

const steps = [
  'Personal Info',
  'Contact',
  'Bio',
  'Social Media',
  'Review'
];

const socialMediaOptions = [
  { id: 'twitter', name: 'X', icon: <FaTwitter />, placeholder: 'https://x.com/yourcompany' },
  { id: 'instagram', name: 'Instagram', icon: <FaInstagram />, placeholder: 'https://instagram.com/yourcompany' },
  { id: 'facebook', name: 'Facebook', icon: <FaFacebook />, placeholder: 'https://facebook.com/yourcompany' },
  { id: 'linkedin', name: 'LinkedIn', icon: <FaLinkedin />, placeholder: 'https://linkedin.com/company/yourcompany' },
  { id: 'youtube', name: 'YouTube', icon: <FaYoutube />, placeholder: 'https://youtube.com/yourcompany' },
];

const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'ADD_SOCIAL_MEDIA':
      // Prevent duplicates
      if (state.socialMediaLinks.some(sm => sm.id === action.payload.id)) {
        return state;
      }
      return { ...state, socialMediaLinks: [...state.socialMediaLinks, action.payload] };
    case 'UPDATE_SOCIAL_MEDIA':
      return {
        ...state,
        socialMediaLinks: state.socialMediaLinks.map(sm => 
          sm.id === action.payload.id ? { ...sm, url: action.payload.url } : sm
        )
      };
    case 'REMOVE_SOCIAL_MEDIA':
      return {
        ...state,
        socialMediaLinks: state.socialMediaLinks.filter(sm => sm.id !== action.payload)
      };
  }
};

const initialState = {
  about: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  website: '',
  industry: '',
  socialMediaLinks: []
};

const CompanyCreateProfile = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [currentStep, setCurrentStep] = useState(0);
  const [profileFile, setProfileFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateStep = () => {
    const newErrors = {};
    
    switch(currentStep) {
      // Validate images if needed
      // case 0:
      //   break;
      case 1:
        if (state.contactEmail && !/^\S+@\S+\.\S+$/.test(state.contactEmail)) newErrors.contactEmail = 'Invalid email format';
        if (state.contactPhone && !/^\+\d{1,3}\d{6,}$/.test(state.contactPhone)) 
          newErrors.contactPhone = 'Invalid phone format (e.g. +1234567890)';
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
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (isProfile) {
      setProfileFile(file);
      setProfilePreview(url);
    } else {
      setBannerFile(file);
      setBannerPreview(url);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      
      if (profileFile) formData.append('companyLogo', profileFile);
      if (bannerFile) formData.append('bannerImage', bannerFile);

      const socialMedias= state.socialMediaLinks.reduce((acc, platform) => {
        if (platform.url.trim()) {
          acc[platform.id] = platform.url.trim();
        }
        return acc;
      }, {});

       Object.entries(state).forEach(([key, value]) => {
        if (key !== 'socialMediaLinks') {
          formData.append(key, value);
        }
      });

      // Append social media as JSON string (or null)
      formData.append(
        'socialMediaLinks',
        Object.keys(socialMedias).length > 0 
          ? JSON.stringify(socialMedias) 
          : null
      );
      
      await createCompanyProfile(formData);
      window.location.reload();
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
              <div className={styles.formGroup}>
                <label>Industry</label>
                  <input
                    type="text"
                    value={state.industry}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'industry', value: e.target.value })}
                    placeholder="Enter your industry (e.g., Software Engineering)"
                  />
              </div>
              <label>Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0], true)}
              />
              <div className={styles.imagePreviewContainer}>
                <img 
                  src={profilePreview || ProfilePic} 
                  alt="Profile Preview" 
                  className={styles.imagePreview} 
                />
                {profilePreview && (
                  <button
                    className={styles.deleteImageButton}
                    onClick={() => {
                      setProfileFile(null);
                      setProfilePreview(null);
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Banner Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0], false)}
              />
              <div  className={styles.bannerPreviewContainer}>
                <img 
                  src={bannerPreview || CompanyBackgound} 
                  alt="Profile Preview" 
                  className={styles.bannerPreview} 
                />
                {bannerPreview && (
                  <button
                    className={styles.deleteImageButton}
                    onClick={() => {
                      setBannerFile(null);
                      setBannerPreview(null);
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
              {/* {bannerPreview && (
                <img src={bannerPreview} alt="Banner Preview" className={styles.bannerPreview} />
              )} */}
            </div>
          </div>
        );

      case 1: // Contact
        return (
          <div className={styles.stepContent}>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                value={state.contactEmail}
                onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'contactEmail', value: e.target.value })}
              />
              {errors.contactEmail && <span className={styles.error}>{errors.contactEmail}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input
                value={state.contactPhone}
                onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'contactPhone', value: e.target.value })}
                placeholder="+CountryCode Number"
              />
              {errors.contactPhone && <span className={styles.error}>{errors.contactPhone}</span>}
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
                value={state.website}
                onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'website', value: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
          </div>
        );

      case 2: // Bio (with Industry field)
        return (
          <div className={styles.stepContent}>
            <div className={`${styles.formGroup} ${styles.aboutMeTextArea}`}>
              <label>About Your Company</label>
              <textarea
                value={state.about}
                onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'about', value: e.target.value })}
                rows={6}
              />
            </div>
          </div>
        );

      case 3: // Social Media
        return (
          <div className={styles.socialMediaStep}>
            <div className={styles.platformSelection}>
              <h3>Select Social Media Platforms</h3>
              <div className={styles.platformGrid}>
                {socialMediaOptions.map(platform => {
                  const isSelected = state.socialMediaLinks.some(sm => sm.id === platform.id);
                  return (
                    <button
                      key={platform.id}
                      className={`${styles.platformButton} ${isSelected ? styles.selected : ''}`}
                      onClick={() => {
                        if (isSelected) {
                          dispatch({ type: 'REMOVE_SOCIAL_MEDIA', payload: platform.id });
                        } else {
                          dispatch({ type: 'ADD_SOCIAL_MEDIA', payload: { ...platform, url: '' } });
                        }
                      }}
                      type="button"
                    >
                    {platform.icon}
                    <span>{platform.name}</span>
                  </button>
                  );
                }
                )}
              </div>
            </div>

            <div className={styles.platformInputs}>
              {state.socialMediaLinks.map(platform => (
                <div key={platform.id} className={styles.platformInputGroup}>
                  <div className={styles.platformHeader}>
                    <span className={styles.platformIcon}>{platform.icon}</span>
                    <span className={styles.platformName}>{platform.name}</span>
                    <button
                      className={styles.removeButton}
                      onClick={() => dispatch({ type: 'REMOVE_SOCIAL_MEDIA', payload: platform.id })}
                      type="button"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <input
                    type="url"
                    value={platform.url}
                    onChange={(e) => dispatch({
                      type: 'UPDATE_SOCIAL_MEDIA',
                      payload: { id: platform.id, url: e.target.value }
                    })}
                    placeholder={platform.placeholder}
                    className={styles.urlInput}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 4: // Review
        const missingUrls = state.socialMediaLinks.filter(sm => !sm.url.trim());
        const validSocialMedia = state.socialMediaLinks.filter(sm => sm.url.trim());
        
        return (
          <div className={styles.stepContent}>
            <div className={styles.reviewSection}>
              <h2>Profile Preview</h2>
              <div className={styles.profileHeader}>
                <div className={styles.banner}>
                  <img 
                    src={bannerPreview || CompanyBackgound} 
                    alt="Banner Preview" 
                    className={styles.bannerPreview} 
                  />
                </div>
                <div className={styles.profileInfo}>
                  <img 
                    src={profilePreview || ProfilePic} 
                    alt="Profile Preview" 
                    className={styles.imagePreview} 
                  />
                </div>
              <h3 className={styles.industryName}>{state.industry || 'No industry specified'}</h3>
              </div>
                  

              <div className={styles.reviewGroup}>
                <h3>Contact Information</h3>
                <p>Email: {state.contactEmail || 'Not provided'}</p>
                <p>Phone: {state.contactPhone || 'Not provided'}</p>
                <p>Location: {state.address || 'Not provided'}</p>
                <p>Website: {state.website || 'Not provided'}</p>
              </div>

              <div className={styles.reviewGroup}>
                <h3>About</h3>
                <p className={styles.aboutText}>{state.about || 'No bio provided'}</p>
              </div>

              <div className={styles.reviewGroup}>
                <h3>Social Media</h3>
                {missingUrls.length > 0 && (
                  <div className={styles.warningContainer}>
                    <h4 className={styles.warningTitle}>Missing URLs:</h4>
                    {missingUrls.map((platform) => (
                      <div key={platform.id} className={styles.warningItem}>
                        {platform.name} URL is required
                      </div>
                    ))}
                  </div>
                )}
                {validSocialMedia.length > 0 ? (
                  <div className={styles.socialMediaPreview}>
                    {state.socialMediaLinks.map((platform) => (
                      <div key={platform.id} className={styles.socialMediaLink}>
                        <span className={styles.socialMediaIcon}>{platform.icon}</span>
                        <a
                          href={platform.url.startsWith('http') ? platform.url : `https://${platform.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.socialMediaUrl}
                        >
                          {platform.url || 'No URL provided'}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No social media links provided</p>
                )}
              </div>

              <div className={styles.buttonContainer}>
                <button className={styles.submitButton} onClick={handleSubmit}>
                  Create Profile
                </button>
              </div>
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

export default CompanyCreateProfile;