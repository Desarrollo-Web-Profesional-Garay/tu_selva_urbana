const fs = require('fs');
const https = require('https');
const path = require('path');

const userLinks = {
    'monstera': 'https://unsplash.com/photos/a-beautiful-monstera-deliciosa-plant-with-vibrant-colors-sfxK-xw4bo4',
    'zamioculca': 'https://unsplash.com/photos/a-small-green-plant-in-a-black-pot-7uv8ssFGHqA',
    'helecho': 'https://unsplash.com/photos/photo-of-boston-fern-6gWMviz-vSo',
    'sansevieria': 'https://unsplash.com/photos/green-snake-plant-on-white-ceramic-pot-0pJCjF_fpbM',
    'calathea': 'https://unsplash.com/photos/striking-leaves-of-a-calathea-ornata-plant-0bJxpH-2Cik',
    'ficus-elastica': 'https://unsplash.com/photos/green-leaves-in-white-background-Dze_6fnPIKk',
    'pothos': 'https://unsplash.com/photos/golden-pothos-potted-plant-closeup-photography-ab_Ds2rBqNU',
    'spathiphyllum': 'https://unsplash.com/photos/white-peace-lily-flowers-bloom-beautifully-ECzM_dxryYQ',
    'alocasia-zebrina': 'https://unsplash.com/photos/person-holding-green-plant-on-white-ceramic-pot-xw0iM4t8avQ',
    'pilea': 'https://unsplash.com/photos/person-holding-green-leaf-plant-cG3dFAMfqFM',
    'string-of-pearls': 'https://unsplash.com/photos/a-bunch-of-green-berries-hanging-from-a-tree-r3r76u1HaQw',
    'ficus-lyrata': 'https://unsplash.com/photos/a-close-up-of-a-green-leaf-with-drops-of-water-on-it-8SXaMMWCTGc'
};

async function getMicrolink(url) {
    return new Promise((resolve) => {
        https.get(`https://api.microlink.io?url=${encodeURIComponent(url)}`, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve(parsed.data.image.url);
                } catch(e) { resolve(null); }
            });
        }).on('error', () => resolve(null));
    });
}

async function run() {
    const seedPath = path.join(__dirname, 'prisma', 'seed.js');
    let content = fs.readFileSync(seedPath, 'utf8');

    for (const [slug, rawUrl] of Object.entries(userLinks)) {
        console.log(`Buscando para ${slug}...`);
        const directImageUrl = await getMicrolink(rawUrl);
        if (directImageUrl) {
            console.log("-> Encontrada:", directImageUrl);
            const regex = new RegExp(`(slug:\\s*'${slug}',\\s*[\\s\\S]*?imageUrl:\\s*')[^']+(')`, 'g');
            content = content.replace(regex, `$1${directImageUrl}$2`);
        } else {
            console.log("-> Falló al extraer:", rawUrl);
        }
    }
    fs.writeFileSync(seedPath, content);
    console.log("seed.js successfully completely localized.");
}
run();
