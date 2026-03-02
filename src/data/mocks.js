// src/data/mocks.js

// Recomendaciones y Catálogo de Plantas en 3D
export const plantDatabase = [
    {
        id: "monstera",
        name: "Monstera Deliciosa",
        // Reliable public asset
        modelUrl: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Flower/Flower.glb",
        light: ["Media"],
        pets: "No", // Tóxica
        time: ["Lo normal"],
        tag: "🪴 El ícono de internet",
        careGuide: {
            water: "Riega cada 7-10 días, dejando secar el sustrato.",
            light: "Luz indirecta brillante es ideal.",
            humidity: "Le gusta la humedad alta. Pulveriza sus hojas."
        },
        price: 35.00
    },
    {
        id: "zamioculca",
        name: "Zamioculca (ZZ Plant)",
        modelUrl: "https://modelviewer.dev/shared-assets/models/shishkebab.glb",
        light: ["Poca", "Media"],
        pets: "No",
        time: ["Casi nada", "Lo normal", "Experto"],
        tag: "✨ Prácticamente indestructible",
        careGuide: {
            water: "Riega cada 3 semanas. Menos es más.",
            light: "Sobrevive casi donde sea excepto sol directo.",
            humidity: "No requiere atención a la humedad."
        },
        price: 25.00
    },
    {
        id: "helecho",
        name: "Helecho Boston",
        modelUrl: "https://modelviewer.dev/shared-assets/models/IridescentDishWithOlives.glb",
        light: ["Media", "Poca"],
        pets: "Sí",
        time: ["Lo normal", "Experto"],
        tag: "🐾 100% Pet Friendly",
        careGuide: {
            water: "Mantén la tierra siempre ligeramente húmeda.",
            light: "Luz tenue o filtrada.",
            humidity: "Alerta máxima: necesita ambientes muy húmedos."
        },
        price: 18.00
    },
    {
        id: "sansevieria",
        name: "Sansevieria",
        modelUrl: "https://modelviewer.dev/assets/ShopifyModels/Mixer.glb",
        light: ["Poca", "Media", "Sol"],
        pets: "No",
        time: ["Casi nada", "Lo normal", "Experto"],
        tag: "🛡️ Purificadora del hogar",
        careGuide: {
            water: "Riega cada 2-3 semanas.",
            light: "Se adapta desde la sombra hasta el sol.",
            humidity: "Tolera aire seco perfectamente."
        },
        price: 20.00
    },
    {
        id: "calathea",
        name: "Calathea Ornata",
        modelUrl: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Flower/Flower.glb",
        light: ["Media"],
        pets: "Sí", // Pet friendly
        time: ["Experto", "Lo normal"],
        tag: "🎨 Belleza caprichosa",
        careGuide: {
            water: "Mantener sustrato húmedo pero sin encharcar. Usa agua filtrada.",
            light: "Luz media indirecta. Evita el sol a toda costa.",
            humidity: "Muy exigente con la humedad ambiental (60%+)."
        },
        price: 28.00
    }
];

// Usuarios simulados para la red social
export const usersData = [
    { id: "u1", name: "Lucía P.", avatar: "https://i.pravatar.cc/150?u=lucia" },
    { id: "u2", name: "Carlos M.", avatar: "https://i.pravatar.cc/150?u=carlos" },
    { id: "u3", name: "Ana Selva", avatar: "https://i.pravatar.cc/150?u=ana" },
    { id: "u4", name: "PlantDaddy99", avatar: "https://i.pravatar.cc/150?u=daddy" }
];

// Posts para el Feed
export const postsData = [
    {
        id: "p1",
        userId: "u1",
        content: "Mi nueva Monstera sacó su primera hoja fenestrada 🌿 ¡Estoy emocionada! Valió la pena ponerla cerca de la ventana.",
        image: "https://images.unsplash.com/photo-1620127807580-1a1a9e5251c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        likes: 24,
        comments: 5,
        taggedPlantId: "monstera"
    },
    {
        id: "p3",
        userId: "u3",
        content: "Adopté a esta guerrera hoy. Si buscan algo que resista poca luz, la Sansevieria es un 10/10.",
        image: "https://images.unsplash.com/photo-1601985705806-5b9a71f62688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        likes: 89,
        comments: 12,
        taggedPlantId: "sansevieria"
    },
    {
        id: "p2",
        userId: "u2",
        content: "Tips para Helechos: los puse en el baño mientras me ducho por el vapor y parece que les encanta 💧",
        image: "https://images.unsplash.com/photo-1598539958178-5a4cbcf2130c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        likes: 12,
        comments: 2,
        taggedPlantId: "helecho"
    }
];

// Alertas de Riego simuladas
export const notificationsData = [
    { id: "n1", plantId: "monstera", message: "💧 ¡Tu Monstera tiene sed hoy!", type: "water" },
    { id: "n2", plantId: "calathea", message: "🌬️ Tu Calathea necesita mayor humedad.", type: "humidity" }
];
