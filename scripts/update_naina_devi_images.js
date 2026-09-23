import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEITIES_FILE = path.join(__dirname, '../src/data/deities.json');
let deities = JSON.parse(fs.readFileSync(DEITIES_FILE, 'utf-8'));

let updatedCount = 0;
for (let deity of deities) {
  if (deity.id === 'BI-001' || deity.id === 'BL-001' || deity.slug === 'maa-naina-devi' || deity.slug === 'naina-devi') {
    deity.imageUrl = '/assets/naina_devi_idol_1.jpg';
    deity.images = ['/assets/naina_devi_idol_1.jpg', '/assets/naina_devi_temple_2.jpg'];
    updatedCount++;
    console.log(`Updated images for ${deity.id} - ${deity.name}!`);
  }
}

fs.writeFileSync(DEITIES_FILE, JSON.stringify(deities, null, 2), 'utf-8');
console.log(`Successfully updated ${updatedCount} Naina Devi entries in deities.json`);
