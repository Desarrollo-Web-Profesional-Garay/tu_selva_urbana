import { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI, plantsAPI, postsAPI, usersAPI } from '../services/api';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    // ========== AUTH ==========
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('tsu_user');
        const token = localStorage.getItem('tsu_token');
        // Si hay usuario guardado pero NO hay token (sesión vieja o expirada), limpiar
        if (saved && !token) {
            localStorage.removeItem('tsu_user');
            return null;
        }
        return saved ? JSON.parse(saved) : null;
    });

    const isAuthenticated = !!user;

    // Persistencia de sesión
    useEffect(() => {
        if (user) {
            localStorage.setItem('tsu_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('tsu_user');
            localStorage.removeItem('tsu_token');
        }
    }, [user]);

    const login = async (email, password) => {
        try {
            const data = await authAPI.login(email, password);
            if (data.token) {
                localStorage.setItem('tsu_token', data.token);
                setUser(data.user);
                // Retornamos el objeto completo para que Login.jsx decida la redirección
                return { success: true, user: data.user };
            }
            return { success: false, error: 'Respuesta de servidor incompleta' };
        } catch (err) {
            return { success: false, error: err.message || 'Error al iniciar sesión' };
        }
    };

    const register = async (name, email, password, phone) => {
        try {
            const data = await authAPI.register(name, email, password, phone);
            // Si el backend pide verificación OTP
            if (data.requiresVerification) {
                return { success: true, requiresVerification: true, email };
            }
            // Login automático si el backend no requiere OTP
            if (data.token) {
                localStorage.setItem('tsu_token', data.token);
                setUser(data.user);
            }
            return { success: true, user: data.user };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const logout = () => {
        setUser(null);
        // Limpiamos todo el rastro de sesión (pero NO localStorage.clear() completo)
        localStorage.removeItem('tsu_user');
        localStorage.removeItem('tsu_token');
        // No limpiamos quiz_answers ni recommendations para mantener experiencia
        window.location.href = '/login';
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
            // ✅ FALBACK: usar plantDatabase como respaldo (del original)
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

    // ========== CARRITO (con validación robusta) ==========
    const normalizePlant = (plant) => ({
        ...plant,
        price: parseFloat(plant?.price) || 0,
    });

    const isValidItem = (item) =>
        item && 
        typeof item === 'object' &&
        item.plant &&
        typeof item.plant === 'object' &&
        item.plant.id !== undefined &&
        !isNaN(parseFloat(item.plant.price)) &&
        typeof item.quantity === 'number';

    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('tsu_cart');
            if (!saved) return [];
            const parsed = JSON.parse(saved);
            if (!Array.isArray(parsed)) {
                localStorage.removeItem('tsu_cart');
                return [];
            }
            // Normalizar y limpiar desde el inicio
            const valid = parsed
                .filter(isValidItem)
                .map(item => ({ ...item, plant: normalizePlant(item.plant) }));
            return valid;
        } catch { 
            localStorage.removeItem('tsu_cart'); 
            return []; 
        }
    });
    
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('tsu_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (plant, qty = 1) => {
        const safePlant = normalizePlant(plant);
        setCart(prev => {
            const clean = prev.filter(isValidItem);
            const existing = clean.find(item => item.plant.id === safePlant.id);
            if (existing) {
                return clean.map(item =>
                    item.plant.id === safePlant.id
                        ? { ...item, quantity: item.quantity + qty }
                        : item
                );
            }
            return [...clean, { plant: safePlant, quantity: qty }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (plantId) => {
        setCart(prev => prev.filter(item => item?.plant?.id !== plantId));
    };

    const updateQty = (plantId, qty) => {
        if (qty <= 0) { 
            removeFromCart(plantId); 
            return; 
        }
        setCart(prev => prev.map(item =>
            item?.plant?.id === plantId ? { ...item, quantity: qty } : item
        ).filter(isValidItem));
    };

    const clearCart = () => setCart([]);

    const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const cartTotal = cart.reduce((sum, item) => sum + (parseFloat(item.plant?.price) || 0) * (item.quantity || 1), 0);

    return (
        <GlobalContext.Provider value={{
            // Auth
            user, 
            isAuthenticated, 
            login, 
            register, 
            logout, 
            updateProfile,
            
            // Posts
            posts, 
            likePost, 
            fetchPosts,
            
            // Mis plantas
            myPlants, 
            adoptPlant, 
            fetchMyPlants,
            
            // Quiz / Diagnóstico
            recommendations, 
            quizAnswers, 
            handleDiagnostic,
            
            // Catálogo
            plantDatabase, 
            fetchPlants,
            
            // Carrito
            cart, 
            addToCart, 
            removeFromCart, 
            updateQty, 
            clearCart,
            cartCount, 
            cartTotal, 
            isCartOpen, 
            setIsCartOpen,
        }}>
            {children}
        </GlobalContext.Provider>
    );
};