import React, { useState } from 'react';
import styles from './LinkSteamModal.module.css';
import { app } from './firebase'; // Import 'app'
import { getFunctions, httpsCallable } from 'firebase/functions'; // Import for Cloud Functions

// Initialize Firebase Functions
const functions = getFunctions(app);
const resolveSteamIdCallable = httpsCallable(functions, 'resolveSteamId');

function LinkSteamModal({ onClose, onLinkSteam, currentUser, showNotification }) {
  const [steamInput, setSteamInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!currentUser || !currentUser.uid) {
      setError('User not authenticated. Please sign in first.');
      showNotification('error', 'User not authenticated.');
      setLoading(false);
      return;
    }
    
    try {
      const result = await resolveSteamIdCallable({ steamInput });
      const steam64Id = result.data.steamId;

      onLinkSteam(steam64Id); // Propagate the 64-bit ID to parent
      showNotification('success', result.data.message);
      onClose();
    } catch (err) {
      console.error("Error linking Steam account: ", err);
      const errorMessage = err.details?.message || err.message || 'An unknown error occurred.';
      setError(errorMessage);
      showNotification('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <div className={styles.modalHeader}>
          <h2>Link Your Steam Profile</h2>
          {currentUser && currentUser.hasSteamLinked ? (
            <p className={styles.instruction}>Your Steam account (ID: {currentUser.steamId}) is already linked!</p>
          ) : (
            <p>Enter your Steam profile's vanity URL or Steam ID to import your game library.</p>
          )}
          <p className={styles.instruction}>Please ensure your Steam profile is set to public for successful integration.</p>
        </div>
        {currentUser && currentUser.hasSteamLinked ? (
          <div className={styles.modalActions}>
            <button type="button" className="secondary-accent" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="steamId">Steam ID or Vanity URL:</label>
              <input
                type="text"
                id="steamId"
                value={steamInput}
                onChange={(e) => setSteamInput(e.target.value)}
                placeholder="e.g., steamcommunity.com/id/gabenewell or 76561198000000000"
                required
                disabled={loading}
              />
            </div>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <div className={styles.modalActions}>
              <button type="submit" className="primary-accent" disabled={!steamInput || loading}>
                {loading ? 'Linking...' : 'Link Steam Account'}
              </button>
              <button type="button" className="secondary-accent" onClick={onClose} disabled={loading}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default LinkSteamModal;
