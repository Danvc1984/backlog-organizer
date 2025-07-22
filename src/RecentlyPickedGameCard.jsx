import React from 'react';
import './/App.css';

function RecentlyPickedGameCard({ game }) {
  return (
    <div className="recently-picked-game-card">
      <div className="recently-picked-game-image">
        <img src={game.imageUrl} alt={game.name} />
      </div>
      <div className="recently-picked-game-details">
        <h3>{game.name}</h3>
        <p>Estimated Playtime: {game.estimatedPlaytime}</p>
        <p>{game.pickedTimestamp}</p>
      </div>
    </div>
  );
}

export default RecentlyPickedGameCard;
