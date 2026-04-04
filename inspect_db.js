const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const plants = await prisma.plant.findMany({ select: { id: true, name: true, imageUrl: true } });
    const lines = ["=== URLs DE PLANTAS ==="];
    plants.forEach(p => lines.push(`${p.name}: [${p.imageUrl}]`));
    
    const posts = await prisma.post.findMany({ select: { id: true, image: true } });
    lines.push("\n=== URLs DE POSTS ===");
    posts.forEach(p => lines.push(`Post ${p.id}: [${p.image}]`));
    
    require('fs').writeFileSync('url_report.txt', lines.join('\n'));
    console.log('Reporte escrito en url_report.txt');
}

main().catch(console.error).finally(() => prisma.$disconnect());
