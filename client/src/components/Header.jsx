import React from 'react';
import { Menu, Plus, RefreshCw, Sparkles, Store } from 'lucide-react';

export default function Header({ onOpenAddModal, onRefresh, loading, setMobileOpen }) {
  // Format current date nicely
  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(prev => !prev)}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="header-greeting">
          <div className="greeting-pill">
            <Sparkles size={14} className="sparkle-icon" />
            <span>Inventory Manager</span>
          </div>
          <h2 className="header-title">MiniShop Inventory Overview</h2>
          <span className="header-date">{formattedDate}</span>
        </div>
      </div>

      <div className="header-right">
        <button
          className={`btn btn-secondary icon-only ${loading ? 'spinning' : ''}`}
          onClick={onRefresh}
          title="Refresh Data"
          disabled={loading}
          aria-label="Refresh product list"
        >
          <RefreshCw size={17} />
        </button>

        <button
          className="btn btn-primary"
          onClick={onOpenAddModal}
        >
          <Plus size={18} />
          <span className="hide-mobile">Add Product</span>
        </button>

        <div className="user-profile">
          <div className="user-avatar">
            <Store size={18} />
          </div>
          <div className="user-details hide-mobile">
            <span className="user-name">Shop Owner</span>
            <span className="user-role">Inventory Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
