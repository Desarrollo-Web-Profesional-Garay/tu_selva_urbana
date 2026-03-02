import { createContext, useState, useEffect } from 'react';
import { plantDatabase, postsData, usersData } from '../data/mocks';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    // Feed Status
    const [posts, setPosts] = useState(postsData);

    // User Profile
    const [myPlants, setMyPlants] = useState(() => {
        // Para simplificar el prototipo, empezamos con una planta por defecto
        return [plantDatabase[1], plantDatabase[3]];
    });

    // Diagnóstico
    const [quizAnswers, setQuizAnswers] = useState(null);
    const [recommendations, setRecommendations] = useState(plantDatabase.slice(0, 3)); // 3 Plantas default

    const handleDiagnostic = (answers) => {
        setQuizAnswers(answers);
        const { light, pets, time } = answers;

        // Filtro simple (En un entorno real sería un engine algorítmico)
        let filtered = plantDatabase.filter(plant => {
            const matchLight = plant.light.includes(light);
            const matchPets = pets === 'Sí' ? plant.pets === 'Sí' : true;

            return matchLight && matchPets;
        });

        if (filtered.length === 0) {
            // Fallback friendly
            filtered = [plantDatabase.find(p => p.id === 'sansevieria')];
        }

        // Devolvemos máximo 3
        setRecommendations(filtered.slice(0, 3));
    };

    const adoptPlant = (plant) => {
        if (!myPlants.find(p => p.id === plant.id)) {
            setMyPlants([...myPlants, plant]);
            return true; // Success
        }
        return false; // Ya la tiene
    };

    const likePost = (postId) => {
        setPosts(posts.map(p => {
            if (p.id === postId) return { ...p, likes: p.likes + 1 };
            return p;
        }));
    };

    // Helper para enriquecer posts con el usuario correcto
    const getEnrichedPosts = () => {
        return posts.map(post => {
            const user = usersData.find(u => u.id === post.userId);
            return { ...post, user };
        });
    };

    return (
        <GlobalContext.Provider value={{
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
