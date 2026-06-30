import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

export const analyzeText = (text) => api.post('/analyze', { text });

export const saveDocument = (data) => api.post('/save', data);

export const getHistory = () => api.get('/history');

export const getDocumentById = (id) => api.get(`/history/${id}`);

export const deleteDocument = (id) => api.delete(`/history/${id}`);

export default api;
