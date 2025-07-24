import React from 'react';
import styles from './RecommendationCard.module.css';

function RecommendationCard({ game, onSelect }) {
  const isWishlist = game.source === 'wishlist';

  return (
    <div className={`${styles.card} ${isWishlist ? styles.wishlistGlow : ''}`} onClick={() => onSelect(game)}>
      {isWishlist && <div className={styles.wishlistBadge}>Wishlist Pick</div>}
      <div className={styles.cardImage} style={{ backgroundImage: `url(${game.imageUrl})` }}></div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{game.name}</h3>
        <p className={styles.cardText}>Platform: {game.platform}</p>
        <p className={styles.cardText}>Genre: {game.genre}</p>
        <p className={styles.cardText}>Duration: {game.estimatedPlaytime}</p>
      </div>
    </div>
  );
}

export default RecommendationCard;
