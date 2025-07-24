import React from 'react';
import './App.css';

function RecentlyPickedGameCard({ game }) {
  // Function to format the timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      // Assuming timestamp is an ISO 8601 string, if not, adjustments may be needed
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleString(); // Formats to local date and time, e.g., "12/19/2023, 7:00:00 PM"
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return 'Invalid Date';
    }
  };

  return (
    <div className="recently-picked-game-card">
      <div className="recently-picked-game-image">
        <img src={game.imageUrl} alt={game.name} />
      </div>
      <div className="recently-picked-game-details">
        <h3>{game.name}</h3>
        {game.genre && <p><strong>Genre:</strong> {game.genre}</p>}
        {game.playedAt && <p><strong>Picked on:</strong> {formatTimestamp(game.playedAt)}</p>}
        <p>Estimated Playtime: {game.estimatedPlaytime}</p>
      </div>
    </div>
  );
}

export default RecentlyPickedGameCard;
