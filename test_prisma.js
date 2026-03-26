const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    try {
        console.log('Testing...');
        const posts = await prisma.post.findMany({
            include: {
                author: { select: { id: true, name: true, avatar: true } },
                plant: true,
                likedBy: { select: { id: true } },
                comments: { include: { author: { select: { id: true, name: true, avatar: true } } } }
            },
            orderBy: { createdAt: 'desc' },
        });
        console.log('Result:', posts.length);
    } catch(err) {
        require('fs').writeFileSync('err.txt', err.message);
    } finally {
        await prisma.$disconnect();
    }
}
test();
