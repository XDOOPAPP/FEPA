import React from 'react';
import './BlogPagination.css';

interface BlogPaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const BlogPagination: React.FC<BlogPaginationProps> = ({
  current,
  total = 0,
  pageSize = 10,
  onChange,
  onPageSizeChange,
}) => {
  // Ensure total is a valid number
  const validTotal = Number.isFinite(total) ? total : 0;
  const validPageSize = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10;
  const totalPages = Math.ceil(validTotal / validPageSize);
  const startItem = (current - 1) * validPageSize + 1;
  const endItem = Math.min(current * validPageSize, validTotal);

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (current > 3) {
        pages.push('...');
      }

      const start = Math.max(2, current - 1);
      const end = Math.min(totalPages - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="blog-pagination">
      <div className="pagination-info">
        Showing {startItem}-{endItem} of {validTotal}
      </div>

      <div className="pagination-controls">
        <button
          className="pagination-button"
          onClick={() => onChange(current - 1)}
          disabled={current === 1}
        >
          ← Prev
        </button>

        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="pagination-ellipsis">...</span>
            ) : (
              <button
                className={`pagination-button ${current === page ? 'active' : ''}`}
                onClick={() => onChange(page as number)}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          className="pagination-button"
          onClick={() => onChange(current + 1)}
          disabled={current === totalPages}
        >
          Next →
        </button>
      </div>

      <div className="pagination-pagesize">
        <label htmlFor="pageSize">Show:</label>
        <select
          id="pageSize"
          value={validPageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="pagesize-select"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
};

export default BlogPagination;
