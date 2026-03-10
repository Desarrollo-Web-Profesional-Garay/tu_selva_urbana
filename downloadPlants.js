const fs = require('fs');
const https = require('https');
const path = require('path');

const OUT_DIR = path.join(__dirname, '../tu-selva-urbana-react/public/plants');
if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
}

// 12 Wikipedia Titles for our plants
const plantsWiki = {
    monstera: 'Monstera_deliciosa',
    zamioculca: 'Zamioculcas',
    helecho: 'Nephrolepis_exaltata',
    sansevieria: 'Dracaena_trifasciata',
    calathea: 'Goeppertia_ornata',
    'ficus-elastica': 'Ficus_elastica',
    pothos: 'Epipremnum_aureum',
    spathiphyllum: 'Spathiphyllum',
    'alocasia-zebrina': 'Alocasia_zebrina',
    pilea: 'Pilea_peperomioides',
    'string-of-pearls': 'Curio_rowleyanus',
    'ficus-lyrata': 'Ficus_lyrata'
};

async function fetchWikiImage(title) {
    return new Promise((resolve, reject) => {
        const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=pageimages&format=json&pithumbsize=1000`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const pages = json.query.pages;
                    const pageId = Object.keys(pages)[0];
                    if (pages[pageId].thumbnail) {
                        resolve(pages[pageId].thumbnail.source);
                    } else {
                        resolve(null);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

function downloadImage(url, destPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destPath);
        https.get(url, (res) => {
            res.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(destPath, () => { });
            reject(err);
        });
    });
}

async function main() {
    const registry = {};

    for (const [slug, title] of Object.entries(plantsWiki)) {
        console.log(`Buscando ${slug}...`);
        try {
            let imgUrl = await fetchWikiImage(title);

            // Fallbacks for missing/bad wiki thumbs
            if (!imgUrl || slug === 'string-of-pearls') {
                if (slug === 'spathiphyllum') imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Spathiphyllum_cochlearispathum_RTBG.jpg/800px-Spathiphyllum_cochlearispathum_RTBG.jpg';
                else if (slug === 'string-of-pearls') imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Curio_rowleyanus_%28String_of_pearls%29.jpg/800px-Curio_rowleyanus_%28String_of_pearls%29.jpg';
                else if (slug === 'calathea') imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Goeppertia_ornata.jpg/800px-Goeppertia_ornata.jpg';
                else if (slug === 'alocasia-zebrina') imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Alocasia_zebrina_00.jpg/800px-Alocasia_zebrina_00.jpg';
            }

            if (imgUrl) {
                const ext = path.extname(imgUrl.split('?')[0]) || '.jpg';
                const dest = path.join(OUT_DIR, `${slug}${ext}`);
                await downloadImage(imgUrl, dest);
                registry[slug] = `/plants/${slug}${ext}`;
                console.log(`✅ Descargada: ${slug} -> ${imgUrl}`);
            } else {
                console.log(`❌ No se encontró imagen para: ${slug}`);
            }
        } catch (e) {
            console.error(`Error en ${slug}:`, e.message);
        }
    }

    fs.writeFileSync(path.join(__dirname, 'plants_registry.json'), JSON.stringify(registry, null, 2));
    console.log('Finalizado.');
}

main();
