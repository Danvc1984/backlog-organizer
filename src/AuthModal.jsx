import React, { useState } from 'react';
import styles from './AuthModal.module.css';

function AuthModal({ onClose, onSignIn }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      console.log('Sign Up:', { email, password, username });
      // Mock Firebase signup.
      // For now, on successful sign-up, we treat it as a sign-in and pass the email.
      onSignIn({ name: username || email }); // Use username if available, else email
    } else {
      console.log('Sign In:', { email, password });
      // Mock Firebase signin.
      onSignIn({ name: email });
    }
    onClose(); // Close modal after mock submission
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <div className={styles.modalHeader}>
          <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
          <p>{isSignUp ? 'Create your account to start your journey.' : 'Welcome back! Sign in to continue.'}</p>
        </div>
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className={styles.formGroup}>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.modalActions}>
            <button type="submit" className={styles.primaryButton}>
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </form>
        <div className={styles.toggleAuth}>
          <p onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Already have an account? Sign In' : 'Don\'t have an account? Sign Up'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
