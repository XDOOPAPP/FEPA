import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogList from '../../../components/admin/blogs/BlogList';
import blogAPI from '../../../services/api/blogAPI';
import type { Blog } from '../../../types/blog';
import './RejectedBlogs.css';

export const RejectedBlogs: React.FC = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await blogAPI.getRejectedBlogs({
        page,
        limit: pageSize,
      });
      setBlogs(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('Error fetching rejected blogs:', error);
      alert('Failed to load rejected blogs');
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

  const handleSearch = (query: string) => {
    // TODO: Implement search functionality with API
  };

  return (
    <div className="rejected-blogs-page">
      <div className="page-header">
        <h1>Rejected Blogs</h1>
        <p className="page-description">
          View all rejected blog posts and their rejection reasons
        </p>
      </div>

      <BlogList
        status="rejected"
        blogs={blogs}
        total={total}
        page={page}
        pageSize={pageSize}
        loading={loading}
        onViewDetail={handleViewDetail}
        onSearch={handleSearch}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};

export default RejectedBlogs;
