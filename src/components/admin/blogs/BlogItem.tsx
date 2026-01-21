import React from 'react';
import type { Blog, BlogStatus } from '../../types/blog';
import './BlogItem.css';

interface BlogItemProps {
  blog: Blog;
  status: BlogStatus;
  onView: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

export const BlogItem: React.FC<BlogItemProps> = ({
  blog,
  status,
  onView,
  onApprove,
  onReject,
}) => {
  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const statusColors: Record<BlogStatus, string> = {
    pending: 'status-pending',
    published: 'status-published',
    rejected: 'status-rejected',
    draft: 'status-draft',
  };

  return (
    <div className="blog-item">
      <div className="blog-item-left">
        {blog.thumbnailUrl && (
          <img
            src={blog.thumbnailUrl}
            alt={blog.title}
            className="blog-item-thumbnail"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100?text=No+Image';
            }}
          />
        )}
        <div className="blog-item-content">
          <h3 className="blog-item-title">{blog.title}</h3>
          <p className="blog-item-meta">
            By: {blog.author?.name || 'Unknown'} | 
            {status === 'pending' && ` Submitted: ${getTimeAgo(blog.createdAt)}`}
            {status === 'published' && blog.publishedAt && ` Published: ${getTimeAgo(blog.publishedAt)}`}
            {status === 'rejected' && ` Rejected: ${getTimeAgo(blog.updatedAt)}`}
          </p>
          {status === 'rejected' && blog.rejectionReason && (
            <p className="blog-item-rejection">Reason: {blog.rejectionReason}</p>
          )}
        </div>
      </div>
      <div className="blog-item-actions">
        <span className={`blog-item-status ${statusColors[status]}`}>
          {status.toUpperCase()}
        </span>
        <button className="btn-view" onClick={onView}>
          View
        </button>
        {status === 'pending' && onApprove && (
          <button className="btn-approve" onClick={onApprove}>
            Approve
          </button>
        )}
        {status === 'pending' && onReject && (
          <button className="btn-reject" onClick={onReject}>
            Reject
          </button>
        )}
      </div>
    </div>
  );
};

export default BlogItem;
