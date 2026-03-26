const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CDN_BASE = 'https://raw.githubusercontent.com/Desarrollo-Web-Profesional-Garay/tu_selva_urbana/main/public';

async function forceCDN() {
    console.log('🌍 Modificando rutas relativas a absolutas (GitHub CDN)...');
    try {
        // 1. Plantas
        const plants = await prisma.plant.findMany();
        for (const p of plants) {
            if (p.imageUrl && p.imageUrl.startsWith('/plants/')) {
                const absoluteUrl = `${CDN_BASE}${p.imageUrl}`;
                await prisma.plant.update({
                    where: { id: p.id },
                    data: { imageUrl: absoluteUrl }
                });
            }
        }
        console.log(`✅ ${plants.length} plantas actualizadas con URLs absolutas.`);

        // 2. Posts
        const posts = await prisma.post.findMany();
        for (const p of posts) {
            if (p.image && p.image.startsWith('/plants/')) {
                const absoluteUrl = `${CDN_BASE}${p.image}`;
                await prisma.post.update({
                    where: { id: p.id },
                    data: { image: absoluteUrl }
                });
            }
        }
        console.log(`✅ ${posts.length} posts actualizados con URLs absolutas.`);

    } catch (err) {
        console.error('❌ Error forzando CDN:', err);
    } finally {
        await prisma.$disconnect();
    }
}

forceCDN();
