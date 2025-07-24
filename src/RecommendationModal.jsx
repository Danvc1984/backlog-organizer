import React, { useState, useEffect } from 'react';
import styles from './RecommendationModal.module.css';
import RecommendationCard from './RecommendationCard';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebase';
import { FaSync } from 'react-icons/fa';

const functions = getFunctions(app);
const getRecommendationsCallable = httpsCallable(functions, 'getRecommendations');

function RecommendationModal({ onClose, onSelectGame }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getRecommendationsCallable();
      setRecommendations(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleRegenerate = () => {
    fetchRecommendations();
  };

  const handleSelect = (game) => {
    onSelectGame(game);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2>Here are your recommendations!</h2>
        <h3>Click to select a title</h3>
        {loading && <div className={styles.spinner}></div>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && (
            <div className={styles.recommendations}>
            {recommendations.map((game) => (
              <RecommendationCard key={game.id} game={game} onSelect={handleSelect} />
            ))}
          </div>
        )}
        <div className={styles.modalActions}>
          <button className={styles.refreshButton} onClick={handleRegenerate} disabled={loading}>
            {loading ? (
              <>
                <FaSync className={styles.spinningIcon} /> Regenerating...
              </>
            ) : (
              'Regenerate'
            )}
          </button>
          <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default RecommendationModal;
