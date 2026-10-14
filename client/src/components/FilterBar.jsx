import React from 'react';
import { Search, X, Filter, ArrowUpDown, AlertCircle, Download } from 'lucide-react';

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories = [],
  lowStockOnly,
  setLowStockOnly,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onResetFilters,
  onExportCsv,
  totalResults,
}) {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    lowStockOnly ||
    sortBy !== 'createdAt';

  return (
    <div className="filter-card">
      <div className="filter-row">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="filter-control">
          <label className="filter-label" htmlFor="category-select">
            <Filter size={15} />
            <span>Category:</span>
          </label>
          <select
            id="category-select"
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Controls */}
        <div className="filter-control">
          <label className="filter-label" htmlFor="sort-select">
            <ArrowUpDown size={15} />
            <span>Sort By:</span>
          </label>
          <select
            id="sort-select"
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt">Date Added</option>
            <option value="name">Product Name</option>
            <option value="quantity">Stock Quantity</option>
            <option value="purchasePrice">Purchase Price</option>
            <option value="sellingPrice">Selling Price</option>
          </select>

          <button
            className="btn btn-icon-compact"
            onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
            title={`Direction: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
            aria-label="Toggle sort order"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {/* Low Stock Toggle Button */}
        <button
          className={`filter-toggle-btn ${lowStockOnly ? 'active' : ''}`}
          onClick={() => setLowStockOnly(prev => !prev)}
        >
          <AlertCircle size={15} />
          <span>Low Stock (≤ 5)</span>
        </button>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            className="btn btn-ghost reset-btn"
            onClick={onResetFilters}
            title="Reset all filters"
          >
            <X size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="filter-summary-row">
        <span className="results-count">
          Showing <strong>{totalResults}</strong> {totalResults === 1 ? 'product' : 'products'}
        </span>
        {totalResults > 0 && (
          <button
            className="btn btn-secondary btn-xs btn-export"
            onClick={onExportCsv}
            title="Download inventory report as CSV file"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        )}
      </div>
    </div>
  );
}
