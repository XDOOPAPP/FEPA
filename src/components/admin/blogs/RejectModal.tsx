import React from 'react';
import type { Blog } from '../../../types/blog';
import './RejectModal.css';

interface RejectModalProps {
  blog: Blog | null;
  visible: boolean;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const RejectModal: React.FC<RejectModalProps> = ({
  blog,
  visible,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  const [reason, setReason] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (!visible) {
      setReason('');
      setError('');
    }
  }, [visible]);

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }
    setError('');
    onConfirm(reason);
  };

  if (!visible || !blog) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Reject Blog</h2>
          <button className="modal-close" onClick={onCancel}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-info">
            <p>
              <strong>Title:</strong> {blog.title}
            </p>
            <p>
              <strong>Author:</strong> {blog.author?.name || 'Unknown'}
            </p>
          </div>

          <div className="modal-message warning">
            ⚠️ This blog will be rejected and moved to rejected list.
          </div>

          <div className="form-group">
            <label htmlFor="reason">
              Reason for rejection <span style={{ color: '#ff4d4f' }}>*</span>
            </label>
            <textarea
              id="reason"
              placeholder="Please provide a clear reason for rejection..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              rows={4}
              className={`modal-textarea ${error ? 'error' : ''}`}
            />
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="modal-button cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="modal-button reject"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Rejecting...' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
