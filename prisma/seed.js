const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Sembrando base botánica masiva...');

    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.post.deleteMany();
    await prisma.userPlant.deleteMany();
    await prisma.plant.deleteMany();
    await prisma.user.deleteMany();

    const plantsData = [
        {
            slug: 'monstera',
            name: 'Monstera Deliciosa',
            modelUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Flower/Flower.glb',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Monstera_deliciosa3.jpg/800px-Monstera_deliciosa3.jpg',
            light: ['Media'], petSafe: false, careLevel: 'normal', tag: '🪴 El ícono de internet', price: 35.0,
            careWater: 'Riega cada 7-10 días, dejando secar el sustrato.', careLight: 'Luz indirecta brillante.', careHumidity: 'Le gusta la humedad alta. Pulveriza sus hojas.'
        },
        {
            slug: 'zamioculca',
            name: 'Zamioculca (ZZ Plant)',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Zamioculcas_zamiifolia_1.jpg/800px-Zamioculcas_zamiifolia_1.jpg',
            light: ['Poca', 'Media'], petSafe: false, careLevel: 'facil', tag: '✨ Prácticamente indestructible', price: 25.0,
            careWater: 'Riega cada 3 semanas. Menos es más.', careLight: 'Sobrevive casi donde sea excepto sol directo.', careHumidity: 'No requiere atención.'
        },
        {
            slug: 'helecho',
            name: 'Helecho Boston',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Nephrolepis_exaltata_002.jpg/800px-Nephrolepis_exaltata_002.jpg',
            light: ['Media', 'Poca'], petSafe: true, careLevel: 'experto', tag: '🐾 100% Pet Friendly', price: 18.0,
            careWater: 'Mantén la tierra siempre ligeramente húmeda.', careLight: 'Luz tenue o filtrada.', careHumidity: 'Alerta máxima: necesita ambientes muy húmedos.'
        },
        {
            slug: 'sansevieria',
            name: 'Sansevieria Trifasciata',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Snake_Plant_%28Sansevieria_trifasciata_%27Laurentii%27%29.jpg/800px-Snake_Plant_%28Sansevieria_trifasciata_%27Laurentii%27%29.jpg',
            light: ['Poca', 'Media', 'Sol'], petSafe: false, careLevel: 'facil', tag: '🛡️ Purificadora de aire', price: 20.0,
            careWater: 'Riega cada 3 semanas.', careLight: 'Se adapta desde la sombra hasta el sol.', careHumidity: 'Tolera aire seco perfectamente.'
        },
        {
            slug: 'calathea',
            name: 'Calathea Ornata',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Goeppertia_ornata.jpg/800px-Goeppertia_ornata.jpg',
            light: ['Media'], petSafe: true, careLevel: 'experto', tag: '🎨 Belleza caprichosa', price: 28.0,
            careWater: 'Mantener sustrato húmedo. Usa agua filtrada.', careLight: 'Evita el sol a toda costa.', careHumidity: 'Muy exigente con la humedad ambiental.'
        },
        {
            slug: 'ficus-elastica',
            name: 'Ficus Robusta',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Ficus_elastica_1.jpg/800px-Ficus_elastica_1.jpg',
            light: ['Sol', 'Media'], petSafe: false, careLevel: 'normal', tag: '🌳 Elegancia oscura', price: 40.0,
            careWater: 'Riega cuando los primeros 5cm del sustrato estén secos.', careLight: 'Mucha luz indirecta o sol de la mañana.', careHumidity: 'Humedad media a alta.'
        },
        {
            slug: 'pothos',
            name: 'Pothos Dorado',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Epipremnum_aureum_1.jpg/800px-Epipremnum_aureum_1.jpg',
            light: ['Poca', 'Media'], petSafe: false, careLevel: 'facil', tag: '🌿 Ideal para novatos', price: 15.0,
            careWater: 'Tolera olvidos. Riega cada 1-2 semanas.', careLight: 'Luz indirecta. Puede perder el dorado en sombra extrema.', careHumidity: 'Se adapta a cualquier ambiente.'
        },
        {
            slug: 'spathiphyllum',
            name: 'Cuna de Moisés',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Spathiphyllum_cochlearispathum_RTBG.jpg/800px-Spathiphyllum_cochlearispathum_RTBG.jpg',
            light: ['Poca', 'Media'], petSafe: false, careLevel: 'normal', tag: '🕊️ Flores la mayor parte del año', price: 22.0,
            careWater: 'Acusa falta de agua bajando las hojas. Reanimación rápida.', careLight: 'Luz indirecta media.', careHumidity: 'Humedad alta para evitar puntas marrones.'
        },
        {
            slug: 'alocasia-zebrina',
            name: 'Alocasia Zebrina',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Alocasia_zebrina_00.jpg/800px-Alocasia_zebrina_00.jpg',
            light: ['Media'], petSafe: false, careLevel: 'experto', tag: '🦓 Tallos de cebra exóticos', price: 55.0,
            careWater: 'Prefiere humedad constante, no mojado.', careLight: 'Luz brillante indirecta.', careHumidity: 'Altísima humedad, ideal para invernaderos interiores.'
        },
        {
            slug: 'pilea',
            name: 'Pilea Peperomioides',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Pilea_peperomioides_1.jpg/800px-Pilea_peperomioides_1.jpg',
            light: ['Media'], petSafe: true, careLevel: 'normal', tag: '💰 La planta del dinero china', price: 19.0,
            careWater: 'Dejar secar bien entre riegos para evitar hongos.', careLight: 'Luz indirecta moderada.', careHumidity: 'Humedad media normal de hogar.'
        },
        {
            slug: 'string-of-pearls',
            name: 'Collar de Perlas',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Curio_rowleyanus_%28String_of_pearls%29.jpg/800px-Curio_rowleyanus_%28String_of_pearls%29.jpg',
            light: ['Sol', 'Media'], petSafe: false, careLevel: 'experto', tag: '📿 Suculenta colgante', price: 24.0,
            careWater: 'Como suculenta, muy poca agua. Espera a que las perlas apenas se encojan.', careLight: 'Ponerla justo en una ventana con mucho sol indirecto.', careHumidity: 'Prefiere ambientes secos.'
        },
        {
            slug: 'ficus-lyrata',
            name: 'Ficus Lyrata',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Ficus_lyrata_2.jpg/800px-Ficus_lyrata_2.jpg',
            light: ['Sol', 'Media'], petSafe: false, careLevel: 'normal', tag: '🎻 Hojas gigantes', price: 65.0,
            careWater: 'Humedad consistente. No soporta encharcamiento ni sequía.', careLight: 'Adora el sol indirecto masivo.', careHumidity: 'Limpiar el polvo de sus hojas fomenta su absorción de luz.'
        }
    ];

    const plants = await Promise.all(plantsData.map(p => prisma.plant.create({ data: p })));

    // Usuarios
    const hashedPassword = await bcrypt.hash('123456', 10);
    const users = await Promise.all([
        prisma.user.create({ data: { name: 'Lucía P.', email: 'lucia@demo.com', password: hashedPassword, avatar: 'https://i.pravatar.cc/150?u=lucia' } }),
        prisma.user.create({ data: { name: 'Carlos M.', email: 'carlos@demo.com', password: hashedPassword, avatar: 'https://i.pravatar.cc/150?u=carlos' } }),
        prisma.user.create({ data: { name: 'Ana Selva', email: 'ana@demo.com', password: hashedPassword, avatar: 'https://i.pravatar.cc/150?u=ana' } })
    ]);

    // Posts Demostrativos
    await prisma.post.createMany({
        data: [
            { authorId: users[0].id, content: 'Mi nueva Monstera sacó su primera hoja fenestrada 🌿 ¡Estoy emocionada!', image: plants[0].imageUrl, likes: 24, plantId: plants[0].id },
            { authorId: users[2].id, content: 'Adopté a esta guerrera hoy. La Sansevieria es un 10/10 para poca luz.', image: plants[3].imageUrl, likes: 89, plantId: plants[3].id },
            { authorId: users[1].id, content: 'Tips para Helechos: los puse en el baño mientras me ducho por el vapor 💧', image: plants[2].imageUrl, likes: 12, plantId: plants[2].id },
            { authorId: users[0].id, content: 'Mi Ficus Lyrata esta enorme, ya topó con el techo de la sala.', image: plants[11].imageUrl, likes: 45, plantId: plants[11].id },
            { authorId: users[2].id, content: 'Es difícil mantener feliz a la Alocasia Zebrina, pero lo logré.', image: plants[8].imageUrl, likes: 120, plantId: plants[8].id }
        ],
    });

    console.log('✅ Base botánica expandida exitosamente.');
    console.log(`   ${plants.length} plantas disponibles`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => await prisma.$disconnect());
