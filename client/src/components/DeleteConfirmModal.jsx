import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  product = null,
  isDeleting = false,
}) {
  // Handle keyboard Escape to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !product) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container modal-danger"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="danger-icon-badge">
            <AlertTriangle size={24} />
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body text-center">
          <h3 className="modal-title">Delete Product?</h3>
          <p className="modal-subtitle">
            Are you sure you want to remove <strong>"{product.name}"</strong> from your inventory?
          </p>

          <div className="delete-preview-box">
            <div className="delete-preview-row">
              <span className="text-muted">Category:</span>
              <span className="font-semibold">{product.category}</span>
            </div>
            <div className="delete-preview-row">
              <span className="text-muted">Stock Quantity:</span>
              <span className="font-semibold">{product.quantity} units</span>
            </div>
            <div className="delete-preview-row">
              <span className="text-muted">Purchase Cost:</span>
              <span className="font-semibold">₹{product.purchasePrice?.toFixed(2)}</span>
            </div>
          </div>

          <p className="delete-warning-text">
            ⚠️ This item will be permanently removed from MongoDB database. This action cannot be undone.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(product._id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="btn-spinner"></span>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={18} />
                <span>Yes, Delete Product</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
