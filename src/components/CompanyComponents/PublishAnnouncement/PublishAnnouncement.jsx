import React, { useState, useRef, useEffect } from "react"
import styles from "./PublishAnnouncement.module.css"
import { publishAnnouncement } from "../../../api/CompanyApi/publishAnnouncementAPI"
import { AiOutlineInfoCircle } from "react-icons/ai"
import { useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAllSkills } from "../../../api/CompanyApi/getAllSkillsAPI";

export default function PublishAnnouncement() {
  const matches = useMatches();
  const { t } = useTranslation();
  const currentMatch = matches[matches.length - 1];
  const titleKey = currentMatch?.handle?.titleKey;

  React.useEffect(() => {
    const baseTitle = 'IMS';
    document.title = titleKey ? `${baseTitle} | ${t(titleKey)}` : baseTitle;
  }, [titleKey, t]);

  // New state variables for inputs
  const [title, setTitle] = useState("")
  const [details, setDetails] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [image, setImage] = useState(null)     // For image preview (URL)
  const [imageFile, setImageFile] = useState(null)    // The actual file object
  const [imageSize, setImageSize] = useState({ width: "", height: "" })
  const [skills, setSkills] = useState([])
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);


  const startDatePickerRef = useRef(null)
  const endDatePickerRef = useRef(null)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await getAllSkills();
        setSkills(response);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  const handleSkillSelection = (e) => {
    const skillId = e.target.value;
    if (e.target.checked) {
      setSelectedSkillIds((prev) => [...prev, skillId]);
    } else {
      setSelectedSkillIds((prev) => prev.filter((id) => id !== skillId));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      alert(t("publishAnnouncements.startDateBeforeEndDate"));
      return false;
    }

    const isoStartDate = new Date(startDate).toISOString();
    const isoEndDate = new Date(endDate).toISOString();

    const formData = new FormData();
    formData.append("announcementName", title);
    formData.append("description", details);
    selectedSkillIds.forEach((id) => {
      formData.append("skillIds", id); // backend must support receiving an array like this
    });
    formData.append("startDate", isoStartDate);
    formData.append("endDate", isoEndDate);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await publishAnnouncement(formData);
      alert(response.data.message);
      window.location.reload();
    } catch (error) {
      alert(error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      const img = new Image()
      img.onload = () => {
        if (imageSize.width && imageSize.height) {
          if (
            img.width !== Number(imageSize.width) ||
            img.height !== Number(imageSize.height)
          ) {
            alert(t("publishAnnouncements.imageSizeMismatch", { width: imageSize.width, height: imageSize.height }));
            return
          }
        }
        setImage(objectUrl) // Set preview image URL
        setImageFile(file)  // Store the file to send to the backend
      }
      img.src = objectUrl
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
    setImageFile(null)
  }

  const formatDateInput = (value) => {
    // Remove any non-digits
    const numbers = value.replace(/\D/g, "")
    if (numbers.length === 0) return ""
    let formattedDate = numbers
    if (numbers.length > 2) {
      formattedDate = numbers.slice(0, 2) + "/" + numbers.slice(2)
    }
    if (numbers.length > 4) {
      formattedDate = formattedDate.slice(0, 5) + "/" + formattedDate.slice(5, 7)
    }
    return formattedDate
  }

  const handleDateChange = (e, setDate) => {
    const input = e.target.value.replace(/[^0-9]/g, "")
    const formatted = formatDateInput(input)
    setDate(formatted)
  }

  const handleDatePickerChange = (e, setDate) => {
    setDate(e.target.value);
  }

  const handleCalendarClick = (ref) => {
    if (ref.current) {
      ref.current.showPicker()
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{t("publishAnnouncements.pageTitle")}</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">{t("publishAnnouncements.title")}</label>
          <input
            type="text"
            id="title"
            placeholder={t("publishAnnouncements.enterAnnouncementTitle")}
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="details">{t("publishAnnouncements.details")}</label>
          <textarea
            id="details"
            placeholder={t("publishAnnouncements.enterAnnouncementDetails")}
            className={styles.textarea}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>

        <div className={styles.dateContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="startDate" className={styles.dateDiv}>
              {t("publishAnnouncements.startDate")}&nbsp;
              <AiOutlineInfoCircle
                className={styles.infoIcon}
                title={t("publishAnnouncements.startDateInfo")}
              />
            </label>
            <input
              type="date"
              id="startDate"
              className={styles.input}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="endDate" className={styles.dateDiv}>
              {t("publishAnnouncements.endDate")}&nbsp;
              <AiOutlineInfoCircle
                className={styles.infoIcon}
                title={t("publishAnnouncements.endDateInfo")}
              />
            </label>
            <input
              type="date"
              id="endDate"
              className={styles.input}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>{t("publishAnnouncements.selectSkills")}</label>
          <div className={styles.skillsList}>
            {skills.map((skill) => {
              const isSelected = selectedSkillIds.includes(skill.id.toString());
              return (
                <div
                    key={skill.id}
                    className={`${styles.skillTag} ${isSelected ? styles.selectedSkillTag : ''}`}
                    onClick={() => handleSkillSelection({ target: { value: skill.id.toString(), checked: !isSelected } })}
                >
                    {skill.name}
                </div>
              );
          })}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>{t("publishAnnouncements.uploadImage")}</label>
          <div className={styles.imageSizeInputs}>
            <input
              type="number"
              placeholder={t("publishAnnouncements.widthPx")}
              value={imageSize.width}
              onChange={(e) => setImageSize({ ...imageSize, width: e.target.value })}
              className={styles.imageSizeInput}
              hidden={true}
            />
            <input
              hidden={true}
              type="number"
              placeholder={t("publishAnnouncements.heightPx")}
              value={imageSize.height}
              onChange={(e) => setImageSize({ ...imageSize, height: e.target.value })}
              className={styles.imageSizeInput}
            />
          </div>
          <div className={styles.uploadArea}>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageUpload}
              className={styles.fileInput}
            />
            {image ? (
              <div className={styles.imagePreview}>
                <img
                  src={image}
                  alt="Preview"
                  className={styles.previewImage}
                />
                <div className={styles.imageOverlay}>
                  <button
                    type="button"
                    onClick={() => document.getElementById("image").click()}
                    className={styles.editButton}
                  >
                    {t("publishAnnouncements.edit")}
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className={styles.removeButton}
                  >
                    {t("publishAnnouncements.remove")}
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.uploadContent}>
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vvHU83MSLQY1qy3nmLj9C8yV2bUJYi.png"
                  alt="Upload icon"
                  className={styles.uploadIcon}
                />
                <span>{t("publishAnnouncements.clickToUpload")}</span>
              </div>
            )}
          </div>
        </div>

        <button type="submit" className={styles.submitButton}>
          {t("publishAnnouncements.publishButton")}
        </button>
      </form>
    </div>
  )
}