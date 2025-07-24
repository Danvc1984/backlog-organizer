import React from 'react';
import styles from './SteamImportConfirmationModal.module.css';

function SteamImportConfirmationModal({ onConfirm, onCancel }) {
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onCancel}>×</button>
        <h2>Confirm Steam Import</h2>
        <p>
          Are you sure you want to import your games from Steam? This might create
          duplicate entries if some games already exist in your backlog.
        </p>
        <div className={styles.modalActions}>
          <button type="button" className="primary-accent" onClick={onConfirm}>
            Import
          </button>
          <button type="button" className="secondary-accent" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default SteamImportConfirmationModal;
