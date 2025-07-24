import React from 'react';
import { FaSteam } from 'react-icons/fa';
import './App.css';

function Header({ onRecommendClick, onSignInClick, currentUser, onSignOut, onLinkSteamClick }) {
  return (
    <header className="header">
      <div className="logo-container">
        <div className="flame-icon"></div>
        <h1>Backlog Odissey</h1>
      </div>
      <div className="actions-container">
        <button className="primary-accent" onClick={onRecommendClick}>
          Recommend a Game
        </button>
        {currentUser && !currentUser.hasSteamLinked && (
          <button className="secondary-accent" onClick={onLinkSteamClick}>
            <FaSteam /> Link Steam
          </button>
        )}
        <div className="user-info"> 
          {currentUser ? (
            <>
              <span className="user-name">Welcome! {currentUser.name}</span>
              <button className="tertiary-accent" onClick={onSignOut}>
                Sign Out
              </button>
            </>
          ) : (
            <button className="tertiary-accent" onClick={onSignInClick}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
