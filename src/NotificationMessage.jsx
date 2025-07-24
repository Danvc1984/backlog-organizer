import React, { useEffect } from 'react';
import styles from './NotificationMessage.module.css';

function NotificationMessage({ message, type, onDismiss }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 3000); // Dismiss after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className={`${styles.notificationContainer} ${styles[type]}`}>
      <p>{message}</p>
      <button onClick={onDismiss} className={styles.dismissButton}>×</button>
    </div>
  );
}

export default NotificationMessage;
