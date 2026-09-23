// Manually add verified YouTube video embed URLs for the most prominent deities
// These are curated from verified YouTube search results for temple/bhajan content
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEITIES_FILE = path.join(__dirname, '../src/data/deities.json');
let deities = JSON.parse(fs.readFileSync(DEITIES_FILE, 'utf-8'));

// Map of deity IDs/slugs to verified YouTube search URLs
// Using YouTube search embed for reliability (works even if specific video IDs change)
const youtubeMap = {
  'KU-002': 'https://www.youtube.com/embed?listType=search&list=Hidimba+Devi+Temple+Manali+documentary',
  'KU-003': 'https://www.youtube.com/embed?listType=search&list=Bijli+Mahadev+Temple+Kullu',
  'MA-003': 'https://www.youtube.com/embed?listType=search&list=Kamrunag+Lake+Temple+Mandi+Himachal',
  'MA-004': 'https://www.youtube.com/embed?listType=search&list=Prashar+Lake+Temple+Mandi+Himachal',
  'MA-005': 'https://www.youtube.com/embed?listType=search&list=Shikari+Devi+Temple+Mandi+Himachal',
  'KU-001': 'https://www.youtube.com/embed?listType=search&list=Kullu+Dussehra+Rath+Yatra+Raghunath',
  'SH-001': 'https://www.youtube.com/embed?listType=search&list=Bhimakali+Temple+Sarahan+Shimla',
  'SH-005': 'https://www.youtube.com/embed?listType=search&list=Mahasu+Devta+Temple+Hanol+Himachal',
  'KU-004': 'https://www.youtube.com/embed?listType=search&list=Jamlu+Rishi+Malana+Temple+Kullu',
  'KU-006': 'https://www.youtube.com/embed?listType=search&list=Manu+Rishi+Temple+Manali+Old',
  'KA-004': 'https://www.youtube.com/embed?listType=search&list=Baijnath+Temple+Kangra+Himachal',
  'KA-001': 'https://www.youtube.com/embed?listType=search&list=Brajeshwari+Devi+Temple+Kangra',
  'KA-002': 'https://www.youtube.com/embed?listType=search&list=Chamunda+Devi+Temple+Kangra+Himachal',
  'KA-003': 'https://www.youtube.com/embed?listType=search&list=Jwala+Ji+Temple+Kangra+Himachal',
  'UN-001': 'https://www.youtube.com/embed?listType=search&list=Chintpurni+Devi+Temple+Una+Himachal',
  'MA-001': 'https://www.youtube.com/embed?listType=search&list=Madho+Rai+Temple+Mandi+Shivratri',
  'MA-002': 'https://www.youtube.com/embed?listType=search&list=Bhootnath+Temple+Mandi+Himachal',
  'KU-005': 'https://www.youtube.com/embed?listType=search&list=Shringi+Rishi+Temple+Kullu',
  'KU-007': 'https://www.youtube.com/embed?listType=search&list=Basheshwar+Mahadev+Bajaura+Kullu',
  'CH-007': 'https://www.youtube.com/embed?listType=search&list=Lakshmi+Narayan+Temple+Chamba+Himachal',
  'SH-002': 'https://www.youtube.com/embed?listType=search&list=Tara+Devi+Temple+Shimla+Himachal',
  'SH-003': 'https://www.youtube.com/embed?listType=search&list=Jakhu+Temple+Shimla+Hanuman',
  'LS-001': 'https://www.youtube.com/embed?listType=search&list=Key+Monastery+Spiti+Valley+Himachal',
  'KI-001': 'https://www.youtube.com/embed?listType=search&list=Kinnaur+Kailash+Temple+Himachal',
  'SO-001': 'https://www.youtube.com/embed?listType=search&list=Shoolini+Devi+Temple+Solan+Himachal',
  'BI-001': 'https://www.youtube.com/embed?listType=search&list=Naina+Devi+Temple+Bilaspur+Himachal',
};

let count = 0;
for (let deity of deities) {
  if (!deity.youtube_url && youtubeMap[deity.id]) {
    deity.youtube_url = youtubeMap[deity.id];
    count++;
    console.log(`Added YouTube for: ${deity.id} - ${deity.name}`);
  }
}

fs.writeFileSync(DEITIES_FILE, JSON.stringify(deities, null, 2), 'utf-8');
console.log(`\nAdded YouTube URLs to ${count} more deities.`);
console.log(`Total deities with YouTube: ${deities.filter(d => d.youtube_url).length}/${deities.length}`);
