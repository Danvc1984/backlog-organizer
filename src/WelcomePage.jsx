import React from 'react';
import styles from './WelcomePage.module.css';

function WelcomePage({ onSignInClick }) {
  return (
    <div className={styles.welcomeContainer}>
      <h2 className={styles.welcomeTitle}>Welcome to Backlog Odyssey!</h2>
      <p className={styles.welcomeMessage}>
        Your ultimate companion for managing your game backlog and discovering new adventures.
      </p>
      <p className={styles.callToAction}>
        Sign in or sign up to start organizing your games and get personalized recommendations.
      </p>
      <button className={styles.signInButton} onClick={onSignInClick}>
        Sign In / Sign Up
      </button>
      <div className={styles.imagePlaceholder}>
        {/* Placeholder for a relevant image */}
      </div>
    </div>
  );
}

export default WelcomePage;
