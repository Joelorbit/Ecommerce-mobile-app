import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || '';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  // If we had a token, add it here
  return config;
});

export const getProducts = async () => {
  const { data } = await api.get('/products');
  return data;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const register = async (email, password, full_name) => {
  const { data } = await api.post('/auth/register', { email, password, full_name });
  return data;
};

export const createOrder = async (items, total, address, token) => {
  const { data } = await api.post(
    '/orders',
    { items, total, address },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export default api;
