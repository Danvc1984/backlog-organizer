import React, { useState } from 'react';
import styles from './CSVUploadModal.module.css';

function CSVUploadModal({ onClose, onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      onClose(); // Close this modal and let the loading modal take over
    }
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2>Upload CSV</h2>
        <p className={styles.description}>
          Select a CSV file to import games into your backlog. This
          file should have columns for: title, platform,
          estimatedDuration, gameCoverArt, and
          releaseDate.
        </p>
        <div className={styles.formGroup}>
          <label htmlFor="csvFile">CSV File:</label>
          <input
            type="file"
            id="csvFile"
            name="csvFile"
            accept=".csv"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          <span className={styles.fileName}>
            {selectedFile ? selectedFile.name : 'No file selected.'}
          </span>
        </div>
        <div className={styles.modalActions}>
        <button
            className="primary-accent"
            onClick={handleUploadClick}
            disabled={!selectedFile}
          >
             Upload
             </button>
          <button className="secondary-accent" onClick={onClose}>Cancel</button>
          
           
        </div>
      </div>
    </div>
  );
}

export default CSVUploadModal;
