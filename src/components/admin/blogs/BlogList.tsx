import React from 'react';
import type { Blog, BlogStatus } from '../../../types/blog';
import BlogItem from './BlogItem';
import FilterBar from './FilterBar';
import BlogPagination from './BlogPagination';
import './BlogList.css';

interface BlogListProps {
  status: BlogStatus;
  blogs: Blog[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  onViewDetail: (id: string) => void;
  onApprove?: (blog: Blog) => void;
  onReject?: (blog: Blog) => void;
  onSearch: (query: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onFilterChange?: (filters: any) => void;
}

export const BlogList: React.FC<BlogListProps> = ({
  status,
  blogs,
  total,
  page,
  pageSize,
  loading,
  onViewDetail,
  onApprove,
  onReject,
  onSearch,
  onPageChange,
  onPageSizeChange,
  onFilterChange,
}) => {
  return (
    <div className="blog-list-container">
      <FilterBar
        onSearch={onSearch}
        onFilterChange={onFilterChange}
        showFilters={true}
      />

      {loading ? (
        <div className="blog-list-loading">
          <div className="spinner"></div>
          <p>Loading blogs...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="blog-list-empty">
          <p>No blogs found</p>
        </div>
      ) : (
        <>
          <div className="blog-list">
            {blogs.map((blog) => (
              <BlogItem
                key={blog.id}
                blog={blog}
                status={status}
                onView={() => onViewDetail(blog.id)}
                onApprove={onApprove ? () => onApprove(blog) : undefined}
                onReject={onReject ? () => onReject(blog) : undefined}
              />
            ))}
          </div>

          <BlogPagination
            current={page}
            total={total}
            pageSize={pageSize}
            onChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </>
      )}
    </div>
  );
};

export default BlogList;
