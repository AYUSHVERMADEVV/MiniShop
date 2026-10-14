import React from 'react';
import {
  LayoutDashboard,
  Package,
  AlertTriangle,
  PlusCircle,
  Database,
  RefreshCw,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';

export default function Sidebar({
  activeView,
  setActiveView,
  lowStockCount,
  totalProducts,
  dbStatus,
  onRefresh,
  onOpenAddModal,
  mobileOpen,
  setMobileOpen,
}) {
  const isConnected = dbStatus?.connected;

  const handleNavClick = (view) => {
    setActiveView(view);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">
            <ShoppingBag className="brand-icon" size={24} />
          </div>
          <div className="brand-info">
            <h1 className="brand-title">MiniShop</h1>
            <span className="brand-subtitle">Inventory Hub</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="sidebar-cta">
          <button
            className="btn btn-primary btn-block shadow-pulse"
            onClick={onOpenAddModal}
          >
            <PlusCircle size={18} />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Navigation List */}
        <nav className="sidebar-nav">
          <div className="nav-group-label">INVENTORY</div>

          <button
            className={`nav-item ${activeView === 'all' ? 'active' : ''}`}
            onClick={() => handleNavClick('all')}
          >
            <LayoutDashboard size={19} />
            <span className="nav-item-text">Dashboard</span>
            <span className="nav-badge">{totalProducts}</span>
          </button>

          <button
            className={`nav-item ${activeView === 'low-stock' ? 'active' : ''}`}
            onClick={() => handleNavClick('low-stock')}
          >
            <AlertTriangle size={19} className="nav-icon-warning" />
            <span className="nav-item-text">Low Stock Alerts</span>
            {lowStockCount > 0 && (
              <span className="nav-badge alert-badge">{lowStockCount}</span>
            )}
          </button>

          <div className="nav-group-label" style={{ marginTop: '24px' }}>
            MANAGEMENT
          </div>

          <button
            className="nav-item"
            onClick={onRefresh}
            title="Refresh inventory from database"
          >
            <RefreshCw size={19} />
            <span className="nav-item-text">Sync Data</span>
          </button>
        </nav>

        {/* Database Status Card in Footer */}
        <div className="sidebar-footer">
          <div className={`db-status-card ${isConnected ? 'connected' : 'disconnected'}`}>
            <div className="db-status-header">
              <div className="db-status-title">
                <Database size={15} />
                <span>MongoDB Atlas</span>
              </div>
              <span
                className={`db-indicator-dot ${isConnected ? 'dot-green' : 'dot-red'}`}
                title={isConnected ? 'Connected' : 'Disconnected'}
              />
            </div>
            <div className="db-status-text">
              {isConnected ? (
                <span className="text-success-soft">● Atlas Live & Connected</span>
              ) : (
                <span className="text-danger-soft">● Not Connected (Check .env)</span>
              )}
            </div>
          </div>

          <div className="sidebar-version">
            <span>MiniShop v1.0.0</span>
            <span className="dot-sep">•</span>
            <span>MERN Stack</span>
          </div>
        </div>
      </aside>
    </>
  );
}
