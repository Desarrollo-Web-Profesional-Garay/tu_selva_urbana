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

    register: (name, email, password) =>
        request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
};

// ========== PLANTS ==========
export const plantsAPI = {
    // Obtener todas las plantas (con filtros opcionales)
    getAll: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.careLevel && filters.careLevel !== 'todas') params.append('careLevel', filters.careLevel);
        if (filters.petSafe === true) params.append('petSafe', 'true');
        if (filters.search) params.append('search', filters.search);
        
        const queryString = params.toString();
        return request(`/plants${queryString ? `?${queryString}` : ''}`);
    },
    
    // Obtener planta por ID
    getById: (id) => request(`/plants/${id}`),
    
    // Obtener planta por slug
    getBySlug: (slug) => request(`/plants/slug/${slug}`),
    
    // Obtener plantas por nivel de cuidado
    getByCareLevel: (level) => request(`/plants/care-level/${level}`),
    
    // Obtener plantas pet friendly
    getPetFriendly: () => request('/plants/pet-friendly'),
    
    // Crear una nueva planta (requiere auth)
    create: (plantData) => request('/plants', { 
        method: 'POST', 
        body: JSON.stringify(plantData) 
    }),
    
    // Actualizar una planta (requiere auth)
    update: (id, plantData) => request(`/plants/${id}`, { 
        method: 'PUT', 
        body: JSON.stringify(plantData) 
    }),
    
    // Eliminar una planta (requiere auth)
    delete: (id) => request(`/plants/${id}`, { 
        method: 'DELETE' 
    }),
    
    // Quiz de recomendaciones
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
};

// ========== ORDERS ==========
export const ordersAPI = {
    create: (items) =>
        request('/orders', { method: 'POST', body: JSON.stringify({ items }) }),
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