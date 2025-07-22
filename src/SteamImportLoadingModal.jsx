import React from 'react';
import styles from './SteamImportLoadingModal.module.css';

function SteamImportLoadingModal({ onClose }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.spinner}></div>
        <p className={styles.message}>Importing your Steam library...</p>
        <p className={styles.subMessage}>Please wait, this may take a moment. Note that the system will import your full library</p>
      </div>
    </div>
  );
}

export default SteamImportLoadingModal;
