import React, { useState } from 'react';
import GameCard from './GameCard';
import RecentlyPickedGameCard from './RecentlyPickedGameCard';
import FilterSortControls from './FilterSortControls';
import { FaSteam, FaUpload, FaPlus } from 'react-icons/fa';
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
  onMoveToBacklog,
  onMoveToRecentlyPicked,
}) {
  const [activeTab, setActiveTab] = useState('backlog');
  const [openGameCardIds, setOpenGameCardIds] = useState([]);
  const [filterCriterion, setFilterCriterion] = useState('All');
  const [sortCriterion, setSortCriterion] = useState('name-asc');
  const [releaseYearFilter, setReleaseYearFilter] = useState('All');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [playtimeFilter, setPlaytimeFilter] = useState('All');
  const [closeAllDetails, setCloseAllDetails] = useState(false);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilterCriterion('All');
    setSortCriterion('name-asc');
    setReleaseYearFilter('All');
    setPlatformFilter('All');
    setPlaytimeFilter('All');
    setCloseAllDetails(true);
    setOpenGameCardIds([]);
    setSearchQuery('');
  };
  
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

  const getFilteredAndSortedGames = (games) => {
    if (!games) return [];
    let filteredGames = games;

    if (searchQuery.length >= 3) {
      filteredGames = filteredGames.filter(game =>
        game.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    if (filterCriterion !== 'All') {
      filteredGames = filteredGames.filter(game => {
        const genres = game.genre.split(',').map(g => g.trim());
        return genres.includes(filterCriterion);
      });
    }
  
    if (releaseYearFilter !== 'All') {
      filteredGames = filteredGames.filter(game => {
        const releaseYear = new Date(game.releaseDate).getFullYear();
        return releaseYear.toString() === releaseYearFilter;
      });
    }
  
    if (platformFilter !== 'All') {
      filteredGames = filteredGames.filter(game => {
        const platforms = game.platform.split(',').map(p => p.trim());
        return platforms.includes(platformFilter);
      });
    }
  
    if (playtimeFilter !== 'All') {
      filteredGames = filteredGames.filter(game => {
        const playtime = parseInt(game.estimatedPlaytime);
        if (playtimeFilter === 'Short') {
          return playtime < 10;
        } else if (playtimeFilter === 'Medium') {
          return playtime >= 10 && playtime <= 30;
        } else if (playtimeFilter === 'Long') {
          return playtime > 30;
        }
        return true;
      });
    }
  
    const sortedGames = [...filteredGames].sort((a, b) => {
      if (sortCriterion === 'name-asc') {
        return a.name.localeCompare(b.name);
      } else if (sortCriterion === 'name-desc') {
        return b.name.localeCompare(a.name);
      } else if (sortCriterion === 'release-date-asc') {
        return new Date(a.releaseDate) - new Date(b.releaseDate);
      } else if (sortCriterion === 'release-date-desc') {
        return new Date(b.releaseDate) - new Date(a.releaseDate);
      }
      return 0;
    });
    return sortedGames;
  };

  const renderTabContent = () => {
    const currentGames = activeTab === 'backlog' ? backlog : wishlist;
    const filteredAndSortedGames = getFilteredAndSortedGames(currentGames);

    const allGenres = currentGames.flatMap(game => 
      game.genre ? game.genre.split(/, |\/|,|\/| /).map(g => g.trim()).filter(g => g !== '') : []
    );
    const uniqueGenres = Array.from(new Set(allGenres));
    const genresForFilter = ['All', ...uniqueGenres];

    const allPlatforms = currentGames.flatMap(game =>
      game.platform ? game.platform.split(',').map(p => p.trim()) : []
    );
    const uniquePlatforms = Array.from(new Set(allPlatforms));
    const platformsForFilter = ['All', ...uniquePlatforms];

    const allReleaseYears = currentGames.map(game => 
        game.releaseDate ? new Date(game.releaseDate).getFullYear().toString() : null
    ).filter(Boolean);
    const uniqueReleaseYears = Array.from(new Set(allReleaseYears)).sort((a, b) => b - a);
    const releaseYearsForFilter = ['All', ...uniqueReleaseYears];


    if (activeTab === 'recently-picked') {
      const sortedRecentlyPicked = [...recentlyPicked].sort((a, b) => {
        const dateA = a.playedAt?.toDate ? a.playedAt.toDate() : new Date(a.playedAt);
        const dateB = b.playedAt?.toDate ? b.playedAt.toDate() : new Date(b.playedAt);
        return dateB - dateA;
      });

      return (
        <div>
          <h2>Recently Picked</h2>
          {sortedRecentlyPicked.length > 0 ? (
            <div className="recently-picked-game-list">
              {sortedRecentlyPicked.map(game => (
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
              <FaSteam /> Import from Steam
            </button>
          )}
          <button className="action-button" onClick={() => onUploadCSV(activeTab)}>
            <FaUpload /> Upload CSV
          </button>
          <button className="action-button" onClick={() => onAddGame(activeTab)}>
            <FaPlus /> Add Manually
          </button>
        </div>
        <button 
          className="action-button" 
          onClick={() => setIsFiltersVisible(!isFiltersVisible)}
        >
          {isFiltersVisible ? 'Hide Search & Filters' : 'Show Search & Filters'}
        </button>
        {isFiltersVisible && (
          <FilterSortControls
            filterCriterion={filterCriterion}
            setFilterCriterion={setFilterCriterion}
            sortCriterion={sortCriterion}
            setSortCriterion={setSortCriterion}
            genres={genresForFilter}
            releaseYearFilter={releaseYearFilter}
            setReleaseYearFilter={setReleaseYearFilter}
            platformFilter={platformFilter}
            setPlatformFilter={setPlatformFilter}
            playtimeFilter={playtimeFilter}
            setPlaytimeFilter={setPlaytimeFilter}
            platforms={platformsForFilter}
            releaseYears={releaseYearsForFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
        {openGameCardIds.length > 0 && (
          <div className="close-all-details-container">
            <button className="tertiary-accent" onClick={handleCloseAllDetails}>
              Close All Details
            </button>
          </div>
        )}
        {filteredAndSortedGames.length > 0 ? (
          <div className="game-list">
            {filteredAndSortedGames.map(game => (
              <GameCard
                key={game.id}
                game={game}
                onEdit={onEditGame}
                onRemove={(gameId) => onRemoveGame(gameId, activeTab)}
                onMove={activeTab === 'backlog' ? onMoveToRecentlyPicked : onMoveToBacklog}
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
          onClick={() => handleTabChange('backlog')}
        >
          {`Backlog (${backlog.length})`}
        </button>
        <button
          className={`tab-button ${activeTab === 'wishlist' ? 'active' : ''}`}
          onClick={() => handleTabChange('wishlist')}
        >
          {`Wishlist (${wishlist.length})`}
        </button>
        <button
          className={`tab-button ${activeTab === 'recently-picked' ? 'active' : ''}`}
          onClick={() => handleTabChange('recently-picked')}
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
