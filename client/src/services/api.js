import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shopwave_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('shopwave_token');
      localStorage.removeItem('shopwave_user');
      window.location.href = '/login';
    }
    return Promise.reject(err.response?.data || err);
  }
);

// ── AUTH ──────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  addAddress: (data) => api.post('/auth/address', data),
  updateAddress: (id, data) => api.put(`/auth/address/${id}`, data),
  deleteAddress: (id) => api.delete(`/auth/address/${id}`),
  toggleWishlist: (productId) => api.post(`/auth/wishlist/${productId}`),
};

// ── PRODUCTS ──────────────────────────────────────────────────────────────
export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getFeatured: () => api.get('/products/featured'),
  getNewArrivals: () => api.get('/products/new-arrivals'),
  getProduct: (id) => api.get(`/products/${id}`),
  getRelated: (id) => api.get(`/products/${id}/related`),
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data),
  // Admin
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// ── ORDERS ────────────────────────────────────────────────────────────────
export const orderAPI = {
  createOrder: (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders/my', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  payOrder: (id, data) => api.put(`/orders/${id}/pay`, data),
  // Admin
  getAllOrders: (params) => api.get('/orders', { params }),
  updateOrderStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  getOrderStats: () => api.get('/orders/stats'),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
};

// ── USERS (ADMIN) ─────────────────────────────────────────────────────────
export const userAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUserStats: () => api.get('/users/stats'),
};

// ── CATEGORIES ─────────────────────────────────────────────────────────────
export const categoryAPI = {
  getCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

// ── UPLOAD ─────────────────────────────────────────────────────────────────
export const uploadAPI = {
  uploadImage: (file) => {
    const form = new FormData();
    form.append('image', file);
    return api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

export default api;
