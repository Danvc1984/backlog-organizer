import React from 'react';
import styles from './RecommendationModal.module.css';

function RecommendationCard({ game }) {
  return (
    <div className={styles.recommendationCard}>
      <div className={styles.recommendationCardImage}>
        <img src={game.imageUrl} alt={game.name} />
      </div>
      <div className={styles.recommendationCardDetails}>
        <h3>{game.name}</h3>
        <p>Platform: {game.platform}</p>
        <p>Genre: {game.genre}</p>
        <p>Est. Duration: {game.estimatedPlaytime}</p>
        <button className={styles.selectGameButton}>Select Game</button>
      </div>
    </div>
  );
}

export default RecommendationCard;
