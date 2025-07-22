import React, { useState } from 'react';
import GameCard from './GameCard';
import RecentlyPickedGameCard from './RecentlyPickedGameCard';
import FilterSortControls from './FilterSortControls';
import './App.css';

function Tabs({
  onAddGame,
  onEditGame,
  onRemoveGame,
  onImportSteam,
  onUploadCSV,
  wishlist,
  backlog,
  filterCriterion,
  setFilterCriterion,
  sortCriterion,
  setSortCriterion,
}) {
  const [activeTab, setActiveTab] = useState('backlog');

  const mockRecentlyPickedGames = [
    { id: 13, name: 'Celeste', imageUrl: 'https://s3.gaming-cdn.com/images/products/2347/orig/celeste-pc-game-steam-cover.jpg?v=1701350616', platform: 'Switch', genre: 'Platformer', estimatedPlaytime: '12 hours', releaseDate: 'Jan 25, 2018', pickedTimestamp: 'Picked: May 20, 2024 @ 4:00 AM' },
  ];

  const renderTabContent = () => {
    const currentGames = activeTab === 'backlog' ? backlog : wishlist;
    const genres = Array.from(new Set([...wishlist, ...backlog].map(game => game.genre)));

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
            <FilterSortControls
            filterCriterion={filterCriterion}
            setFilterCriterion={setFilterCriterion}
              
              sortCriterion={sortCriterion}
              setSortCriterion={setSortCriterion}
              genres={['All', ...genres]}
            />
            <div className="game-list">
              {currentGames.map(game => (
                <GameCard key={game.id} game={game} onEdit={onEditGame} onRemove={onRemoveGame} />
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
            <FilterSortControls
            filterCriterion={filterCriterion}
            setFilterCriterion={setFilterCriterion}
              
              sortCriterion={sortCriterion}
              setSortCriterion={setSortCriterion}
              genres={['All', ...genres]}
            />
            <div className="game-list">
              {currentGames.map(game => (
                <GameCard key={game.id} game={game} onEdit={onEditGame} onRemove={onRemoveGame} />
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
          {`Backlog (${backlog.length})`}
        </button>
        <button
          className={`tab-button ${activeTab === 'wishlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('wishlist')}
        >
          {`Wishlist (${wishlist.length})`}
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
