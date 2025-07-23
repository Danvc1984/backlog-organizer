import React, { useState } from 'react';
import styles from './LinkSteamModal.module.css';
import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';

const STEAM_API_KEY = import.meta.env.VITE_STEAM_API_KEY;

function LinkSteamModal({ onClose, onLinkSteam, currentUser, showNotification }) {
  const [steamInput, setSteamInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const resolveSteamId = async (input) => {
    // Check if the input is already a 64-bit Steam ID (purely numeric, 17 digits)
    if (/^7656119[0-9]{10}$/.test(input)) {
      return input;
    }

    // Assume it's a vanity URL or full profile URL
    const vanityUrlMatch = input.match(/(?:https?:\/\/steamcommunity\.com\/(?:id|profiles)\/)?([a-zA-Z0-9_]+)/i);
    const vanityUrl = vanityUrlMatch ? vanityUrlMatch[1] : input;
    
    if (vanityUrl === 'https' || vanityUrl === 'http' ) {
      throw new Error('Invalid Steam URL or ID provided.');
    }
console.log(vanityUrl);
    try {
      // Use the proxy endpoint for Steam API calls
      const response = await fetch(`/steamapi/ISteamUser/ResolveVanityURL/v0001/?key=${STEAM_API_KEY}&vanityurl=${vanityUrl}`);
      const data = await response.json();

      if (data.response.success === 1) {
        return data.response.steamid;
      } else {
        throw new Error(data.response.message || 'Could not resolve Steam ID from the provided input.');
      }
    } catch (err) {
      console.error("Error resolving Steam ID:", err);
      throw new Error(`Failed to resolve Steam ID: ${err.message}`);
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
    
    if (!STEAM_API_KEY) {
      setError('Steam API key is not configured. Please contact support.');
      showNotification('error', 'Steam API key is not configured.');
      setLoading(false);
      return;
    }

    try {
      const steam64Id = await resolveSteamId(steamInput);

      // Update user document in Firestore
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        steamId: steam64Id,
        hasSteamLinked: true,
      });

      onLinkSteam(steam64Id); // Propagate the 64-bit ID to parent
      showNotification('success', 'Steam account linked successfully!');
      onClose();
    } catch (err) {
      setError(err.message);
      showNotification('error', err.message);
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
