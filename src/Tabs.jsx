import React, { useState } from 'react';
import GameCard from './GameCard';
import RecentlyPickedGameCard from './RecentlyPickedGameCard'; // Import the new component
import './/App.css';

const mockBacklogGames = [
  { id: 1, name: 'The Witcher 3: Wild Hunt', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg', platform: 'PC', genre: 'RPG', estimatedPlaytime: '100 hours', releaseDate: 'May 19, 2015' },
  { id: 2, name: 'Cyberpunk 2077', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg', platform: 'PS5', genre: 'RPG', estimatedPlaytime: '60 hours', releaseDate: 'Dec 10, 2020' },
  { id: 3, name: 'Red Dead Redemption 2', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/4/44/Red_Dead_Redemption_II.jpg', platform: 'PS4', genre: 'Action-Adventure', estimatedPlaytime: '80 hours', releaseDate: 'Oct 26, 2018' },
  { id: 4, name: 'Hades', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Hades_cover_art.jpg', platform: 'Switch', genre: 'Roguelike', estimatedPlaytime: '40 hours', releaseDate: 'Sep 17, 2020' },
  { id: 5, name: 'Stardew Valley', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1d/Stardew_Valley_box_art.png', platform: 'PC', genre: 'Simulation', estimatedPlaytime: '150 hours', releaseDate: 'Feb 26, 2016' },
  ];

const mockWishlistGames = [
  { id: 6, name: 'Portal 2', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f9/Portal2cover.jpg', platform: 'PC', genre: 'Puzzle', estimatedPlaytime: '8 hours', releaseDate: 'Apr 19, 2011', discount: 20 },

    { id: 10, name: "Baldur's Gate 3", imageUrl: 'https://images.gog-statics.com/b123621a6a635595734e615f3a0e4ba723d06967a578c1851e8a2a0d5d3e0f9b.jpg', platform: 'PC', genre: 'RPG', estimatedPlaytime: '150 hours', releaseDate: 'Aug 3, 2023' },
    { id: 11, name: 'Final Fantasy VII Rebirth', imageUrl: 'https://image.api.playstation.com/vulcan/ap/rnd/202306/0821/2e5f6e494a43a75871f3755a1532f8314983058cb041f692.png', platform: 'PS5', genre: 'Action RPG', estimatedPlaytime: '80 hours', releaseDate: 'Feb 29, 2024' },
    { id: 12, name: "Dragon's Dogma 2", imageUrl: 'https://image.api.playstation.com/vulcan/ap/rnd/202308/1623/5c4e227e77ad377614e5108f30a931b945417937446ea80a.png', platform: 'PC', genre: 'Action RPG', estimatedPlaytime: '50 hours', releaseDate: 'Mar 22, 2024' },
];

const mockRecentlyPickedGames = [
    { id: 13, name: 'Celeste', imageUrl: 'https://s3.gaming-cdn.com/images/products/2347/orig/celeste-pc-game-steam-cover.jpg?v=1701350616', platform: 'Switch', genre: 'Platformer', estimatedPlaytime: '12 hours', releaseDate: 'Jan 25, 2018', pickedTimestamp: 'Picked: May 20, 2024 @ 4:00 AM' },
];


function Tabs({ onAddGame, onEditGame, onImportSteam, onUploadCSV }) {
  const [activeTab, setActiveTab] = useState('backlog');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'backlog':
        return (
          <div>
            <h2>Your Backlog</h2>
            <div className="add-game-options">
              <button className="action-button" onClick={onImportSteam}>
                <span className="icon-placeholder"></span> Import from Steam
              </button>
              <button className="action-button" onClick={onUploadCSV}>
                <span className="icon-placeholder"></span> Upload CSV
              </button>
              <button className="action-button" onClick={onAddGame}>
                <span className="icon-placeholder"></span> Add Manually
              </button>
            </div>
            <div className="game-list">
              {mockBacklogGames.map(game => (
                <GameCard key={game.id} game={game} onEdit={onEditGame} />
              ))}
            </div>
          </div>
        );
      case 'wishlist':
        return (
          <div>
            <h2>Your Wishlist</h2>
            <div className="add-game-options">
              <button className="action-button" onClick={onUploadCSV}>
                <span className="icon-placeholder"></span> Upload CSV
              </button>
              <button className="action-button" onClick={onAddGame}>
                <span className="icon-placeholder"></span> Add Manually
              </button>
            </div>
            <div className="game-list">
              {mockWishlistGames.map(game => (
                <GameCard key={game.id} game={game} onEdit={onEditGame} />
              ))}
            </div>
          </div>
        );
      case 'recently-picked':
        return (
          <div>
            <h2>Recently Picked</h2>
            <div className="recently-picked-game-list">
              {mockRecentlyPickedGames.map(game => (
                <RecentlyPickedGameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'backlog' ? 'active' : ''}`}
          onClick={() => setActiveTab('backlog')}
        >
          {`Backlog (${mockBacklogGames.length})`}
        </button>
        <button
          className={`tab-button ${activeTab === 'wishlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('wishlist')}
        >
          {`Wishlist (${mockWishlistGames.length})`}
        </button>
        <button
          className={`tab-button ${activeTab === 'recently-picked' ? 'active' : ''}`}
          onClick={() => setActiveTab('recently-picked')}
        >
          Recently Picked
        </button>
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default Tabs;
