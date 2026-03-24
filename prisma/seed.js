const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Sembrando datos iniciales...');

    // Limpiar tablas existentes
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.post.deleteMany();
    await prisma.userPlant.deleteMany();
    await prisma.plant.deleteMany();
    await prisma.user.deleteMany();

    // --- PLANTAS ---
    const plants = await Promise.all([
        prisma.plant.create({
            data: {
                slug: 'monstera',
                name: 'Monstera Deliciosa',
                modelUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Flower/Flower.glb',
                imageUrl: 'https://images.unsplash.com/photo-1620127807580-1a1a9e5251c5?w=800',
                light: ['Media'],
                petSafe: false,
                careLevel: 'normal',
                tag: '🪴 El ícono de internet',
                price: 35.0,
                careWater: 'Riega cada 7-10 días, dejando secar el sustrato.',
                careLight: 'Luz indirecta brillante es ideal.',
                careHumidity: 'Le gusta la humedad alta. Pulveriza sus hojas.',
            },
        }),
        prisma.plant.create({
            data: {
                slug: 'zamioculca',
                name: 'Zamioculca (ZZ Plant)',
                imageUrl: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=800',
                light: ['Poca', 'Media'],
                petSafe: false,
                careLevel: 'facil',
                tag: '✨ Prácticamente indestructible',
                price: 25.0,
                careWater: 'Riega cada 3 semanas. Menos es más.',
                careLight: 'Sobrevive casi donde sea excepto sol directo.',
                careHumidity: 'No requiere atención a la humedad.',
            },
        }),
        prisma.plant.create({
            data: {
                slug: 'helecho',
                name: 'Helecho Boston',
                imageUrl: 'https://images.unsplash.com/photo-1598539958178-5a4cbcf2130c?w=800',
                light: ['Media', 'Poca'],
                petSafe: true,
                careLevel: 'experto',
                tag: '🐾 100% Pet Friendly',
                price: 18.0,
                careWater: 'Mantén la tierra siempre ligeramente húmeda.',
                careLight: 'Luz tenue o filtrada.',
                careHumidity: 'Alerta máxima: necesita ambientes muy húmedos.',
            },
        }),
        prisma.plant.create({
            data: {
                slug: 'sansevieria',
                name: 'Sansevieria',
                imageUrl: 'https://images.unsplash.com/photo-1601985705806-5b9a71f62688?w=800',
                light: ['Poca', 'Media', 'Sol'],
                petSafe: false,
                careLevel: 'facil',
                tag: '🛡️ Purificadora del hogar',
                price: 20.0,
                careWater: 'Riega cada 2-3 semanas.',
                careLight: 'Se adapta desde la sombra hasta el sol.',
                careHumidity: 'Tolera aire seco perfectamente.',
            },
        }),
        prisma.plant.create({
            data: {
                slug: 'calathea',
                name: 'Calathea Ornata',
                imageUrl: 'https://images.unsplash.com/photo-1637967886160-fd7831d25e63?w=800',
                light: ['Media'],
                petSafe: true,
                careLevel: 'experto',
                tag: '🎨 Belleza caprichosa',
                price: 28.0,
                careWater: 'Mantener sustrato húmedo pero sin encharcar. Usa agua filtrada.',
                careLight: 'Luz media indirecta. Evita el sol a toda costa.',
                careHumidity: 'Muy exigente con la humedad ambiental (60%+).',
            },
        }),
    ]);

    // --- USUARIOS DEMO ---
    const hashedPassword = await bcrypt.hash('123456', 10);
    const users = await Promise.all([
        prisma.user.create({
            data: {
                name: 'Lucía P.',
                email: 'lucia@demo.com',
                password: hashedPassword,
                avatar: 'https://i.pravatar.cc/150?u=lucia',
            },
        }),
        prisma.user.create({
            data: {
                name: 'Carlos M.',
                email: 'carlos@demo.com',
                password: hashedPassword,
                avatar: 'https://i.pravatar.cc/150?u=carlos',
            },
        }),
        prisma.user.create({
            data: {
                name: 'Ana Selva',
                email: 'ana@demo.com',
                password: hashedPassword,
                avatar: 'https://i.pravatar.cc/150?u=ana',
            },
        }),
    ]);

    // --- PLANTAS ADOPTADAS ---
    await prisma.userPlant.createMany({
        data: [
            { userId: users[0].id, plantId: plants[0].id },
            { userId: users[0].id, plantId: plants[2].id },
            { userId: users[1].id, plantId: plants[3].id },
        ],
    });

    // --- POSTS ---
    await prisma.post.createMany({
        data: [
            {
                authorId: users[0].id,
                content: 'Mi nueva Monstera sacó su primera hoja fenestrada 🌿 ¡Estoy emocionada!',
                image: 'https://images.unsplash.com/photo-1620127807580-1a1a9e5251c5?w=800',
                likes: 24,
                plantId: plants[0].id,
            },
            {
                authorId: users[2].id,
                content: 'Adopté a esta guerrera hoy. La Sansevieria es un 10/10 para poca luz.',
                image: 'https://images.unsplash.com/photo-1601985705806-5b9a71f62688?w=800',
                likes: 89,
                plantId: plants[3].id,
            },
            {
                authorId: users[1].id,
                content: 'Tips para Helechos: los puse en el baño mientras me ducho por el vapor 💧',
                image: 'https://images.unsplash.com/photo-1598539958178-5a4cbcf2130c?w=800',
                likes: 12,
                plantId: plants[2].id,
            },
        ],
    });

    // --- ORDEN DE EJEMPLO ---
    const order = await prisma.order.create({
        data: {
            userId: users[0].id,
            total: 53.0,
            status: 'entregado',
            items: {
                create: [
                    { plantId: plants[0].id, quantity: 1, price: 35.0 },
                    { plantId: plants[2].id, quantity: 1, price: 18.0 },
                ],
            },
        },
    });

    console.log('✅ Seed completado:');
    console.log(`   ${plants.length} plantas`);
    console.log(`   ${users.length} usuarios (contraseña: 123456)`);
    console.log(`   3 posts, 3 adopciones, 1 orden`);
}

main()
    .catch((e) => {
        console.error('❌ Error en seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
