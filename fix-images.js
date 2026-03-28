const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mapa slug -> ruta local correcta (mismas que seed.js)
const IMAGE_MAP = {
    'monstera':        '/plants/monstera.jpg',
    'zamioculca':      '/plants/zamioculca.jpg',
    'helecho':         '/plants/helecho.jpg',
    'sansevieria':     '/plants/sansevieria.jpg',
    'calathea':        '/plants/calathea.jpg',
    'ficus-elastica':  '/plants/ficus-elastica.jpg',
    'pothos':          '/plants/pothos.jpg',
    'spathiphyllum':   '/plants/spathiphyllum.jpg',
    'alocasia-zebrina':'/plants/alocasia-zebrina.jpg',
    'pilea':           '/plants/pilea.jpg',
    'string-of-pearls':'/plants/string-of-pearls.jpg',
    'ficus-lyrata':    '/plants/ficus-lyrata.jpg',
};

async function fixAllImages() {
    console.log('🔧 Forzando URLs locales para TODAS las plantas...');
    
    const plants = await prisma.plant.findMany();
    let updated = 0;

    for (const plant of plants) {
        const correctUrl = IMAGE_MAP[plant.slug];
        if (correctUrl && plant.imageUrl !== correctUrl) {
            await prisma.plant.update({
                where: { id: plant.id },
                data: { imageUrl: correctUrl }
            });
            console.log(`  ✅ ${plant.name}: ${plant.imageUrl} → ${correctUrl}`);
            updated++;
        }
    }

    // Ahora sincronizar posts: tomar la imageUrl de su planta asociada
    const posts = await prisma.post.findMany({ include: { plant: true } });
    let postsUpdated = 0;
    for (const post of posts) {
        if (post.plant && post.plant.imageUrl && post.image !== post.plant.imageUrl) {
            await prisma.post.update({
                where: { id: post.id },
                data: { image: post.plant.imageUrl }
            });
            postsUpdated++;
        }
    }

    console.log(`\n🌿 Resultado: ${updated} plantas y ${postsUpdated} posts actualizados con URLs locales.`);
}

fixAllImages()
    .catch(e => { console.error('❌ Error:', e); process.exit(1); })
    .finally(() => prisma.$disconnect());
