import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApproveModal from '../../../components/admin/blogs/ApproveModal';
import RejectModal from '../../../components/admin/blogs/RejectModal';
import blogAPI from '../../../services/api/blogAPI';
import type { Blog } from '../../../types/blog';
import './BlogDetail.css';

export const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBlogDetail();
    }
  }, [id]);

  const fetchBlogDetail = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const data = await blogAPI.getBlogDetail(id);
      // Handle both direct object and wrapped response
      const blogData = (data as any)?.data || data;
      setBlog(blogData);
    } catch (error) {
      console.error('Error fetching blog detail:', error);
      alert('Failed to load blog details');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveConfirm = async (note?: string) => {
    if (!blog) return;

    setActionLoading(true);
    try {
      await blogAPI.approveBlog(blog.id, { note });
      alert('Blog approved successfully!');
      navigate('/admin/blogs/pending');
    } catch (error) {
      console.error('Error approving blog:', error);
      alert('Failed to approve blog');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!blog) return;

    setActionLoading(true);
    try {
      await blogAPI.rejectBlog(blog.id, { reason });
      alert('Blog rejected successfully!');
      navigate('/admin/blogs/pending');
    } catch (error) {
      console.error('Error rejecting blog:', error);
      alert('Failed to reject blog');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusClass = (status: string): string => {
    const statusMap: Record<string, string> = {
      pending: 'status-badge-pending',
      published: 'status-badge-published',
      rejected: 'status-badge-rejected',
      draft: 'status-badge-draft',
    };
    return statusMap[status] || '';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="blog-detail-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading blog details...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-detail-page">
        <div className="error-container">
          <h2>Blog not found</h2>
          <button onClick={() => navigate('/admin/blogs/pending')} className="btn-back">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      <div className="blog-detail-header">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Back
        </button>
        <div className="blog-meta">
          <span className={`status-badge ${getStatusClass(blog.status)}`}>
            {blog.status ? blog.status.toUpperCase() : 'UNKNOWN'}
          </span>
          <span className="author-info">Author: {blog.author?.name || 'Unknown'}</span>
        </div>
      </div>

      <div className="blog-detail-card">
        <div className="blog-timestamps">
          <span>Created: {formatDate(blog.createdAt)}</span>
          <span>Updated: {formatDate(blog.updatedAt)}</span>
          {blog.publishedAt && <span>Published: {formatDate(blog.publishedAt)}</span>}
        </div>

        <h1 className="blog-title">{blog.title}</h1>

        {blog.thumbnailUrl && (
          <div className="blog-thumbnail-container">
            <img src={blog.thumbnailUrl} alt={blog.title} className="blog-thumbnail" />
          </div>
        )}

        <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }} />

        {blog.images && blog.images.length > 0 && (
          <div className="blog-images">
            <h3>Additional Images</h3>
            <div className="images-grid">
              {blog.images.map((image, index) => (
                <img key={index} src={image} alt={`Image ${index + 1}`} className="blog-image" />
              ))}
            </div>
          </div>
        )}

        {blog.rejectionReason && (
          <div className="rejection-reason">
            <h3>Rejection Reason</h3>
            <p>{blog.rejectionReason}</p>
          </div>
        )}

        {blog.status === 'pending' && (
          <div className="blog-actions">
            <button
              className="btn-approve"
              onClick={() => setApproveModalVisible(true)}
            >
              ✓ Approve Blog
            </button>
            <button
              className="btn-reject"
              onClick={() => setRejectModalVisible(true)}
            >
              ✕ Reject Blog
            </button>
          </div>
        )}
      </div>

      <ApproveModal
        blog={blog}
        visible={approveModalVisible}
        onConfirm={handleApproveConfirm}
        onCancel={() => setApproveModalVisible(false)}
        loading={actionLoading}
      />

      <RejectModal
        blog={blog}
        visible={rejectModalVisible}
        onConfirm={handleRejectConfirm}
        onCancel={() => setRejectModalVisible(false)}
        loading={actionLoading}
      />
    </div>
  );
};

export default BlogDetail;
