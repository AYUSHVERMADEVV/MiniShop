import React, { useState, useEffect } from 'react';
import {
  X,
  Package,
  Layers,
  Coins,
  TrendingUp,
  Boxes,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

const COMMON_CATEGORIES = [
  'Electronics',
  'Groceries',
  'Clothing & Apparel',
  'Footwear',
  'Stationery & Books',
  'Home & Kitchen',
  'Personal Care & Cosmetics',
  'Sports & Fitness',
  'Accessories',
];

export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    purchasePrice: '',
    sellingPrice: '',
    quantity: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || '',
        purchasePrice: initialData.purchasePrice?.toString() || '',
        sellingPrice: initialData.sellingPrice?.toString() || '',
        quantity: initialData.quantity?.toString() || '',
      });
    } else {
      setFormData({
        name: '',
        category: '',
        purchasePrice: '',
        sellingPrice: '',
        quantity: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCategorySelect = (e) => {
    const value = e.target.value;
    if (value === '__custom__') {
      setFormData((prev) => ({ ...prev, category: '' }));
    } else {
      setFormData((prev) => ({ ...prev, category: value }));
      if (errors.category) {
        setErrors((prev) => ({ ...prev, category: null }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    const purchase = Number(formData.purchasePrice);
    if (formData.purchasePrice === '' || isNaN(purchase)) {
      newErrors.purchasePrice = 'Enter a valid purchase price';
    } else if (purchase < 0) {
      newErrors.purchasePrice = 'Purchase price cannot be negative';
    }

    const selling = Number(formData.sellingPrice);
    if (formData.sellingPrice === '' || isNaN(selling)) {
      newErrors.sellingPrice = 'Enter a valid selling price';
    } else if (selling < 0) {
      newErrors.sellingPrice = 'Selling price cannot be negative';
    }

    const qty = Number(formData.quantity);
    if (formData.quantity === '' || isNaN(qty)) {
      newErrors.quantity = 'Enter a valid quantity';
    } else if (qty < 0 || !Number.isInteger(qty)) {
      newErrors.quantity = 'Quantity must be a positive whole number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      category: formData.category.trim(),
      purchasePrice: Number(formData.purchasePrice),
      sellingPrice: Number(formData.sellingPrice),
      quantity: Number(formData.quantity),
    });
  };

  // Calculations for live preview
  const numPurchase = Number(formData.purchasePrice) || 0;
  const numSelling = Number(formData.sellingPrice) || 0;
  const numQty = Number(formData.quantity) || 0;
  const unitProfit = Number((numSelling - numPurchase).toFixed(2));
  const profitMargin = numSelling > 0 ? ((unitProfit / numSelling) * 100).toFixed(1) : 0;
  const totalStockInvestment = Number((numPurchase * numQty).toFixed(2));
  const isLowStockWarning = numQty <= 5 && formData.quantity !== '';

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-info">
            <h3 className="modal-title">
              {isEditing ? 'Edit Product Details' : 'Add New Inventory Product'}
            </h3>
            <p className="modal-subtitle">
              {isEditing
                ? 'Update inventory pricing, stock level, or details'
                : 'Fill in product info to create a new stock item'}
            </p>
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

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {/* Product Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="prod-name">
              Product Name <span className="text-danger">*</span>
            </label>
            <div className="input-with-icon">
              <Package size={17} className="input-icon" />
              <input
                id="prod-name"
                name="name"
                type="text"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g. Wireless Bluetooth Headphones"
                value={formData.name}
                onChange={handleChange}
                autoFocus
              />
            </div>
            {errors.name && <span className="form-error-msg">{errors.name}</span>}
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label" htmlFor="prod-category">
              Category <span className="text-danger">*</span>
            </label>
            <div className="input-with-icon">
              <Layers size={17} className="input-icon" />
              <input
                id="prod-category"
                name="category"
                type="text"
                list="category-suggestions"
                className={`form-input ${errors.category ? 'input-error' : ''}`}
                placeholder="Select or type a category (e.g. Electronics)"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
            <datalist id="category-suggestions">
              {COMMON_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
            {errors.category && (
              <span className="form-error-msg">{errors.category}</span>
            )}
          </div>

          {/* Pricing Row: Purchase Price & Selling Price */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="prod-purchase">
                Purchase Price (₹) <span className="text-danger">*</span>
              </label>
              <div className="input-with-icon">
                <Coins size={17} className="input-icon" />
                <input
                  id="prod-purchase"
                  name="purchasePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  className={`form-input ${errors.purchasePrice ? 'input-error' : ''}`}
                  placeholder="0.00"
                  value={formData.purchasePrice}
                  onChange={handleChange}
                />
              </div>
              {errors.purchasePrice && (
                <span className="form-error-msg">{errors.purchasePrice}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prod-selling">
                Selling Price (₹) <span className="text-danger">*</span>
              </label>
              <div className="input-with-icon">
                <TrendingUp size={17} className="input-icon" />
                <input
                  id="prod-selling"
                  name="sellingPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  className={`form-input ${errors.sellingPrice ? 'input-error' : ''}`}
                  placeholder="0.00"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                />
              </div>
              {errors.sellingPrice && (
                <span className="form-error-msg">{errors.sellingPrice}</span>
              )}
            </div>
          </div>

          {/* Stock Quantity */}
          <div className="form-group">
            <label className="form-label" htmlFor="prod-quantity">
              Initial Stock Quantity <span className="text-danger">*</span>
            </label>
            <div className="input-with-icon">
              <Boxes size={17} className="input-icon" />
              <input
                id="prod-quantity"
                name="quantity"
                type="number"
                step="1"
                min="0"
                className={`form-input ${errors.quantity ? 'input-error' : ''}`}
                placeholder="e.g. 25"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>
            {errors.quantity && (
              <span className="form-error-msg">{errors.quantity}</span>
            )}
          </div>

          {/* Dynamic Calculation Live Preview Box */}
          <div className="calc-preview-card">
            <div className="calc-preview-header">
              <span className="calc-title">Live Profit & Margin Calculation</span>
              {isLowStockWarning && (
                <span className="calc-warning-pill">
                  <AlertTriangle size={13} />
                  <span>Low Stock Alert (≤ 5)</span>
                </span>
              )}
            </div>
            <div className="calc-preview-grid">
              <div className="calc-stat">
                <span className="calc-label">Profit per Unit</span>
                <span
                  className={`calc-value ${
                    unitProfit >= 0 ? 'text-success' : 'text-danger'
                  }`}
                >
                  ₹{unitProfit.toFixed(2)}
                </span>
              </div>
              <div className="calc-stat">
                <span className="calc-label">Profit Margin</span>
                <span
                  className={`calc-value ${
                    unitProfit >= 0 ? 'text-success' : 'text-danger'
                  }`}
                >
                  {profitMargin}%
                </span>
              </div>
              <div className="calc-stat">
                <span className="calc-label">Total Stock Cost</span>
                <span className="calc-value">₹{totalStockInvestment.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="btn-spinner"></span>
                  <span>{isEditing ? 'Updating...' : 'Adding...'}</span>
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  <span>{isEditing ? 'Save Changes' : 'Add Product'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
