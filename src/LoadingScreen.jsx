import React from 'react';
import styles from './LoadingScreen.module.css';

function LoadingScreen() {
  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingBox}>
        <div className={styles.spinner}></div>
        <h2 className={styles.loadingText}>Loading Your Library</h2>
        <p className={styles.subText}>Just a moment while we get things ready...</p>
      </div>
    </div>
  );
}

export default LoadingScreen;
