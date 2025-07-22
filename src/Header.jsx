import React from 'react';
import './/App.css';

function Header({ onRecommendClick, onUserAvatarClick, currentUser, onSignOut, onLinkSteamClick }) {
  return (
    <header className="header">
      <div className="logo-container">
        <div className="flame-icon"></div>
        <h1>Backlog Odyssey</h1>
      </div>
      <div className="actions-container">
        {currentUser && !currentUser.hasSteamLinked && (
          <button className="tertiary-accent" onClick={onLinkSteamClick}>
            Link Steam Account
          </button>
        )}
        <button className="primary-accent" onClick={onRecommendClick}>Recommend me a game</button>
        {currentUser ? (
          <div className="user-info">
            <span className="user-name">Welcome, {currentUser.name}!</span>
            <button className="secondary-accent" onClick={onSignOut}>Sign Out</button>
          </div>
        ) : (
          <button className="secondary-accent" onClick={onUserAvatarClick}>Sign In</button>
        )}
      </div>
    </header>
  );
}

export default Header;
