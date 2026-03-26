const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixImages() {
    console.log('🔍 Sincronizando imágenes de Posts con las de sus Plantas en Producción...');
    try {
        const posts = await prisma.post.findMany({
            include: { plant: true }
        });

        let updated = 0;
        for (const post of posts) {
            // Check if the plant has a valid image and the post image is different or broken
            if (post.plant && post.plant.imageUrl) {
                await prisma.post.update({
                    where: { id: post.id },
                    data: { image: post.plant.imageUrl }
                });
                updated++;
            }
        }
        console.log(`✅ Sincronización completada. ${updated} posts actualizados con los nombres de archivo correctos.`);
    } catch (err) {
        console.error('❌ Error en el script de limpieza:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

fixImages();
