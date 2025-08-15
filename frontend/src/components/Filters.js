import React from 'react';

export default function Filters({
  filter,
  categoryFilter,
  setFilter,
  setCategoryFilter,
  categoryOptions
}) {
  return (
    <div className="d-flex gap-3 flex-wrap mb-3">
      
      {/* Status Filter */}
      <div>
        <label htmlFor="statusFilter" className="form-label">Filter by Status:</label>
        <select
          id="statusFilter"
          className="form-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="today">Due Today</option>
          <option value="done">Done</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Category Filter */}
      <div>
        <label htmlFor="categoryFilter" className="form-label">Filter by Category:</label>
        <select
          id="categoryFilter"
          className="form-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All</option>
          {categoryOptions.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

    </div>
  );
}