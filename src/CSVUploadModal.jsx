import React, { useState, useEffect } from 'react';
import styles from './CSVUploadModal.module.css';

function CSVUploadModal({ onClose, onUpload, listType }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadListType, setUploadListType] = useState('backlog');

  useEffect(() => {
    if (listType) {
      setUploadListType(listType);
    }
  }, [listType]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      onUpload(selectedFile, uploadListType);
      onClose(); // Close this modal and let the loading modal take over
    }
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleListTypeChange = (event) => {
    setUploadListType(event.target.value);
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2>Upload CSV</h2>
        <p className={styles.description}>
          Select a CSV file to import games. This
          file should have columns for: name, platform, genre,
          estimatedPlaytime, releaseDate, and optionally imageUrl.
        </p>
        <div className={styles.formGroup}>
          <label>Import to:</label>
          <div>
            <label>
              <input
                type="radio"
                name="listType"
                value="backlog"
                checked={uploadListType === 'backlog'}
                onChange={handleListTypeChange}
              />
              Backlog
            </label>
            <label>
              <input
                type="radio"
                name="listType"
                value="wishlist"
                checked={uploadListType === 'wishlist'}
                onChange={handleListTypeChange}
              />
              Wishlist
            </label>
          </div>
        </div>
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
