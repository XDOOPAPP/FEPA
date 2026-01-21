import React from 'react';
import './FilterBar.css';

interface FilterBarProps {
  onSearch: (query: string) => void;
  onFilterChange?: (filters: {
    author?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => void;
  showFilters?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onSearch,
  onFilterChange,
  showFilters = true,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [author, setAuthor] = React.useState('');
  const [dateFrom, setDateFrom] = React.useState('');
  const [dateTo, setDateTo] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleFilterChange = () => {
    if (onFilterChange) {
      onFilterChange({
        author: author || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
    }
  };

  const handleClearFilters = () => {
    setAuthor('');
    setDateFrom('');
    setDateTo('');
    setSearchQuery('');
    onSearch('');
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  return (
    <div className="filter-bar">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search blogs by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {showFilters && (
        <div className="filters">
          <input
            type="text"
            placeholder="Filter by author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="filter-input"
          />
          <input
            type="date"
            placeholder="From date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="filter-input"
          />
          <input
            type="date"
            placeholder="To date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="filter-input"
          />
          <button onClick={handleFilterChange} className="filter-apply-button">
            Apply Filters
          </button>
          <button onClick={handleClearFilters} className="filter-clear-button">
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
