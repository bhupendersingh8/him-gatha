import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEITIES_FILE = path.join(__dirname, '../src/data/deities.json');
let deities = JSON.parse(fs.readFileSync(DEITIES_FILE, 'utf-8'));

for (let deity of deities) {
  if (deity.id === 'CH-002' || deity.slug === 'shakti-devi-chhatrari') {
    deity.imageUrl = '/assets/shakti_devi_idol_2.jpg';
    deity.images = ['/assets/shakti_devi_idol_2.jpg', '/assets/shakti_devi_courtyard_1.jpg'];
    console.log('Updated CH-002 Shakti Devi Chhatrari with real photos!');
  }

  if (deity.id === 'CH-003' || deity.slug === 'shri-manimahesh-chamba-kailash') {
    deity.imageUrl = '/assets/manimahesh_kailash_2.jpg';
    deity.images = ['/assets/manimahesh_kailash_2.jpg', '/assets/manimahesh_lake_1.jpg'];
    console.log('Updated CH-003 Shri Manimahesh Chamba Kailash with real photos!');
  }
}

fs.writeFileSync(DEITIES_FILE, JSON.stringify(deities, null, 2), 'utf-8');
