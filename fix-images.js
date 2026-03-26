const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixImages() {
    console.log('🔍 Buscando imágenes de Unsplash rotas en Producción...');
    try {
        const posts = await prisma.post.findMany({
            where: {
                image: {
                    contains: 'unsplash'
                }
            }
        });

        if (posts.length > 0) {
            console.log(`🛠️ Reemplazando ${posts.length} posts rotos con activos locales...`);
            
            // Reemplazos variados para no hacer todo igual
            const validImages = [
                '/plants/monstera.jpg',
                '/plants/ficus-elastica.jpg',
                '/plants/helecho.jpg',
                '/plants/sansevieria.jpg'
            ];

            for (let i = 0; i < posts.length; i++) {
                await prisma.post.update({
                    where: { id: posts[i].id },
                    data: {
                        image: validImages[i % validImages.length]
                    }
                });
            }
            console.log('✅ Reemplazo masivo completado.');
        } else {
            console.log('✨ No se encontraron imágenes rotas.');
        }
    } catch (err) {
        console.error('❌ Error en el script de limpieza:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

fixImages();
