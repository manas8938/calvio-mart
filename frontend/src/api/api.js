import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('calvio_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('calvio_token');
      localStorage.removeItem('calvio_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const adminLogin = (email, password) => API.post('/auth/admin/login', { email, password });
export const adminSignup = (email, password, secretKey) => API.post('/auth/admin/signup', { email, password, secretKey });
export const sendOtp = (email) => API.post('/auth/send-otp', { email });
export const verifyOtp = (email, otp, orderId) => API.post('/auth/verify-otp', { email, otp, orderId });

// Product endpoints
export const getProducts = (page = 1, perPage = 12, sort, search) => {
  const params = new URLSearchParams({ page, perPage });
  if (sort) params.append('sort', sort);
  if (search) params.append('search', search);
  return API.get(`/products?${params}`);
};

export const searchProducts = (query, page = 1, perPage = 12) => {
  return getProducts(page, perPage, null, query);
};

export const getProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (formData) => API.post('/products', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const updateProduct = (id, formData) => API.patch(`/products/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Order endpoints
export const createOrder = (data) => API.post('/orders', data);
export const getOrder = (id) => API.get(`/orders/${id}`);
export const getOrders = (page = 1, perPage = 10) => API.get(`/orders?page=${page}&perPage=${perPage}`);
export const getUserOrders = (email) => API.get(`/orders/user/${encodeURIComponent(email)}`);
export const generateWaLink = (id) => API.get(`/orders/${id}/wa-link`);
export const confirmViaWhatsapp = (id) => API.post(`/orders/${id}/confirm-via-whatsapp`);
export const cancelOrder = (id) => API.post(`/orders/${id}/cancel`);

export default API;
