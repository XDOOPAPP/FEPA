import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogList from '../../../components/admin/blogs/BlogList';
import ApproveModal from '../../../components/admin/blogs/ApproveModal';
import RejectModal from '../../../components/admin/blogs/RejectModal';
import blogAPI from '../../../services/api/blogAPI';
import type { Blog } from '../../../types/blog';
import './PendingBlogs.css';

export const PendingBlogs: React.FC = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await blogAPI.getPendingBlogs({
        page,
        limit: pageSize,
      });
      setBlogs(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('Error fetching pending blogs:', error);
      alert('Failed to load pending blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page, pageSize]);

  const handleViewDetail = (id: string) => {
    navigate(`/admin/blogs/${id}`);
  };

  const handleApproveClick = (blog: Blog) => {
    setSelectedBlog(blog);
    setApproveModalVisible(true);
  };

  const handleRejectClick = (blog: Blog) => {
    setSelectedBlog(blog);
    setRejectModalVisible(true);
  };

  const handleApproveConfirm = async (note?: string) => {
    if (!selectedBlog) return;

    setActionLoading(true);
    try {
      await blogAPI.approveBlog(selectedBlog.id, { note });
      alert('Blog approved successfully!');
      setApproveModalVisible(false);
      setSelectedBlog(null);
      fetchBlogs();
    } catch (error) {
      console.error('Error approving blog:', error);
      alert('Failed to approve blog');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!selectedBlog) return;

    setActionLoading(true);
    try {
      await blogAPI.rejectBlog(selectedBlog.id, { reason });
      alert('Blog rejected successfully!');
      setRejectModalVisible(false);
      setSelectedBlog(null);
      fetchBlogs();
    } catch (error) {
      console.error('Error rejecting blog:', error);
      alert('Failed to reject blog');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement search functionality with API
  };

  return (
    <div className="pending-blogs-page">
      <div className="page-header">
        <h1>Pending Reviews</h1>
        <p className="page-description">
          Review and moderate blog posts waiting for approval
        </p>
      </div>

      <BlogList
        status="pending"
        blogs={blogs}
        total={total}
        page={page}
        pageSize={pageSize}
        loading={loading}
        onViewDetail={handleViewDetail}
        onApprove={handleApproveClick}
        onReject={handleRejectClick}
        onSearch={handleSearch}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      <ApproveModal
        blog={selectedBlog}
        visible={approveModalVisible}
        onConfirm={handleApproveConfirm}
        onCancel={() => {
          setApproveModalVisible(false);
          setSelectedBlog(null);
        }}
        loading={actionLoading}
      />

      <RejectModal
        blog={selectedBlog}
        visible={rejectModalVisible}
        onConfirm={handleRejectConfirm}
        onCancel={() => {
          setRejectModalVisible(false);
          setSelectedBlog(null);
        }}
        loading={actionLoading}
      />
    </div>
  );
};

export default PendingBlogs;
