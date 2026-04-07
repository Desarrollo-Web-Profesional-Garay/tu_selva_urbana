// src/services/api.js
// Capa de comunicación con el backend Express

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper para obtener el token del localStorage
const getToken = () => localStorage.getItem('tsu_token');

// Wrapper genérico para fetch con auth
async function request(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || 'Error en la petición');
    }

    return data;
}

// ========== AUTH ==========
export const authAPI = {
    login: (email, password) =>
        request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

    register: (name, email, password, phone) =>
        request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, phone }) }),

    verifyEmail: (email, code) =>
        request('/auth/verify-email', { method: 'POST', body: JSON.stringify({ email, code }) }),

    forgotPassword: (email) =>
        request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

    resetPassword: (token, password) =>
        request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }),

    resendCode: (email) =>
        request('/auth/resend-code', { method: 'POST', body: JSON.stringify({ email }) }),
};

// ========== PLANTS ==========
export const plantsAPI = {
    getAll: () => request('/plants'),
    getById: (id) => request(`/plants/${id}`),
    quiz: (answers) =>
        request('/plants/quiz', { method: 'POST', body: JSON.stringify(answers) }),
};

// ========== POSTS ==========
export const postsAPI = {
    getAll: () => request('/posts'),
    create: (data) =>
        request('/posts', { method: 'POST', body: JSON.stringify(data) }),
    like: (id) =>
        request(`/posts/${id}/like`, { method: 'POST' }),
    getComments: (id) => request(`/posts/${id}/comments`),
    addComment: (id, text) => request(`/posts/${id}/comments`, { method: 'POST', body: JSON.stringify({ text }) }),
};

// ========== ORDERS ==========
export const ordersAPI = {
    create: (items, address, paymentMethod) =>
        request('/orders', { method: 'POST', body: JSON.stringify({ items, address, paymentMethod }) }),
    getAll: () => request('/orders'),
};

// ========== USERS ==========
export const usersAPI = {
    getMe: () => request('/users/me'),
    updateMe: (data) =>
        request('/users/me', { method: 'PUT', body: JSON.stringify(data) }),
    getMyPlants: () => request('/users/me/plants'),
    adoptPlant: (plantId) =>
        request('/users/me/plants', { method: 'POST', body: JSON.stringify({ plantId }) }),
};

// ========== CHATBOT ==========
export const chatAPI = {
    sendMessage: (message, context) =>
        request('/chat', { method: 'POST', body: JSON.stringify({ message, context }) })
};
