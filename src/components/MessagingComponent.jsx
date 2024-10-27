import React from 'react';
import styles from './Messaging.module.css';
import { useTranslation } from 'react-i18next';

const Messaging = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.messaging}>
      <h3 className={styles.titleMessageBox}>{t('messageTitle')}</h3>
      <div className={styles.messageList}>
        <p className={styles.noMessages}>{t('noMessage')}</p>
      </div>
      <div className={styles.newMessage}>
        <input type="text" placeholder={t('placeholderMessage')} className={styles.messageInput} />
        <button className={styles.sendButtonMessage}>{t('send')}</button>
      </div>
    </div>
  );
};

export default Messaging;