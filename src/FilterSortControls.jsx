import React from 'react';
import './App.css';

function FilterSortControls({
  filterCriterion,
  setFilterCriterion, 
  sortCriterion,
  setSortCriterion,
  genres
}) {
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
