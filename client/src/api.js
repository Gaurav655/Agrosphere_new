import axios from 'axios';

const API_URI = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URI,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const fetchEquipment = async () => {
  const response = await api.get('/equipment');
  return response.data;
};

export const fetchEquipmentById = async (id) => {
  const response = await api.get(`/equipment/${id}`);
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const fetchUserBookings = async () => {
  const response = await api.get('/bookings');
  return response.data;
};

export const updateBookingStatus = async (id, status) => {
  const response = await api.patch(`/bookings/${id}/status`, { status });
  return response.data;
};

export default api;
