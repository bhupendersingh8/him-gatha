// Script to remove repetitive fallback images and keep images ONLY for deities with authentic unique photos.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEITIES_FILE = path.join(__dirname, '../src/data/deities.json');
let deities = JSON.parse(fs.readFileSync(DEITIES_FILE, 'utf-8'));

// Strict list of authentic unique images matching exact deities
const authenticDeityImages = {
  // Hidimba Devi
  'KU-002': '/assets/media__1785481981665.jpg',
  'devi-hidimba-mata-hadimba': '/assets/media__1785481981665.jpg',
  
  // Shikari Devi
  'MA-005': '/assets/media__1785481969984.jpg',
  'shikari-devi': '/assets/media__1785481969984.jpg',
  
  // Shri Naag Chawasi Sidh Ji
  'MA-007': '/assets/media__1785480627833.jpg',
  'shri-naag-chawasi-sidh-ji': '/assets/media__1785480627833.jpg',
  
  // Lakshana Devi
  'CH-001': '/assets/lakshana_devi.jpg',
  'shri-lakshana-devi-lakhna-devi': '/assets/lakshana_devi.jpg',

  // Distinct Unsplash images for specific major temples
  'MA-004': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80', // Prashar Lake
  'KA-004': 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80', // Baijnath Shiva
  'KU-003': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80', // Bijli Mahadev
  'SH-001': 'https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=800&q=80', // Bhimakali Sarahan
  'UN-001': 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80', // Chintpurni
  'MA-003': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', // Kamrunag
};

let keptCount = 0;
let removedCount = 0;

for (let deity of deities) {
  const authenticImg = authenticDeityImages[deity.id] || authenticDeityImages[deity.slug];
  
  if (authenticImg) {
    deity.imageUrl = authenticImg;
    deity.images = [authenticImg];
    keptCount++;
  } else {
    delete deity.imageUrl;
    deity.images = [];
    removedCount++;
  }
}

fs.writeFileSync(DEITIES_FILE, JSON.stringify(deities, null, 2), 'utf-8');
console.log(`Kept authentic images for ${keptCount} deities.`);
console.log(`Removed duplicate images from ${removedCount} deities (will show elegant gold emblem placeholder).`);
