// Script to add google_maps_url to ALL deities that don't have one yet
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEITIES_FILE = path.join(__dirname, '../src/data/deities.json');
let deities = JSON.parse(fs.readFileSync(DEITIES_FILE, 'utf-8'));

let addedCount = 0;
for (let deity of deities) {
  if (!deity.google_maps_url) {
    const queryStr = `${deity.name} ${deity.village || ''} ${deity.district || ''} Himachal Pradesh`;
    deity.google_maps_url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryStr.trim().replace(/\s+/g, ' '))}`;
    addedCount++;
  }
}

fs.writeFileSync(DEITIES_FILE, JSON.stringify(deities, null, 2), 'utf-8');
console.log(`Added google_maps_url to ${addedCount} more deities.`);
console.log(`Total deities with google_maps_url: ${deities.filter(d => d.google_maps_url).length}/${deities.length}`);
