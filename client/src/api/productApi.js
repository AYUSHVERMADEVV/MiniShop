// MiniShop API Client

const API_BASE = '/api';

/**
 * Check backend health and MongoDB Atlas connection status
 */
export const checkHealth = async () => {
  try {
    const res = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    return {
      ok: false,
      data: {
        status: 'error',
        database: { connected: false, state: 'disconnected', message: error.message },
      },
    };
  }
};

/**
 * Fetch products with optional search and filters
 * @param {Object} params - { search, category, lowStock, sortBy, order }
 */
export const fetchProducts = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.category && params.category !== 'All') query.append('category', params.category);
  if (params.lowStock) query.append('lowStock', 'true');
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.order) query.append('order', params.order);

  const queryString = query.toString();
  const url = `${API_BASE}/products${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.error || 'Failed to fetch products');
  }

  return data;
};

/**
 * Fetch a single product by ID
 * @param {string} id
 */
export const fetchProductById = async (id) => {
  const res = await fetch(`${API_BASE}/products/${id}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.error || 'Failed to fetch product details');
  }

  return data.data;
};

/**
 * Create a new product
 * @param {Object} productData - { name, category, purchasePrice, sellingPrice, quantity }
 */
export const createProduct = async (productData) => {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.error || 'Failed to create product');
  }

  return data;
};

/**
 * Update an existing product
 * @param {string} id
 * @param {Object} productData - { name, category, purchasePrice, sellingPrice, quantity }
 */
export const updateProduct = async (id, productData) => {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.error || 'Failed to update product');
  }

  return data;
};

/**
 * Delete a product
 * @param {string} id
 */
export const deleteProduct = async (id) => {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.error || 'Failed to delete product');
  }

  return data;
};
