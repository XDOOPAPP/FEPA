import React from 'react';
import type { Blog } from '../../../types/blog';
import './ApproveModal.css';

interface ApproveModalProps {
  blog: Blog | null;
  visible: boolean;
  onConfirm: (note?: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ApproveModal: React.FC<ApproveModalProps> = ({
  blog,
  visible,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  const [note, setNote] = React.useState('');

  React.useEffect(() => {
    if (!visible) {
      setNote('');
    }
  }, [visible]);

  const handleConfirm = () => {
    onConfirm(note || undefined);
  };

  if (!visible || !blog) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Approve Blog</h2>
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

          <div className="modal-message success">
            ✅ This blog will be published and visible to all users.
          </div>

          <div className="form-group">
            <label htmlFor="note">Note (optional):</label>
            <textarea
              id="note"
              placeholder="Add a note for the author..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className="modal-textarea"
            />
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
            className="modal-button approve"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Approving...' : 'Approve'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveModal;
