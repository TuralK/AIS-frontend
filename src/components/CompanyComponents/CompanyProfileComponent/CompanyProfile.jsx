import React, { useState, useEffect } from 'react';

import { useMatches } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin, FaYoutube, FaGlobe, FaTimes, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { Pencil, Trash2 } from 'lucide-react';
import styles from "./CompanyProfile.module.css";
import CompanyBackground from "../../../assets/default_background.jpg";
import ProfilePic from "../../../assets/default_profile_icon.png";
import Loading from '../../LoadingComponent/Loading';
import CompanyCreateProfile from '../CompanyCreateProfileComponent/CompanyCreateProfile';
import { getCompanyProfile } from '../../../api/CompanyApi/CompanyProfileApi/getCompanyProfileAPI';
import { updateCompanyBannerImage } from '../../../api/CompanyApi/CompanyProfileApi/updateCompanyBannerImageAPI';
import { updateCompanyProfilePhoto } from '../../../api/CompanyApi/CompanyProfileApi/updateCompanyProfilePhotoAPI';
import { updateCompanyProfile } from '../../../api/CompanyApi/CompanyProfileApi/updateCompanyProfileAPI';
import { getCompanyAnnouncements } from '../../../api/CompanyApi/CompanyProfileApi/getCompanyAnnouncementsAPI';
import { getCompanyProfileById } from '../../../api/CompanyApi/CompanyProfileApi/getCompanyProfileByIdAPI';
import EmptyState from '../../UtilComponents/EmptyState';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { getCompanyReviews } from '../../../api/CompanyApi/CompanyProfileApi/getCompanyReviewsAPI';
import { fetchAnnouncements } from '../../../api/StudentApi/fetchAnnouncementsAPI'
import { getAnnouncementByCompanyId } from '../../../api/StudentApi/getAnnouncementsByCompanyIdAPI';


const baseUrl = 'http://localhost:3005';

const socialMediaOptions = [
  { name: 'twitter', icon: FaTwitter, domain: 'x.com' },
  { name: 'instagram', icon: FaInstagram, domain: 'instagram.com' },
  { name: 'linkedin', icon: FaLinkedin, domain: 'linkedin.com' },
  { name: 'facebook', icon: FaFacebook, domain: 'facebook.com' },
  { name: 'youtube', icon: FaYoutube, domain: 'youtube.com' }
];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const NavigationTabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["About", "Announcements", "Reviews"];
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

const SocialMediaField = ({ links, isEditing, onChange }) => {
  // Transform backend data to match expected format
  const transformedLinks = links.map(({ name, link }) => ({
    platform: name,
    url: link
  }));

  const availablePlatforms = socialMediaOptions.filter(option => 
    !transformedLinks.some(link => link.platform === option.name)
  );

  const handleAddLink = () => {
    if (availablePlatforms.length > 0) {
      onChange([...links, { 
        name: availablePlatforms[0].name, 
        link: `https://${availablePlatforms[0].domain}/` 
      }]);
    }
  };

  const handleRemoveLink = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    onChange(newLinks);
  };

  const handleChange = (index, field, value) => {
    const newLinks = links.map((link, i) => {
      if (i === index) {
        // Update the changed field
        const updatedLink = { ...link };

        // If platform name changes, update the link to match the new platform's domain
        if (field === 'name') {
          const newPlatform = socialMediaOptions.find(opt => opt.name === value);
          if (newPlatform) {
            updatedLink.name = value;
            updatedLink.link = `https://${newPlatform.domain}/`;
          }
        }
        // If link changes, ensure it has proper protocol
        else if (field === 'link') {
          const platform = socialMediaOptions.find(opt => opt.name === link.name);
          if (platform) {
            const baseUrl = `https://${platform.domain}/`;
            const userInput = value.replace(baseUrl, '');
            updatedLink.link = baseUrl + userInput;
          }
        }

        return updatedLink;
      }
      return link;
    });
    onChange(newLinks);
  };

  return (
    <div className={styles.socialMediaContainer}>
      <p className={styles.studentBioFieldLabel}>Social Media</p>
      
      <div className={styles.socialMediaLinks}>
        {links.map((link, index) => {
          const platformData = socialMediaOptions.find(
            opt => opt.name === link.name
          );
          const baseUrl = platformData ? `https://${platformData.domain}/` : '';
          
          return (
            <div key={index} className={styles.socialMediaItem}>
              {isEditing ? (
                <div className={styles.socialMediaEdit}>
                  <div className={styles.platformSelector}>
                    <div className={styles.selectedPlatform}>
                      {platformData ? (
                        <platformData.icon className={styles.dropdownIcon} />
                      ) : 'Select Platform'}
                    </div>
                    <div className={styles.platformDropdown}>
                      {socialMediaOptions
                        .filter(opt => 
                          !links.some((l, i) => 
                            l.name === opt.name && i !== index
                          )
                        )
                        .map((opt) => (
                          <div
                            key={opt.name}
                            className={styles.platformOption}
                            onClick={() => handleChange(index, 'name', opt.name)}
                          >
                            <opt.icon className={styles.dropdownIcon} />
                          </div>
                        ))}
                    </div>
                  </div>

                  <input
                  type="url"
                  value={link.link}
                  onChange={(e) => handleChange(index, 'link', e.target.value)}
                  onKeyDown={(e) => {
                    // Prevent editing of the base URL
                    if (platformData) {
                      const baseLength = baseUrl.length;
                      const cursorPosition = e.target.selectionStart;
                      
                      if (
                        (e.key === 'Backspace' || e.key === 'Delete') &&
                        cursorPosition <= baseLength
                      ) {
                        e.preventDefault();
                      }
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const pastedData = e.clipboardData.getData('text');
                    const newValue = baseUrl + pastedData.replace(/^https?:\/\/[^/]+\//, '');
                    handleChange(index, 'link', newValue);
                  }}
                  className={styles.socialMediaInput}
                  placeholder={platformData ? `${baseUrl}username` : ''}
                />
                  
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(index)}
                    className={styles.removeButton}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : platformData ? (
                 <a
                  href={
                    link.link.startsWith('http') 
                      ? link.link 
                      : `https://${link.link}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialMediaLink}
                >
                  <platformData.icon className={styles.socialMediaIcon} />
                </a>
              ) : null}
            </div>
          );
        })}
      </div>

      {isEditing && availablePlatforms.length > 0 && (
        <button
          type="button"
          onClick={handleAddLink}
          className={styles.addButton}
        >
          <FaPlus className={styles.addIcon} />
        </button>
      )}
    </div>
  );
};

const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const AnnouncementCard = ({ showBothDates, announcement, onClick }) => {
  const imageSrc = announcement.image ? `${baseUrl}/${announcement.image}` : CompanyBackground;
    
  return (
    <div className={styles.announcementCard} onClick={() => onClick(announcement)}>
      <img 
        src={imageSrc} 
        alt={announcement?.announcementName || 'Announcement'} 
        className={styles.announcementImage}
      />
      <div className={styles.announcementContent}>
        <h3 className={styles.announcementTitle}>
          {announcement?.announcementName || 'Untitled Announcement'}
        </h3>
        <p className={styles.announcementDescription}>
          {truncateText(announcement?.description, 50)}
          {(announcement?.description?.length || 0) > 50 && (
            <span className={styles.readMore}>Read more</span>
          )}
        </p>
        {
          showBothDates ? (
            <div className={styles.announcementDates}>
              <span>Start: {formatDate(announcement?.startDate)}</span>
              <span>End: {formatDate(announcement?.endDate)}</span>
            </div>
          ) : <span className={styles.announcementDates}>End: {formatDate(announcement?.endDate)}</span>
        }
        
      </div>
    </div>
  );
};

const CompanyProfile = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const matches = useMatches();
  const { t } = useTranslation();
  const currentMatch = matches[matches.length - 1];
  const titleKey = currentMatch?.handle?.titleKey;

  React.useEffect(() => {
    const baseTitle = 'IMS';
    document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle;
  }, [titleKey, t]);


  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [activeTab, setActiveTab] = useState("About");
  const [isEditing, setIsEditing] = useState(false);

  const [profilePicPreview, setProfilePicPreview] = useState(ProfilePic);
  const [profilePicFile, setProfilePicFile] = useState(null);
  
  const [backgroundPicPreview, setBackgroundPicPreview] = useState(CompanyBackground);
  const [backgroundPic, setBackgroundPic] = useState(null);

  // for restoring on Cancel
  const [originalState, setOriginalState] = useState({});

  const [industry, setIndustry] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [companyData, setCompanyData] = useState(null);
  const [location, setLocation] = useState(null);
  const [email, setEmail] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [website, setWebsite] = useState(null);
  const [socialMediaLinks, setSocialMediaLinks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);

  const [isAnnouncementsLoading, setIsAnnouncementsLoading] = useState(false);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const [hasFetchedAnnouncements, setHasFetchedAnnouncements] = useState(false);
  const [hasFetchedReviews, setHasFetchedReviews] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  const [loading, setLoading] = useState(true);

  const [bioFields, setBioFields] = useState([
    { label: "Location", value: "", isClickable: true },
    { label: "Email", value: "", isClickable: true },
    { label: "Phone", value: "", isClickable: true },
    { label: "Website", value: "", isClickable: true }
  ]);

  const isValidPhone = (phone) => {
    const phoneNumber = parsePhoneNumberFromString(phone);
    return phoneNumber?.isValid() === true;
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

  useEffect(() => {
    const loadData = async () => {
      try {
        let profile;
        let rating;
        setLoading(true);
        if (!id) {
           ({ profile, rating } = await getCompanyProfile());
        } else {
          ({ profile, rating } = await getCompanyProfileById(id));
        }
        
        setCompanyData(profile);
        // initialize all editing state from fetched data:
        setIndustry(profile.industry || "");
        setAboutText(profile.about || "");
        setLocation(profile.address || "");
        setEmail(profile.contactEmail || "");
        setPhoneNumber(profile.contactPhone || "");
        setWebsite(profile.website || "");
        setRating(rating || 'N/A');
        const linksObj = JSON.parse(profile.socialMediaLinks);
        const linksArray = Object.entries(linksObj).map(
          ([name, link]) => ({ name, link })
        );
        setSocialMediaLinks(linksArray || "");

        setProfilePicPreview(profile.companyLogo ? `${baseUrl}/${profile.companyLogo}` : ProfilePic);
        setBackgroundPicPreview(profile.bannerImage ? `${baseUrl}/${profile.bannerImage}` : CompanyBackground);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    setSelectedAnnouncement(null);
  }, [activeTab]);

  useEffect(() => {
    const fetchCompanyAnnouncements = async () => {
      if (activeTab === "Announcements" && !hasFetchedAnnouncements && announcements.length === 0) {
        try {
          setIsAnnouncementsLoading(true);
          let response;
          if (!id) {
            response = await getCompanyAnnouncements();
            setAnnouncements(response.announcements);
          } else {
            response = await getAnnouncementByCompanyId(id);
            setAnnouncements(response);
          }
          setHasFetchedAnnouncements(true);
        } catch (error) {
          console.error('Error loading announcements:', error);
        } finally {
          setIsAnnouncementsLoading(false);
        }
      }
    };

    fetchCompanyAnnouncements();
  }, [activeTab, hasFetchedAnnouncements, announcements.length]);

 useEffect(() => {
    const fetchReviews = async () => {
      if (activeTab === "Reviews" && !hasFetchedReviews && reviews.length === 0) {
        try {
          setIsReviewsLoading(true);
          const response = await getCompanyReviews();
          setReviews(response);
          setHasFetchedReviews(true);
        } catch (error) {
          console.error('Error loading reviews:', error);
        } finally {
          setIsReviewsLoading(false);
        }
      }
    };

    fetchReviews();
  }, [activeTab, hasFetchedReviews, reviews.length]);

  const handleBackToAnnouncements = () => {
    setSelectedAnnouncement(null);
    setActiveTab("Announcements");
  };

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
  }, [location, email, phoneNumber, website]);

  const handleEditToggle = async () => {
    if (!isEditing) {
      // save originals for cancel
      setOriginalState({
        profilePicFile,
        profilePicPreview,
        backgroundPic,
        backgroundPicPreview,
        bioFields: JSON.parse(JSON.stringify(bioFields)),
        aboutText,
        industry,
        socialMediaLinks: [...socialMediaLinks]
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

        if (errors.length > 0) {
          alert("Please fix the following errors:\n\n" + errors.join("\n"));
          return;
        }

        try {
          // Update industry if changed
          // Update bio if changed
          const payload = {};

          if (industry !== originalState.industry) {
            payload.industry = industry;
          }

          if (aboutText !== originalState.aboutText) {
            payload.about = aboutText;
          }

          // Update phone if changed
          const originalPhone = originalState.bioFields.find(f => f.label === 'Phone').value;
          if (phoneNumber !== originalPhone) {
            payload.contactPhone = phoneNumber;
          }

          // Update email if changed
          const originalEmail = originalState.bioFields.find(f => f.label === 'Email').value;
          if (email !== originalEmail) {
            payload.contactEmail = email;
          }

          // Update location if changed
          const originalLocation = originalState.bioFields.find(f => f.label === 'Location').value;
          if (location !== originalLocation) {
            payload.address = location;
          }

          // Update website if changed
          const originalWebsite = originalState.bioFields.find(f => f.label === 'Website').value;
          if (website !== originalWebsite) {
            payload.website = website;
          }

          const originalSocial = originalState.socialMediaLinks.reduce(
            (acc, { name, link }) => ({ ...acc, [name]: link }),
            {}
          );
          const currentSocial = socialMediaLinks.reduce(
            (acc, { name, link }) => ({ ...acc, [name]: link }),
            {}
          );
          if (JSON.stringify(originalSocial) !== JSON.stringify(currentSocial)) {
            payload.socialMediaLinks = JSON.stringify(currentSocial);
          }

          if (Object.keys(payload).length > 0) {
            await updateCompanyProfile(payload);
          } else {
            console.log('No changes to save.');
          }


          if (backgroundPic == "Deleted") {
            setBackgroundPic(null);
            // deleteStudentBannerImage();
          } else if(backgroundPic && (backgroundPic != originalState.backgroundPic)) {
            const formData = new FormData();
            formData.append('bannerImage', backgroundPic);
            await updateCompanyBannerImage(formData);
          }

          if (profilePicFile == 'Deleted') {
            setProfilePicFile(null);
            // deleteStudentProfilePhoto();
          } else if (profilePicFile && (profilePicFile != originalState.profilePicFile)) {
            const formData = new FormData();
            formData.append('companyLogo', profilePicFile);
            await updateCompanyProfilePhoto(formData);
          }

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
    setIndustry(originalState.industry);
    setAboutText(orig.aboutText);
    setSocialMediaLinks(orig.socialMediaLinks);
    setIsEditing(false);
  };

  if (loading) return <Loading />;

  if (!companyData && id) {
    return (
      <EmptyState
        // icon="briefcase-off"
        title="No Company Here"
        description="Looks like this profile hasn’t been created yet."
        actionText="Go Back"
        actionTo={() => navigate(-1)}
      />
    );
  }
  else if (!companyData) { return <CompanyCreateProfile /> }

  const renderTabContent = () => {
    if (!companyData) return null;

    if (selectedAnnouncement) {
      return (
        <div className={styles.announcementDetailContainer}>
          <button 
            className={styles.backButton}
            onClick={handleBackToAnnouncements}
          >
            <FaArrowLeft />
            Back to All Announcements
          </button>
          <img
            src={selectedAnnouncement.image ? `${baseUrl}/${selectedAnnouncement.image}` : CompanyBackground}
            alt={selectedAnnouncement.announcementName}
            className={styles.announcementDetailImage}
          />
          <h2>{selectedAnnouncement.announcementName}</h2>
          <p className={styles.announcementDescription}>
            {selectedAnnouncement.description}
          </p>
          {
            !id ? (
            <div className={styles.announcementDates}>
              <p><strong>Start Date:</strong> {formatDate(selectedAnnouncement.startDate)}</p>
              <p><strong>End Date:</strong> {formatDate(selectedAnnouncement.endDate)}</p>
            </div>
            ) : <p className={styles.announcementDates}><strong>End Date:</strong> {formatDate(selectedAnnouncement.endDate)}</p>
          }

        </div>
      );
    }
    
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

      case "Announcements":
        return (
          <div className={styles.announcementsContainer}>
            {isAnnouncementsLoading ? (
              <div className={styles.loadingContainer}>
                <Loading />
              </div>
            ) : (
              <>
                {announcements.length > 0 ? (
                  <div className={styles.announcementsGrid}>
                    {announcements.map((announcement, index) => (
                      <AnnouncementCard 
                        showBothDates={!id}
                        key={index} 
                        announcement={announcement}
                        onClick={setSelectedAnnouncement}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={styles.noAnnouncements}>
                    No announcements available
                  </div>
                )}
              </>
            )}
          </div>
        );

      case "Reviews":
        return (
          <div className={styles.reviewsContainer}>
            {isReviewsLoading ? (
              <div className={styles.loadingContainer}>
                <Loading />
              </div>
            ) : (
              reviews.length === 0 ? (
                <div className={styles.noAnnouncements}>
                  No reviews available
                </div>
              ) : (
                <div className={styles.reviewsContainer}>
                  {/* Render reviews here */}
                </div>
              )
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
          defaultImage={CompanyBackground}
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

          <h1 className={styles.studentProfileTitle}>{companyData.Company.name || 'Company Name'}</h1>
          {isEditing ? (
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className={styles.editableIndustryInput}
              placeholder="Enter industry"
            />
          ) : (
            <p className={styles.studentProfileSubtitle}>{industry}</p>
          )}

          {!id ? (
            isEditing ? (
              <div className="flex space-x-2 mb-5">
                <button className="flex-1 py-2.5 bg-black text-white font-medium" onClick={handleEditToggle}>Save</button>
                <button className="flex-1 py-2.5 bg-gray-200 text-gray-800 font-medium" onClick={handleCancelEdit}>Cancel</button>
              </div>
            ) : (
              <button className="w-full py-2.5 bg-black text-white font-medium mb-5" onClick={handleEditToggle}>Edit Details</button>
            )
          ) : null }

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
          <SocialMediaField
            links={socialMediaLinks}
            isEditing={isEditing}
            onChange={(newLinks) => setSocialMediaLinks(newLinks)}
          />
        </div>

        <div className={styles.studentProfileNavTabsContainer}>
          <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
