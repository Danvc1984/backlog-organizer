import React, { useState, useEffect } from 'react';
import styles from './AddEditGameModal.module.css';
import { app } from './firebase'; // Import 'app'
import { getFunctions, httpsCallable } from 'firebase/functions'; // Import for Cloud Functions

// Initialize Firebase Functions
const functions = getFunctions(app);
const fetchGameDetailsCallable = httpsCallable(functions, 'fetchGameDetails');

function AddEditGameModal({ gameToEdit, onClose, onSave, listType }) {
  const [game, setGame] = useState(gameToEdit || {
    name: '',
    imageUrl: '',
    platform: '',
    genre: '',
    estimatedPlaytime: '',
    releaseDate: '',
    list: listType || 'backlog',
  });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (gameToEdit) {
      setGame(gameToEdit);
    } else {
      setGame({
        name: '',
        imageUrl: '',
        platform: '',
        genre: '',
        estimatedPlaytime: '',
        releaseDate: '',
        list: listType || 'backlog',
      });
    }
  }, [gameToEdit, listType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGame(prevGame => ({
      ...prevGame,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    if (!game.name) return;

    setIsSearching(true);
    try {
      const result = await fetchGameDetailsCallable({ gameName: game.name });
      
      if (result.data.success) {
        const fetchedGame = result.data.gameDetails;
        setGame(prevGame => ({
          ...prevGame,
          ...fetchedGame,
        }));
      } else {
        console.warn(result.data.message);
        // Optionally show a notification to the user that no details were found
      }
    } catch (error) {
      console.error("Error fetching game data from RAWG via Cloud Function:", error);
      // Improved error message extraction
      const errorMessage = error.details?.message || error.message || 'An unknown error occurred.';
      alert(`Failed to auto-fill details: ${errorMessage}`); // Using alert for simplicity here, can integrate with notification system
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(game);
    onClose();
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
        <h2>{gameToEdit ? 'Edit Game' : 'Add New Game'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Add to:</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="list"
                  value="backlog"
                  checked={game.list === 'backlog'}
                  onChange={handleChange}
                />
                Backlog
              </label>
              <label>
                <input
                  type="radio"
                  name="list"
                  value="wishlist"
                  checked={game.list === 'wishlist'}
                  onChange={handleChange}
                />
                Wishlist
              </label>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="name">Game Title:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={game.name}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={handleSearch} disabled={isSearching || !game.name}>
              {isSearching ? 'Searching...' : 'Auto-fill Details'}
            </button>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="imageUrl">Game Cover URL:</label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={game.imageUrl}
              onChange={handleChange}
            />
            {game.imageUrl && (
              <img src={game.imageUrl} alt="Game Cover" className={styles.gameCoverPreview} />
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="releaseDate">Release Date:</label>
            <input
              type="text"
              id="releaseDate"
              name="releaseDate"
              value={game.releaseDate}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="genre">Genre(s):</label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={game.genre}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="platform">Platform(s):</label>
            <input
              type="text"
              id="platform"
              name="platform"
              value={game.platform}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="estimatedPlaytime">Estimated Duration:</label>
            <input
              type="text"
              id="estimatedPlaytime"
              name="estimatedPlaytime"
              value={game.estimatedPlaytime}
              onChange={handleChange}
            />
          </div>

          <div className={styles.modalActions}>
            <button type="submit" className="primary-accent">Save Game</button>
            <button type="button" className="secondary-accent" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEditGameModal;
