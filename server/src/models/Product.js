import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters long'],
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      maxlength: [50, 'Category cannot exceed 50 characters'],
    },
    purchasePrice: {
      type: Number,
      required: [true, 'Purchase price is required'],
      min: [0, 'Purchase price cannot be negative'],
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Selling price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock quantity cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be a whole number',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for profit per unit (sellingPrice - purchasePrice)
productSchema.virtual('profitPerUnit').get(function () {
  return Number((this.sellingPrice - this.purchasePrice).toFixed(2));
});

// Virtual for low stock status (5 or less)
productSchema.virtual('isLowStock').get(function () {
  return this.quantity <= 5;
});

// Virtual for total stock purchase value (purchasePrice * quantity)
productSchema.virtual('totalPurchaseValue').get(function () {
  return Number((this.purchasePrice * this.quantity).toFixed(2));
});

// Virtual for total stock potential selling value (sellingPrice * quantity)
productSchema.virtual('totalSellingValue').get(function () {
  return Number((this.sellingPrice * this.quantity).toFixed(2));
});

// Index for efficient search by name and filtering by category
productSchema.index({ name: 'text', category: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
