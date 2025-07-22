import React from 'react';
import RecommendationCard from './RecommendationCard';
import styles from './RecommendationModal.module.css';

const mockRecommendations = [
  { id: 1, name: 'The Witcher 3: Wild Hunt', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg', platform: 'PC', estimatedPlaytime: '100+ hours', genre: 'RPG' },
  { id: 2, name: 'Cyberpunk 2077', imageUrl: 'https://via.placeholder.com/300x400', platform: 'PS5', estimatedPlaytime: '60 hours', genre: 'RPG' },
  { id: 3, name: 'Elden Ring', imageUrl: 'https://via.placeholder.com/300x400', platform: 'PS5', estimatedPlaytime: '120+ hours', genre: 'Action RPG' },
];

function RecommendationModal({ onClose }) {
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <div className={styles.modalHeader}>
          <h2>Here are your recommendations!</h2>
          <p>Our AI has picked these games for you. Choose one to start your next adventure.</p>
        </div>
        <div className={styles.recommendationsContainer}>
          {mockRecommendations.map(game => (
            <RecommendationCard key={game.id} game={game} />
          ))}
        </div>
        <div className={styles.modalActions}>
          <button className={styles.refreshButton}>Refresh Recommendations</button>
          <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default RecommendationModal;
