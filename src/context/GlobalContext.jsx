import { createContext, useState, useEffect } from 'react';
import { plantDatabase, postsData, usersData } from '../data/mocks';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    // Auth State
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('tsu_user');
        return saved ? JSON.parse(saved) : null;
    });
    const isAuthenticated = !!user;

    useEffect(() => {
        if (user) localStorage.setItem('tsu_user', JSON.stringify(user));
        else localStorage.removeItem('tsu_user');
    }, [user]);

    const login = (email, password) => {
        // Mock: cualquier credencial funciona
        setUser({ name: email.split('@')[0], email, avatar: `https://i.pravatar.cc/150?u=${email}` });
        return true;
    };

    const register = (name, email, password) => {
        setUser({ name, email, avatar: `https://i.pravatar.cc/150?u=${email}` });
        return true;
    };

    const logout = () => setUser(null);

    // Feed Status
    const [posts, setPosts] = useState(postsData);

    // User Profile
    const [myPlants, setMyPlants] = useState(() => {
        return [plantDatabase[1], plantDatabase[3]];
    });

    // Diagnóstico
    const [quizAnswers, setQuizAnswers] = useState(null);
    const [recommendations, setRecommendations] = useState(plantDatabase.slice(0, 3));

    const handleDiagnostic = (answers) => {
        setQuizAnswers(answers);
        const { light, pets, time } = answers;

        let filtered = plantDatabase.filter(plant => {
            const matchLight = plant.light.includes(light);
            const matchPets = pets === 'Sí' ? plant.pets === 'Sí' : true;
            return matchLight && matchPets;
        });

        if (filtered.length === 0) {
            filtered = [plantDatabase.find(p => p.id === 'sansevieria')];
        }

        setRecommendations(filtered.slice(0, 3));
    };

    const adoptPlant = (plant) => {
        if (!myPlants.find(p => p.id === plant.id)) {
            setMyPlants([...myPlants, plant]);
            return true;
        }
        return false;
    };

    const likePost = (postId) => {
        setPosts(posts.map(p => {
            if (p.id === postId) return { ...p, likes: p.likes + 1 };
            return p;
        }));
    };

    const getEnrichedPosts = () => {
        return posts.map(post => {
            const u = usersData.find(u => u.id === post.userId);
            return { ...post, user: u };
        });
    };

    return (
        <GlobalContext.Provider value={{
            // Auth
            user,
            isAuthenticated,
            login,
            register,
            logout,
            // Data
            posts: getEnrichedPosts(),
            myPlants,
            recommendations,
            quizAnswers,
            plantDatabase,
            handleDiagnostic,
            adoptPlant,
            likePost
        }}>
            {children}
        </GlobalContext.Provider>
    );
};
