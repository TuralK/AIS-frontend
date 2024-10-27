import React, { useState, useEffect, useRef } from 'react';
import styles from './AnnouncementList.module.css';
import { useTranslation } from 'react-i18next';

const AnnouncementList = ({ announcements = [], updateAnnouncement }) => {
  const { t } = useTranslation();
  const [editingId, setEditingId] = useState(null);
  const [newContent, setNewContent] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const textareaRefs = useRef({}); // Her bir textarea için referanslar

  const handleUpdateClick = (id, currentContent) => {
    setEditingId(id);
    setNewContent(currentContent);
  };

  const handleUpdateSubmit = () => {
    if (newContent.trim() !== '') {
      updateAnnouncement(editingId, newContent);
      setEditingId(null);
      setNewContent('');
      setUpdateMessage(t('announcement_updated'));
      setTimeout(() => setUpdateMessage(''), 3000);
    }
  };

  const handleDelete = (id) => {
    setDeleteMessage(t('announcement_deleted'));
    setTimeout(() => setDeleteMessage(''), 3000);
  };

  // newContent değiştiğinde textarea boyutunu ayarla
  useEffect(() => {
    const textarea = textareaRefs.current[editingId];
    if (textarea) {
      textarea.style.height = 'auto'; // Yüksekliği sıfırla
      textarea.style.height = `${textarea.scrollHeight}px`; // İçeriğe göre ayarla
    }
  }, [newContent, editingId]); // editingId'yi de bağımlılıklar listesine ekle

  return (
    <div className={styles.announcementList}>
      <h3 className={styles.titleAnnouncementList}>{t('announcements')}</h3>
      {deleteMessage && <div className={styles.deleteMessage}>{deleteMessage}</div>}
      {updateMessage && <div className={styles.updateMessage}>{updateMessage}</div>}
      {/* Wrap announcements in a grid layout */}
      <div className={styles.announcementGrid}>
        {announcements.map((announcement) => (
          <div key={announcement.id} className={styles.announcement}>
            <p>{announcement.content}</p>
            <div className={styles.actions}>
              {editingId !== announcement.id && (
                <>
                  <button
                    className={styles.updateButton}
                    onClick={() => handleUpdateClick(announcement.id, announcement.content)}
                  >
                    {t('update')}
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(announcement.id)}
                  >
                    {t('delete')}
                  </button>
                </>
              )}
            </div>
            {editingId === announcement.id && (
              <div className={styles.updateForm}>
                <textarea
                  ref={(el) => (textareaRefs.current[announcement.id] = el)} // Her textarea için referans kaydet
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder={t('enter_new_content')}
                  className={styles.updateInput}
                  rows={1} // Başlangıçta tek satır
                  style={{ height: 'auto', overflowY: 'auto' }} // Otomatik yüksekliği sağlamak için stil
                />
                <div className={styles.buttonGroup}>
                  <button onClick={handleUpdateSubmit} className={styles.submitUpdateButton}>
                    {t('submit')}
                  </button>
                  <button onClick={() => setEditingId(null)} className={styles.cancelUpdateButton}>
                    {t('cancel')}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementList;
