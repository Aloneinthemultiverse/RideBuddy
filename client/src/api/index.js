import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('ridebuddy_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);

// Users
export const getMyProfile = () => API.get('/users/me');
export const updateMyProfile = (data) => API.put('/users/me', data);
export const getUserProfile = (id) => API.get(`/users/${id}`);

// Rides
export const createRide = (data) => API.post('/rides', data);
export const searchRides = (params) => API.get('/rides', { params });
export const getMyRides = () => API.get('/rides/my');
export const getRideById = (id) => API.get(`/rides/${id}`);
export const cancelRide = (id) => API.delete(`/rides/${id}`);
export const completeRide = (id) => API.put(`/rides/${id}/complete`);

// Requests
export const createRequest = (data) => API.post('/requests', data);
export const getRequestsForRide = (rideId) => API.get(`/requests/ride/${rideId}`);
export const updateRequest = (id, data) => API.put(`/requests/${id}`, data);
export const getMyRequests = () => API.get('/requests/my');

// Messages
export const sendMessage = (data) => API.post('/messages', data);
export const getConversation = (rideId, userId) => API.get(`/messages/${rideId}/${userId}`);
export const getAllConversations = () => API.get('/messages/conversations/all');

// Reviews
export const createReview = (data) => API.post('/reviews', data);
export const getUserReviews = (userId) => API.get(`/reviews/user/${userId}`);

// Reports
export const reportUser = (data) => API.post('/reports', data);
export const getReports = () => API.get('/reports');
export const resolveReport = (id, data) => API.put(`/reports/${id}`, data);

// Admin
export const getAdminUsers = () => API.get('/admin/users');
export const toggleBlockUser = (id) => API.put(`/admin/users/${id}/block`);
export const getAdminStats = () => API.get('/admin/stats');

export default API;
