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
  recentlyPicked,
  filterCriterion,
  setFilterCriterion,
  sortCriterion,
  setSortCriterion,
  closeAllDetails,
  setCloseAllDetails,
}) {
  const [activeTab, setActiveTab] = useState('backlog');
  const [openGameCardIds, setOpenGameCardIds] = useState([]);

  const handleGameCardToggle = (gameId, isOpen) => {
    setOpenGameCardIds(prev => {
      const newSet = new Set(prev);
      if (isOpen) {
        newSet.add(gameId);
      } else {
        newSet.delete(gameId);
      }
      return [...newSet];
    });
  };

  const handleCloseAllDetails = () => {
    setCloseAllDetails(true);
    setOpenGameCardIds([]);
  };

  const renderTabContent = () => {
    const currentGames = activeTab === 'backlog' ? backlog : wishlist;
    const genres = Array.from(new Set([...wishlist, ...backlog].map(game => game.genre)));

    if (activeTab === 'recently-picked') {
      return (
        <div>
          <h2>Recently Picked</h2>
          {recentlyPicked.length > 0 ? (
            <div className="recently-picked-game-list">
              {recentlyPicked.map(game => (
                <RecentlyPickedGameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="empty-list-message">
              <p>You haven't picked any games recently. Use the "Recommend a Game" feature to get a suggestion!</p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div>
        <h2>{activeTab === 'backlog' ? 'Your Backlog' : 'Your Wishlist'}</h2>
        <div className="add-game-options">
          {activeTab === 'backlog' && (
            <button className="action-button" onClick={onImportSteam}>
              <span className="icon-placeholder"></span> Import from Steam
            </button>
          )}
          <button className="action-button" onClick={() => onUploadCSV(activeTab)}>
            <span className="icon-placeholder"></span> Upload CSV
          </button>
          <button className="action-button" onClick={() => onAddGame(activeTab)}>
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
        {openGameCardIds.length > 0 && (
          <div className="close-all-details-container">
            <button className="tertiary-accent" onClick={handleCloseAllDetails}>
              Close All Details
            </button>
          </div>
        )}
        {currentGames.length > 0 ? (
          <div className="game-list">
            {currentGames.map(game => (
              <GameCard
                key={game.id}
                game={game}
                onEdit={onEditGame}
                onRemove={(gameId) => onRemoveGame(gameId, activeTab)}
                closeAllDetails={closeAllDetails}
                setCloseAllDetails={setCloseAllDetails}
                onGameCardToggle={handleGameCardToggle}
              />
            ))}
          </div>
        ) : (
          <div className="empty-list-message">
            <p>Your {activeTab} is empty. Add some games to get started!</p>
          </div>
        )}
      </div>
    );
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
          {`Recently Picked (${recentlyPicked.length})`}
        </button>
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default Tabs;
