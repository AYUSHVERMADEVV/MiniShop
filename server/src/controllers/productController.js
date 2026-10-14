import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { isDbConnected, getDbStateName } from '../config/db.js';

// Helper to check DB connection before queries
const ensureDbConnection = (res) => {
  if (!isDbConnected()) {
    res.status(503).json({
      success: false,
      error: 'Database unavailable',
      message: 'MongoDB is currently disconnected. Please verify your MONGODB_URI in server/.env',
      dbState: getDbStateName(),
    });
    return false;
  }
  return true;
};

// @desc    Health check & DB status
// @route   GET /api/health
export const getHealth = async (req, res) => {
  const connected = isDbConnected();
  const dbState = getDbStateName();

  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      connected,
      state: dbState,
      message: connected
        ? 'MongoDB Atlas is connected and ready'
        : 'MongoDB is not connected. Configure MONGODB_URI in server/.env',
    },
  });
};

// @desc    Get all products with search, filter & calculated summary statistics
// @route   GET /api/products
export const getProducts = async (req, res) => {
  try {
    if (!ensureDbConnection(res)) return;

    const { search, category, lowStock, sortBy, order } = req.query;

    // Build filter query
    const filter = {};

    if (search && search.trim() !== '') {
      filter.name = { $regex: search.trim(), $options: 'i' };
    }

    if (category && category.trim() !== '' && category.toLowerCase() !== 'all') {
      filter.category = { $regex: `^${category.trim()}$`, $options: 'i' };
    }

    if (lowStock === 'true' || lowStock === true) {
      filter.quantity = { $lte: 5 };
    }

    // Build sorting query
    let sortOptions = { createdAt: -1 };
    if (sortBy) {
      const sortDirection = order === 'asc' ? 1 : -1;
      sortOptions = { [sortBy]: sortDirection };
    }

    // Execute query
    const products = await Product.find(filter).sort(sortOptions);

    // Calculate aggregated overall summary (across all products in the database)
    const allProducts = await Product.find({});
    const totalProducts = allProducts.length;
    let totalStockQuantity = 0;
    let lowStockProducts = 0;
    let totalStockPurchaseValue = 0;
    let totalStockSellingValue = 0;
    const categorySet = new Set();

    for (const p of allProducts) {
      totalStockQuantity += p.quantity;
      if (p.quantity <= 5) lowStockProducts += 1;
      totalStockPurchaseValue += p.purchasePrice * p.quantity;
      totalStockSellingValue += p.sellingPrice * p.quantity;
      if (p.category) categorySet.add(p.category);
    }

    const summary = {
      totalProducts,
      totalStockQuantity,
      lowStockProducts,
      totalStockPurchaseValue: Number(totalStockPurchaseValue.toFixed(2)),
      totalStockSellingValue: Number(totalStockSellingValue.toFixed(2)),
      expectedProfit: Number((totalStockSellingValue - totalStockPurchaseValue).toFixed(2)),
      availableCategories: Array.from(categorySet).sort(),
    };

    res.status(200).json({
      success: true,
      count: products.length,
      summary,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message || 'Unable to retrieve products',
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    if (!ensureDbConnection(res)) return;

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID',
        message: `The provided product ID '${id}' is not a valid MongoDB ObjectId`,
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Product with ID '${id}' was not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(`Error fetching product ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message || 'Unable to retrieve product',
    });
  }
};

// @desc    Create a new product
// @route   POST /api/products
export const createProduct = async (req, res) => {
  try {
    if (!ensureDbConnection(res)) return;

    const { name, category, purchasePrice, sellingPrice, quantity } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!name || !name.trim()) missingFields.push('name');
    if (!category || !category.trim()) missingFields.push('category');
    if (purchasePrice === undefined || purchasePrice === null || purchasePrice === '') missingFields.push('purchasePrice');
    if (sellingPrice === undefined || sellingPrice === null || sellingPrice === '') missingFields.push('sellingPrice');
    if (quantity === undefined || quantity === null || quantity === '') missingFields.push('quantity');

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: `Missing required field(s): ${missingFields.join(', ')}`,
      });
    }

    // Number validations
    const numPurchase = Number(purchasePrice);
    const numSelling = Number(sellingPrice);
    const numQuantity = Number(quantity);

    if (isNaN(numPurchase) || numPurchase < 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Purchase price must be a non-negative number',
      });
    }

    if (isNaN(numSelling) || numSelling < 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Selling price must be a non-negative number',
      });
    }

    if (isNaN(numQuantity) || numQuantity < 0 || !Number.isInteger(numQuantity)) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Quantity must be a non-negative integer (whole number)',
      });
    }

    const product = await Product.create({
      name: name.trim(),
      category: category.trim(),
      purchasePrice: numPurchase,
      sellingPrice: numSelling,
      quantity: numQuantity,
    });

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: product,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: messages.join(', '),
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message || 'Unable to create product',
    });
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    if (!ensureDbConnection(res)) return;

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID',
        message: `The provided product ID '${id}' is not a valid MongoDB ObjectId`,
      });
    }

    const { name, category, purchasePrice, sellingPrice, quantity } = req.body;

    // Validate provided values
    const updates = {};

    if (name !== undefined) {
      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'Product name cannot be empty',
        });
      }
      updates.name = name.trim();
    }

    if (category !== undefined) {
      if (!category || !category.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'Category cannot be empty',
        });
      }
      updates.category = category.trim();
    }

    if (purchasePrice !== undefined) {
      const numPurchase = Number(purchasePrice);
      if (isNaN(numPurchase) || numPurchase < 0) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'Purchase price must be a non-negative number',
        });
      }
      updates.purchasePrice = numPurchase;
    }

    if (sellingPrice !== undefined) {
      const numSelling = Number(sellingPrice);
      if (isNaN(numSelling) || numSelling < 0) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'Selling price must be a non-negative number',
        });
      }
      updates.sellingPrice = numSelling;
    }

    if (quantity !== undefined) {
      const numQuantity = Number(quantity);
      if (isNaN(numQuantity) || numQuantity < 0 || !Number.isInteger(numQuantity)) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'Quantity must be a non-negative integer (whole number)',
        });
      }
      updates.quantity = numQuantity;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Product with ID '${id}' was not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    console.error(`Error updating product ${req.params.id}:`, error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: messages.join(', '),
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message || 'Unable to update product',
    });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    if (!ensureDbConnection(res)) return;

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID',
        message: `The provided product ID '${id}' is not a valid MongoDB ObjectId`,
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Product with ID '${id}' was not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Product '${deletedProduct.name}' deleted successfully`,
      data: { id: deletedProduct._id, name: deletedProduct.name },
    });
  } catch (error) {
    console.error(`Error deleting product ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message || 'Unable to delete product',
    });
  }
};
