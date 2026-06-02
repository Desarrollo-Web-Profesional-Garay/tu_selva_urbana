// src/services/api.js
// Capa de comunicación con el backend Express

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper para obtener el token del localStorage
const getToken = () => localStorage.getItem('tsu_token');

// Wrapper genérico para fetch con auth (MEJORADO)
async function request(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    try {
        const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

        let data;
        const contentType = res.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            data = await res.json();
        } else {
            const textResponse = await res.text();
            console.error('Respuesta no JSON recibida:', textResponse.substring(0, 200));
            throw new Error(`El servidor respondió con ${contentType || 'formato desconocido'}. Esperaba JSON.`);
        }

        if (!res.ok) {
            throw new Error(data.error || data.message || `Error ${res.status}: ${res.statusText}`);
        }

        return data;
    } catch (error) {
        if (error.name === 'SyntaxError') {
            throw new Error('El servidor no respondió con JSON válido. Revisa la conexión o el estado del backend.');
        }
        if (error.message.includes('Failed to fetch')) {
            throw new Error('No se pudo conectar con el servidor. ¿El backend está corriendo?');
        }
        throw error;
    }
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
    getAll: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.careLevel && filters.careLevel !== 'todas') params.append('careLevel', filters.careLevel);
        if (filters.petSafe === true) params.append('petSafe', 'true');
        if (filters.search) params.append('search', filters.search);
        const queryString = params.toString();
        return request(`/plants${queryString ? `?${queryString}` : ''}`);
    },
    getById: (id) => request(`/plants/${id}`),
    getBySlug: (slug) => request(`/plants/slug/${slug}`),
    getByCareLevel: (level) => request(`/plants/care-level/${level}`),
    getPetFriendly: () => request('/plants/pet-friendly'),
    create: (plantData) => request('/admin/plants', { method: 'POST', body: JSON.stringify(plantData) }),
    update: (id, plantData) => request(`/admin/plants/${id}`, { method: 'PUT', body: JSON.stringify(plantData) }),
    delete: (id) => request(`/admin/plants/${id}`, { method: 'DELETE' }),
    quiz: (answers) => request('/plants/quiz', { method: 'POST', body: JSON.stringify(answers) }),
};

export const postsAPI = {
    getAll: () => request('/posts'),
    create: (data) => request('/posts', { method: 'POST', body: JSON.stringify(data) }),
    like: (id) => request(`/posts/${id}/like`, { method: 'POST' }),
    getComments: (id) => request(`/posts/${id}/comments`),
    addComment: (id, text) => request(`/posts/${id}/comments`, { method: 'POST', body: JSON.stringify({ text }) }),
};

export const ordersAPI = {
    create: (items, address, paymentMethod) =>
        request('/orders', { method: 'POST', body: JSON.stringify({ items, address, paymentMethod }) }),
    getAll: () => request('/orders'),
};

export const usersAPI = {
    getMe: () => request('/users/me'),
    updateMe: (data) => request('/users/me', { method: 'PUT', body: JSON.stringify(data) }),
    getMyPlants: () => request('/users/me/plants'),
    adoptPlant: (plantId) => request('/users/me/plants', { method: 'POST', body: JSON.stringify({ plantId }) }),
};

 export const adminAPI = {
    getStats: () => request('/admin/stats'),
    getOrders: () => request('/admin/orders'),
    updateOrderStatus: (orderId, status) => request(`/admin/orders/${orderId}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    getUsers: () => request('/admin/users'),
    createUser: (userData) => request('/admin/users/create', { method: 'POST', body: JSON.stringify(userData) }),
    updateUserRole: (userId, role) => request(`/admin/users/${userId}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
    deleteUser: (userId) => request(`/admin/users/${userId}`, { method: 'DELETE' }),
    createPlant: (plantData) => request('/admin/plants', { method: 'POST', body: JSON.stringify(plantData) }),
    updatePlant: (id, plantData) => request(`/admin/plants/${id}`, { method: 'PUT', body: JSON.stringify(plantData) }),
    deletePlant: (id) => request(`/admin/plants/${id}`, { method: 'DELETE' }),
};

// ========== CHATBOT ==========
export const chatAPI = {
    sendMessage: (message, context) =>
        request('/chat', { method: 'POST', body: JSON.stringify({ message, context }) })
};
