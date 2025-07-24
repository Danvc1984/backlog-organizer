import React, { useState, useEffect } from 'react';
import { FaDesktop, FaTags, FaClock, FaCalendarAlt } from 'react-icons/fa';
import './App.css';

function GameCard({ game, onEdit, onRemove, onMove, closeAllDetails, setCloseAllDetails, onGameCardToggle }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (onGameCardToggle) {
      onGameCardToggle(game.id, newIsOpen);
    }
  };

  useEffect(() => {
    if (closeAllDetails) {
      if (isOpen) {
        setIsOpen(false);
        if (onGameCardToggle) {
          onGameCardToggle(game.id, false);
        }
      }
      setCloseAllDetails(false);
    }
  }, [closeAllDetails, setCloseAllDetails, isOpen, onGameCardToggle, game.id]);

  const moveButtonText = game.list === 'backlog' ? 'Move to Recently Picked' : 'Move to Backlog';

  return (
    <div className={`game-card ${isOpen ? 'open' : ''}`}>
      {isOpen && <div className="backdrop" style={{ backgroundImage: `url(${game.imageUrl})` }}></div>}
      <div className="game-card-header" onClick={handleToggle}>
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
            <FaDesktop />
            <p>Platform: {game.platform}</p>
          </div>
          <div className="detail-item">
            <FaTags />
            <p>Genre: {game.genre}</p>
          </div>
          <div className="detail-item">
            <FaClock />
            <p>Estimated Playtime: {game.estimatedPlaytime}</p>
          </div>
          <div className="detail-item">
            <FaCalendarAlt />
            <p>Release Date: {game.releaseDate}</p>
          </div>
          {game.pickedTimestamp && (
            <div className="detail-item">
              <span className="icon-placeholder"></span>
              <p>{game.pickedTimestamp}</p>
            </div>
          )}
          <div className="game-card-footer">
            {onMove && (
              <button className="move-game-button" onClick={() => onMove(game.id)}>
                {moveButtonText}
              </button>
            )}
            <div>
            <button className="edit-game-button" onClick={() => onEdit(game)}>
              Edit
            </button>
            <button className="remove-game-button" onClick={() => onRemove(game.id)}>
              Remove
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameCard;
