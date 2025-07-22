import React, { useState } from 'react';
import './App.css';

function GameCard({ game, onEdit, onRemove }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`game-card ${isOpen ? 'open' : ''}`}>
      <div className="game-card-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="game-card-image">
          <img src={game.imageUrl} alt={game.name} />
        </div>
        <div className="game-card-title">
          <h3>{game.name}</h3>
          {game.discount > 0 && (
            <div className="discount-badge">
              % {game.discount}% OFF
            </div>
          )}
        </div>
        <div className="game-card-actions">
          <div className="dropdown-arrow"></div>
        </div>
      </div>
      {isOpen && (
        <div className="game-card-details">
          <div className="detail-item">
            <span className="icon-placeholder"></span>
            <p>Platform: {game.platform}</p>
          </div>
          <div className="detail-item">
            <span className="icon-placeholder"></span>
            <p>Genre: {game.genre}</p>
          </div>
          <div className="detail-item">
            <span className="icon-placeholder"></span>
            <p>Estimated Playtime: {game.estimatedPlaytime}</p>
          </div>
          <div className="detail-item">
            <span className="icon-placeholder"></span>
            <p>Release Date: {game.releaseDate}</p>
          </div>
          {game.pickedTimestamp && (
            <div className="detail-item">
              <span className="icon-placeholder"></span>
              <p>{game.pickedTimestamp}</p>
            </div>
          )}
          <div className="game-card-footer">
            <button className="edit-game-button" onClick={() => onEdit(game)}>
              Edit Game Details
            </button>
            <button className="remove-game-button" onClick={() => onRemove(game.id)}>
              Remove Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameCard;
