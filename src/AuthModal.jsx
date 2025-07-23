import React, { useState } from 'react';
import styles from './AuthModal.module.css';
import { auth, db } from './firebase'; // Import auth and db
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // Import doc and setDoc

function AuthModal({ onClose, onSignIn, showNotification }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: username });

        // Create user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          username: username,
          email: user.email,
          steamId: null,
          hasSteamLinked: false,
        });

        onSignIn({ name: username || email, uid: user.uid });
        showNotification('success', 'Account created successfully!');
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        onSignIn({ name: user.displayName || user.email, uid: user.uid });
        showNotification('success', 'Signed in successfully!');
      }
      onClose();
    } catch (err) {
      setError(err.message);
      showNotification('error', err.message);
    }
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
          {error && <p className={styles.errorMessage}>{error}</p>}
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
