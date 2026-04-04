const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function revertUrls() {
    console.log('🔙 Revirtiendo URLs a relativas...');
    try {
        const plants = await prisma.plant.findMany();
        for (const p of plants) {
            if (p.imageUrl && p.imageUrl.includes('/main/public')) {
                const relativeUrl = p.imageUrl.split('/main/public')[1];
                await prisma.plant.update({ where: { id: p.id }, data: { imageUrl: relativeUrl } });
            }
        }
        const posts = await prisma.post.findMany();
        for (const p of posts) {
            if (p.image && p.image.includes('/main/public')) {
                const relativeUrl = p.image.split('/main/public')[1];
                await prisma.post.update({ where: { id: p.id }, data: { image: relativeUrl } });
            }
        }
        console.log('✅ Base de datos restaurada completamente a formato local.');
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
revertUrls();
