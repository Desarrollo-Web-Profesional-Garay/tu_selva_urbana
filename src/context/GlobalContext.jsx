import { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI, plantsAPI, postsAPI, usersAPI } from '../services/api';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    // ========== AUTH ==========
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('tsu_user');
        const token = localStorage.getItem('tsu_token');
        // Si hay usuario guardado pero NO hay token (sesión vieja del mock), limpiar
        if (saved && !token) {
            localStorage.removeItem('tsu_user');
            return null;
        }
        return saved ? JSON.parse(saved) : null;
    });
    const isAuthenticated = !!user;

    useEffect(() => {
        if (user) localStorage.setItem('tsu_user', JSON.stringify(user));
        else {
            localStorage.removeItem('tsu_user');
            localStorage.removeItem('tsu_token');
        }
    }, [user]);

    const login = async (email, password) => {
        try {
            const data = await authAPI.login(email, password);
            localStorage.setItem('tsu_token', data.token);
            setUser(data.user);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const register = async (name, email, password) => {
        try {
            const data = await authAPI.register(name, email, password);
            localStorage.setItem('tsu_token', data.token);
            setUser(data.user);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const logout = () => setUser(null);

    // ========== PLANTS (catálogo) ==========
    const [plantDatabase, setPlantDatabase] = useState([]);

    const fetchPlants = useCallback(async () => {
        try {
            const data = await plantsAPI.getAll();
            setPlantDatabase(data);
        } catch (err) {
            console.error('Error cargando plantas:', err);
        }
    }, []);

    useEffect(() => { fetchPlants(); }, [fetchPlants]);

    // ========== QUIZ / RECOMENDACIONES ==========
    const [quizAnswers, setQuizAnswers] = useState(() => {
        const saved = localStorage.getItem('tsu_quiz_answers');
        return saved ? JSON.parse(saved) : null;
    });
    const [recommendations, setRecommendations] = useState(() => {
        const saved = localStorage.getItem('tsu_recommendations');
        return saved ? JSON.parse(saved) : [];
    });

    const handleDiagnostic = async (answers) => {
        setQuizAnswers(answers);
        try {
            const data = await plantsAPI.quiz(answers);
            setRecommendations(data);
            localStorage.setItem('tsu_quiz_answers', JSON.stringify(answers));
            localStorage.setItem('tsu_recommendations', JSON.stringify(data));
        } catch (err) {
            console.error('Error en quiz:', err);
            const fallback = plantDatabase.slice(0, 3);
            setRecommendations(fallback);
            localStorage.setItem('tsu_quiz_answers', JSON.stringify(answers));
            localStorage.setItem('tsu_recommendations', JSON.stringify(fallback));
        }
    };

    // ========== MIS PLANTAS ==========
    const [myPlants, setMyPlants] = useState([]);

    const fetchMyPlants = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const data = await usersAPI.getMyPlants();
            setMyPlants(data);
        } catch (err) {
            console.error('Error cargando mis plantas:', err);
        }
    }, [isAuthenticated]);

    useEffect(() => { fetchMyPlants(); }, [fetchMyPlants]);

    const adoptPlant = async (plant) => {
        try {
            await usersAPI.adoptPlant(plant.id);
            await fetchMyPlants(); // Refrescar lista
            return true;
        } catch (err) {
            console.error('Error adoptando:', err);
            return false;
        }
    };

    // ========== POSTS (Feed) ==========
    const [posts, setPosts] = useState([]);

    const fetchPosts = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const data = await postsAPI.getAll();
            setPosts(data);
        } catch (err) {
            console.error('Error cargando posts:', err);
        }
    }, [isAuthenticated]);

    useEffect(() => { fetchPosts(); }, [fetchPosts]);

    const likePost = async (postId) => {
        try {
            const { likes, likedBy } = await postsAPI.like(postId);
            setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes, likedBy } : p));
        } catch (err) {
            console.error('Error dando like:', err);
        }
    };

    const updateProfile = async (data) => {
        try {
            const updatedUser = await usersAPI.updateMe(data);
            setUser(updatedUser);
            return { success: true };
        } catch (err) {
            console.error('Error actualizando perfil:', err);
            return { success: false, error: err.message };
        }
    };

    return (
        <GlobalContext.Provider value={{
            user, isAuthenticated, login, register, logout, updateProfile,
            posts, likePost, fetchPosts,
            myPlants, adoptPlant,
            recommendations, quizAnswers, handleDiagnostic,
            plantDatabase,
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

