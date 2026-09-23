// Script to fix deity images across deities.json
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEITIES_FILE = path.join(__dirname, '../src/data/deities.json');
let deities = JSON.parse(fs.readFileSync(DEITIES_FILE, 'utf-8'));

// Curated high quality image map for major deities
const specificImages = {
  'KU-002': '/assets/media__1785481981665.jpg', // Hidimba Devi
  'devi-hidimba-mata-hadimba': '/assets/media__1785481981665.jpg',
  'MA-005': '/assets/media__1785481969984.jpg', // Shikari Devi
  'shikari-devi': '/assets/media__1785481969984.jpg',
  'MA-007': '/assets/media__1785480627833.jpg', // Naag Chawasi
  'shri-naag-chawasi-sidh-ji': '/assets/media__1785480627833.jpg',
  'CH-001': '/assets/lakshana_devi.jpg', // Lakshana Devi
  'shri-lakshana-devi-lakhna-devi': '/assets/lakshana_devi.jpg',
  'MA-004': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80', // Prashar Lake
  'KA-004': 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80', // Baijnath
  'KU-003': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80', // Bijli Mahadev
  'SH-001': 'https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=800&q=80', // Bhimakali
  'UN-001': 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80', // Chintpurni
  'MA-003': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', // Kamrunag
};

// District default images using real assets
const districtDefaults = {
  'Kullu': '/assets/media__1785481981665.jpg',
  'Mandi': '/assets/media__1785481969984.jpg',
  'Chamba': '/assets/lakshana_devi.jpg',
  'Shimla': '/assets/media__1785481976091.jpg',
  'Kangra': '/assets/media__1785480599353.jpg',
  'Lahaul & Spiti': '/assets/media__1785480599353.jpg',
  'Kinnaur': '/assets/media__1785480599353.jpg',
  'Sirmaur': '/assets/media__1785480627833.jpg',
  'Solan': '/assets/media__1785481976091.jpg',
  'Una': '/assets/media__1785480599353.jpg',
  'Bilaspur': '/assets/media__1785480599353.jpg',
  'Hamirpur': '/assets/media__1785480599353.jpg',
};

let updatedCount = 0;

for (let deity of deities) {
  // Check if deity matches specific curated images
  if (specificImages[deity.id] || specificImages[deity.slug]) {
    const img = specificImages[deity.id] || specificImages[deity.slug];
    deity.imageUrl = img;
    deity.images = [img];
    updatedCount++;
    continue;
  }

  // Clean up invalid placeholder paths
  if (deity.imageUrl === '/assets/placeholder.jpg') {
    delete deity.imageUrl;
  }
  if (Array.isArray(deity.images)) {
    deity.images = deity.images.filter(img => img && img !== 'temple.png' && img !== '/assets/placeholder.jpg');
  }

  // Assign district default image if no valid image exists
  if (!deity.imageUrl && (!deity.images || deity.images.length === 0)) {
    const distImg = districtDefaults[deity.district] || '/assets/media__1785480599353.jpg';
    deity.imageUrl = distImg;
    deity.images = [distImg];
    updatedCount++;
  }
}

fs.writeFileSync(DEITIES_FILE, JSON.stringify(deities, null, 2), 'utf-8');
console.log(`Updated images for ${updatedCount} deities.`);
