import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Package,
  Layers,
  AlertTriangle,
  Wallet,
  TrendingUp,
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCard from './components/StatCard';
import FilterBar from './components/FilterBar';
import ProductTable from './components/ProductTable';
import ProductModal from './components/ProductModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import DbAlertBanner from './components/DbAlertBanner';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  checkHealth,
} from './api/productApi';
import './App.css';

export default function App() {
  // Main Data States
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalStockQuantity: 0,
    lowStockProducts: 0,
    totalStockPurchaseValue: 0,
    totalStockSellingValue: 0,
    expectedProfit: 0,
    availableCategories: [],
  });
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState({ connected: false, state: 'connecting' });

  // Navigation & View State
  const [activeView, setActiveView] = useState('all'); // 'all' | 'low-stock'
  const [mobileOpen, setMobileOpen] = useState(false);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modals State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notifications State
  const [toast, setToast] = useState(null);

  const showToast = useCallback((type, message, title) => {
    setToast({ type, message, title });
  }, []);

  // Fetch Health & Database Status
  const loadDbStatus = useCallback(async () => {
    try {
      const res = await checkHealth();
      if (res.ok && res.data?.database) {
        setDbStatus(res.data.database);
      } else {
        setDbStatus({ connected: false, state: 'disconnected' });
      }
    } catch {
      setDbStatus({ connected: false, state: 'disconnected' });
    }
  }, []);

  // Fetch Inventory Products from Server
  const loadProducts = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);

    try {
      // Query parameters for the backend
      const params = {
        search: searchQuery,
        category: selectedCategory,
        lowStock: lowStockOnly || activeView === 'low-stock',
        sortBy,
        order: sortOrder,
      };

      const res = await fetchProducts(params);

      if (res.success) {
        setProducts(res.data || []);
        if (res.summary) {
          setSummary(res.summary);
        }
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
      const isDbDown = err.message && err.message.toLowerCase().includes('mongodb is currently disconnected');
      if (!isDbDown || isBackground) {
        showToast('error', err.message || 'Could not connect to MiniShop backend.', 'Inventory Notice');
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [searchQuery, selectedCategory, lowStockOnly, activeView, sortBy, sortOrder, showToast]);

  // Initial load
  useEffect(() => {
    loadDbStatus();
    loadProducts();
  }, [loadDbStatus, loadProducts]);

  // Switch views when clicking Low Stock Alerts in sidebar
  const handleViewChange = (view) => {
    setActiveView(view);
    if (view === 'low-stock') {
      setLowStockOnly(true);
    } else {
      setLowStockOnly(false);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setLowStockOnly(false);
    setSortBy('createdAt');
    setSortOrder('desc');
    setActiveView('all');
  };

  // Export current products to CSV
  const handleExportCsv = () => {
    if (!products || products.length === 0) {
      showToast('error', 'No products available to export.', 'Export Notice');
      return;
    }

    const headers = [
      'Product Name',
      'Category',
      'Purchase Price (INR)',
      'Selling Price (INR)',
      'Profit Per Unit (INR)',
      'Stock Quantity',
      'Total Stock Value (INR)',
      'Low Stock Status',
    ];

    const rows = products.map((p) => {
      const profit = (p.sellingPrice - p.purchasePrice).toFixed(2);
      const totalVal = (p.purchasePrice * p.quantity).toFixed(2);
      const lowStock = p.quantity <= 5 ? 'YES (Low Stock)' : 'Normal';
      return [
        `"${(p.name || '').replace(/"/g, '""')}"`,
        `"${(p.category || '').replace(/"/g, '""')}"`,
        p.purchasePrice,
        p.sellingPrice,
        profit,
        p.quantity,
        totalVal,
        `"${lowStock}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `minishop_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Inventory exported to CSV successfully!', 'Export Complete');
  };

  // Add or Edit Product Handler
  const handleSaveProduct = async (productData) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        // Edit Operation
        const res = await updateProduct(editingProduct._id, productData);
        showToast('success', `"${res.data.name}" updated successfully!`, 'Product Updated');
      } else {
        // Create Operation
        const res = await createProduct(productData);
        showToast('success', `"${res.data.name}" added to inventory!`, 'Product Created');
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      await loadProducts(true);
      await loadDbStatus();
    } catch (err) {
      console.error('Save error:', err);
      showToast('error', err.message || 'Operation failed. Please check inputs.', 'Save Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  // Delete Product Handler
  const handleConfirmDelete = async (id) => {
    setIsDeleting(true);
    try {
      const res = await deleteProduct(id);
      showToast('info', res.message || 'Product removed from stock.', 'Product Deleted');
      setDeletingProduct(null);
      await loadProducts(true);
      await loadDbStatus();
    } catch (err) {
      console.error('Delete error:', err);
      showToast('error', err.message || 'Could not delete product.', 'Delete Failed');
    } finally {
      setIsDeleting(false);
    }
  };

  // Currency Formatter (INR ₹)
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  // Derive categories list (from summary or fallback list)
  const categoriesList = useMemo(() => {
    const defaultCats = [
      'Electronics',
      'Groceries',
      'Clothing & Apparel',
      'Footwear',
      'Stationery & Books',
      'Home & Kitchen',
      'Accessories',
    ];
    const combined = new Set([...defaultCats, ...(summary.availableCategories || [])]);
    return Array.from(combined).sort();
  }, [summary.availableCategories]);

  return (
    <div className="app-layout">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={handleViewChange}
        lowStockCount={summary.lowStockProducts}
        totalProducts={summary.totalProducts}
        dbStatus={dbStatus}
        onRefresh={() => {
          loadDbStatus();
          loadProducts();
        }}
        onOpenAddModal={handleOpenAdd}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Header
          onOpenAddModal={handleOpenAdd}
          onRefresh={() => {
            loadDbStatus();
            loadProducts();
          }}
          loading={loading}
          setMobileOpen={setMobileOpen}
        />

        <main className="content-container">
          {/* Database Alert Banner if Atlas is disconnected */}
          <DbAlertBanner
            dbStatus={dbStatus}
            onRefresh={() => {
              loadDbStatus();
              loadProducts();
            }}
          />

          {/* 5 Summary Stat Cards */}
          <section className="stats-grid">
            {/* 1. Total Products */}
            <StatCard
              title="Total Products"
              value={summary.totalProducts}
              subtext="Active inventory SKUs"
              icon={Package}
              variant="purple"
              badgeText="In Stock"
              badgeType="default"
            />

            {/* 2. Total Stock Quantity */}
            <StatCard
              title="Total Stock Units"
              value={summary.totalStockQuantity}
              subtext="Total items in warehouse"
              icon={Layers}
              variant="blue"
              badgeText="Quantity"
              badgeType="default"
            />

            {/* 3. Low-Stock Products */}
            <StatCard
              title="Low Stock Products"
              value={summary.lowStockProducts}
              subtext="Products with stock ≤ 5"
              icon={AlertTriangle}
              variant="red"
              badgeText={summary.lowStockProducts > 0 ? 'Action Needed' : 'Healthy'}
              badgeType={summary.lowStockProducts > 0 ? 'danger' : 'success'}
            />

            {/* 4. Total Stock Purchase Value */}
            <StatCard
              title="Purchase Inventory Value"
              value={formatINR(summary.totalStockPurchaseValue)}
              subtext="Total capital invested"
              icon={Wallet}
              variant="amber"
              badgeText="Investment"
              badgeType="default"
            />

            {/* 5. Total Expected Profit */}
            <StatCard
              title="Expected Stock Profit"
              value={formatINR(summary.expectedProfit)}
              subtext={`Est. Revenue: ${formatINR(summary.totalStockSellingValue)}`}
              icon={TrendingUp}
              variant="emerald"
              badgeText="Projected"
              badgeType="success"
            />
          </section>

          {/* Search, Filter & Sort Controls */}
          <FilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categoriesList}
            lowStockOnly={lowStockOnly}
            setLowStockOnly={setLowStockOnly}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            onResetFilters={handleResetFilters}
            onExportCsv={handleExportCsv}
            totalResults={products.length}
          />

          {/* Inventory Table */}
          <ProductTable
            products={products}
            loading={loading}
            onEdit={handleOpenEdit}
            onDelete={(prod) => setDeletingProduct(prod)}
            onOpenAddModal={handleOpenAdd}
          />
        </main>
      </div>

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSaveProduct}
        initialData={editingProduct}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleConfirmDelete}
        product={deletingProduct}
        isDeleting={isDeleting}
      />
    </div>
  );
}
