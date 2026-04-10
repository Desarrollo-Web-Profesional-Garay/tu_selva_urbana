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

    const register = async (name, email, password, phone) => {
        try {
            const data = await authAPI.register(name, email, password, phone);
            // Si el backend pide verificación, no logueamos aún
            if (data.requiresVerification) {
                return { success: true, requiresVerification: true, email };
            }
            // En caso de que no requiera verificación (legado)
            if (data.token) {
                localStorage.setItem('tsu_token', data.token);
                setUser(data.user);
            }
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

    // ========== CARRITO ==========
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('tsu_cart');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Sincronizar carrito con localStorage
    useEffect(() => {
        localStorage.setItem('tsu_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (plant, qty = 1) => {
        setCart(prev => {
            // Limpiar items corruptos antes de operar
            const clean = prev.filter(item => item?.plant?.id !== undefined && item?.plant?.price !== undefined);
            const existing = clean.find(item => item.plant.id === plant.id);
            if (existing) {
                return clean.map(item =>
                    item.plant.id === plant.id
                        ? { ...item, quantity: item.quantity + qty }
                        : item
                );
            }
            return [...clean, { plant, quantity: qty }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (plantId) => {
        setCart(prev => prev.filter(item => item.plant.id !== plantId));
    };

    const updateQty = (plantId, qty) => {
        if (qty <= 0) { removeFromCart(plantId); return; }
        setCart(prev => prev.map(item =>
            item.plant.id === plantId ? { ...item, quantity: qty } : item
        ));
    };

    const clearCart = () => setCart([]);

    // Filtrar items corruptos (por si hay datos viejos en localStorage)
    const safeCart = cart.filter(item => item?.plant?.price !== undefined);
    const cartCount = safeCart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const cartTotal = safeCart.reduce((sum, item) => sum + (item.plant.price * (item.quantity || 1)), 0);

    return (
        <GlobalContext.Provider value={{
            user, isAuthenticated, login, register, logout, updateProfile,
            posts, likePost, fetchPosts,
            myPlants, adoptPlant,
            recommendations, quizAnswers, handleDiagnostic,
            plantDatabase,
            cart: safeCart, addToCart, removeFromCart, updateQty, clearCart,
            cartCount, cartTotal, isCartOpen, setIsCartOpen,
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

