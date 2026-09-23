import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEITIES_FILE = path.join(__dirname, '../src/data/deities.json');
let deities = JSON.parse(fs.readFileSync(DEITIES_FILE, 'utf-8'));

function fetchYoutubeVideoId(query) {
    return new Promise((resolve) => {
        const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        const req = https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const match = data.match(/{"videoRenderer":{"videoId":"([^"]+)"/);
                if (match && match[1]) {
                    resolve(match[1]);
                } else {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
}

async function enrichData() {
    let count = 0;
    for (let deity of deities) {
        if (count >= 40) break;

        console.log(`Enriching [${count+1}/40]: ${deity.name}...`);
        
        const queryStr = `${deity.name} ${deity.village || ''} ${deity.district || ''} Himachal Pradesh`;
        deity.google_maps_url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryStr.trim().replace(/\s+/g, ' '))}`;

        if (!deity.youtube_url) {
            const ytQuery = `${deity.name} temple himachal pradesh`;
            const videoId = await fetchYoutubeVideoId(ytQuery);
            if (videoId) {
                deity.youtube_url = `https://www.youtube.com/embed/${videoId}`;
            }
        }

        if (deity.id === 'MA-003' || deity.slug === 'kamrunag-barbarika-rain-god') {
            deity.coordinates = { lat: 31.4530, lng: 77.2050 };
            console.log(`-> Fixed Kamrunag coordinates`);
        }

        if (!deity.imageUrl) {
            deity.imageUrl = (deity.images && deity.images.length > 0) ? deity.images[0] : `/assets/placeholder.jpg`;
        }
        
        count++;
    }

    const specificSlugs = ['bhimakali-sarahan', 'mahasu-devta-hanol', 'hateshwari-mata-hatkoti', 'shri-raghunath-ji-kullu-raghunath'];
    for (let deity of deities) {
        if (specificSlugs.includes(deity.slug) && !deity.google_maps_url) {
            console.log(`Enriching specific deity: ${deity.name}...`);
            const queryStr = `${deity.name} ${deity.village || ''} ${deity.district || ''} Himachal Pradesh`;
            deity.google_maps_url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryStr.trim().replace(/\s+/g, ' '))}`;
            
            const ytQuery = `${deity.name} temple himachal pradesh`;
            const videoId = await fetchYoutubeVideoId(ytQuery);
            if (videoId) {
                deity.youtube_url = `https://www.youtube.com/embed/${videoId}`;
            }
            if (!deity.imageUrl) {
                deity.imageUrl = (deity.images && deity.images.length > 0) ? deity.images[0] : `/assets/placeholder.jpg`;
            }
        }
    }

    fs.writeFileSync(DEITIES_FILE, JSON.stringify(deities, null, 2));
    console.log('Enrichment complete. File updated.');
}

enrichData();
