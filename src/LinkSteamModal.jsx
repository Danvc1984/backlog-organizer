import React, { useState } from 'react';
import styles from './LinkSteamModal.module.css';

function LinkSteamModal({ onClose, onLinkSteam }) {
  const [steamId, setSteamId] = useState('');

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (steamId) {
      onLinkSteam(steamId);
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <div className={styles.modalHeader}>
          <h2>Link Your Steam Profile</h2>
          <p>Enter your Steam profile's vanity URL or Steam ID to import your game library.</p>
          <p className={styles.instruction}>Please ensure your Steam profile is set to public for successful integration.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="steamId">Steam ID or Vanity URL:</label>
            <input
              type="text"
              id="steamId"
              value={steamId}
              onChange={(e) => setSteamId(e.target.value)}
              placeholder="e.g.,steamcommunity.com/id/gabenewell or 76561198000000000"
              required
            />
          </div>
          <div className={styles.modalActions}>
            
            <button type="submit" className="primary-accent" disabled={!steamId}>
              Link Steam Account
            </button>
            <button type="button" className="secondary-accent" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LinkSteamModal;
