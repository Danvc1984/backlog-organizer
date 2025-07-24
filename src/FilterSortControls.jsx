import React from 'react';
import './App.css';

function FilterSortControls({
  filterCriterion,
  setFilterCriterion, 
  sortCriterion,
  setSortCriterion,
  genres,
  releaseYearFilter,
  setReleaseYearFilter,
  platformFilter,
  setPlatformFilter,
  playtimeFilter,
  setPlaytimeFilter,
  platforms,
  releaseYears,
}) {
  const playtimeOptions = [
    { value: 'All', label: 'All' },
    { value: 'Short', label: 'Short (<10 hours)' },
    { value: 'Medium', label: 'Medium (10-30 hours)' },
    { value: 'Long', label: 'Long (>30 hours)' },
  ];

  return (
    <div className="filter-sort-controls">
      <div className="control-group">
        <span className="control-label">Filter by Genre:</span>
        <div className="button-group">
          
          {genres.map(genre => (
            <button
              key={genre}
              className={`control-button ${filterCriterion === genre ? 'active' : ''}`}
              onClick={() => setFilterCriterion(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
      <div className="control-group">
        <span className="control-label">Filter by Release Year:</span>
        <div className="button-group">
          {releaseYears.map(year => (
            <button
              key={year}
              className={`control-button ${releaseYearFilter === year ? 'active' : ''}`}
              onClick={() => setReleaseYearFilter(year)}
            >
              {year}
            </button>
          ))}
        </div>
        </div>
        <div className="control-group">
        <span className="control-label">Filter by Platform:</span>
        <div className="button-group">
          {platforms.map(platform => (
            <button
              key={platform}
              className={`control-button ${platformFilter === platform ? 'active' : ''}`}
              onClick={() => setPlatformFilter(platform)}
            >
              {platform}
            </button>
          ))}
        </div>
        </div>
        <div className="control-group">
        <span className="control-label">Filter by Playtime:</span>
        <div className="button-group">
          {playtimeOptions.map(option => (
            <button
              key={option.value}
              className={`control-button ${playtimeFilter === option.value ? 'active' : ''}`}
              onClick={() => setPlaytimeFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        </div>


      <div className="control-group">
        <span className="control-label">Sort by:</span>
        <div className="button-group">
          <button
            className={`control-button ${sortCriterion === 'name-asc' ? 'active' : ''}`}
            onClick={() => setSortCriterion('name-asc')}
          >
            Name (A-Z)
          </button>
          <button
            className={`control-button ${sortCriterion === 'name-desc' ? 'active' : ''}`}
            onClick={() => setSortCriterion('name-desc')}
          >
            Name (Z-A)
          </button>
          <button
            className={`control-button ${sortCriterion === 'release-date-asc' ? 'active' : ''}`}
            onClick={() => setSortCriterion('release-date-asc')}
          >
            Release Date (Oldest)
          </button>
          <button
            className={`control-button ${sortCriterion === 'release-date-desc' ? 'active' : ''}`}
            onClick={() => setSortCriterion('release-date-desc')}
          >
            Release Date (Newest)
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterSortControls;
