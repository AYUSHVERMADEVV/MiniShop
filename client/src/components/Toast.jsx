import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const { type = 'success', message, title } = toast;

  return (
    <div className={`toast-container toast-${type}`} role="alert">
      <div className="toast-icon">
        {type === 'success' && <CheckCircle2 size={20} />}
        {type === 'error' && <AlertCircle size={20} />}
        {type === 'info' && <Info size={20} />}
      </div>
      <div className="toast-content">
        {title && <h4 className="toast-title">{title}</h4>}
        <p className="toast-message">{message}</p>
      </div>
      <button
        className="toast-close-btn"
        onClick={onClose}
        aria-label="Dismiss alert"
      >
        <X size={16} />
      </button>
    </div>
  );
}
