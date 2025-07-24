import React from 'react';
import styles from './CSVUploadLoadingModal.module.css';

function CSVUploadLoadingModal() {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.spinner}></div>
        <p className={styles.message}>Importing games from CSV...</p>
        <p className={styles.subMessage}>Processing file and enriching details.</p>
      </div>
    </div>
  );
}

export default CSVUploadLoadingModal;
