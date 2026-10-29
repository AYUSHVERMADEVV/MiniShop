import React from 'react';
import {
  Edit2,
  Trash2,
  AlertTriangle,
  Package,
  TrendingUp,
  TrendingDown,
  Plus,
} from 'lucide-react';

export default function ProductTable({
  products,
  loading,
  onEdit,
  onDelete,
  onOpenAddModal,
}) {
  // Format currency helper (INR ₹)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="table-card">
        <div className="loading-container">
          <div className="spinner-purple"></div>
          <p className="loading-text">Loading inventory products from MongoDB...</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="table-card">
        <div className="empty-state">
          <div className="empty-icon-wrap">
            <Package size={44} className="empty-icon" />
          </div>
          <h3 className="empty-title">No Products Found</h3>
          <p className="empty-desc">
            No items match your search or filter criteria. Add your first item to start tracking inventory!
          </p>
          <button className="btn btn-primary" onClick={onOpenAddModal}>
            <Plus size={18} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="products-table">
          <thead>
            <tr>
              <th>Product Details</th>
              <th>Category</th>
              <th className="text-right">Purchase (₹)</th>
              <th className="text-right">Selling (₹)</th>
              <th className="text-right">Profit / Unit</th>
              <th className="text-center">Stock Units</th>
              <th className="text-right">Total Value</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const profit = Number((product.sellingPrice - product.purchasePrice).toFixed(2));
              const isProfitPositive = profit >= 0;
              const isLowStock = product.quantity <= 5;
              const totalVal = product.purchasePrice * product.quantity;

              return (
                <tr key={product._id} className={isLowStock ? 'row-low-stock' : ''}>
                  {/* Product Name */}
                  <td>
                    <div className="product-identity">
                      <div className="product-avatar">
                        <Package size={18} />
                      </div>
                      <div className="product-names">
                        <span className="product-title" title={product.name}>
                          {product.name}
                        </span>
                        <span className="product-id">ID: {product._id.slice(-6)}</span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td>
                    <span className="category-pill">{product.category}</span>
                  </td>

                  {/* Purchase Price */}
                  <td className="text-right price-text">
                    {formatCurrency(product.purchasePrice)}
                  </td>

                  {/* Selling Price */}
                  <td className="text-right price-text font-semibold">
                    {formatCurrency(product.sellingPrice)}
                  </td>

                  {/* Profit per Unit */}
                  <td className="text-right">
                    <div className="profit-cell">
                      <span
                        className={`profit-badge ${
                          isProfitPositive ? 'profit-positive' : 'profit-negative'
                        }`}
                      >
                        {isProfitPositive ? (
                          <TrendingUp size={13} />
                        ) : (
                          <TrendingDown size={13} />
                        )}
                        <span>{formatCurrency(profit)}</span>
                      </span>
                    </div>
                  </td>

                  {/* Quantity & Low Stock Indicator */}
                  <td className="text-center">
                    <div className="stock-quantity-cell">
                      <span className="quantity-number">{product.quantity}</span>
                      {isLowStock ? (
                        <span className="low-stock-badge" title="Stock is 5 or less!">
                          <AlertTriangle size={12} />
                          <span>Low Stock</span>
                        </span>
                      ) : (
                        <span className="in-stock-badge">In Stock</span>
                      )}
                    </div>
                  </td>

                  {/* Total Stock Value */}
                  <td className="text-right price-text text-muted">
                    {formatCurrency(totalVal)}
                  </td>

                  {/* Actions: Edit & Delete */}
                  <td className="text-center">
                    <div className="action-buttons">
                      <button
                        className="action-btn-edit"
                        onClick={() => onEdit(product)}
                        title={`Edit ${product.name}`}
                      >
                        <Edit2 size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        className="action-btn-delete"
                        onClick={() => onDelete(product)}
                        title={`Delete ${product.name}`}
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
