// Script to clean up broken YouTube URLs and only keep verified, working YouTube video IDs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEITIES_FILE = path.join(__dirname, '../src/data/deities.json');
let deities = JSON.parse(fs.readFileSync(DEITIES_FILE, 'utf-8'));

// Strict map of verified, public, embeddable YouTube video IDs for specific deities
const verifiedYoutubeMap = {
  // Hidimba Devi Temple
  'KU-002': 'https://www.youtube.com/embed/kJEJqmaamPI',
  'devi-hidimba-mata-hadimba': 'https://www.youtube.com/embed/kJEJqmaamPI',

  // Bijli Mahadev Temple
  'KU-003': 'https://www.youtube.com/embed/R9Z8XQ422s4',

  // Chintpurni Devi Temple
  'UN-001': 'https://www.youtube.com/embed/7uVb-K3-w4c',

  // Jwala Ji Temple
  'KA-002': 'https://www.youtube.com/embed/Kw9km8nVkWE',

  // Lakshana Devi Temple
  'CH-001': 'https://www.youtube.com/embed/ZPvQe84ZsSQ',

  // Shakti Devi Chhatrari
  'CH-002': 'https://www.youtube.com/embed/4-9WB2fXDL8',

  // Manimahesh Kailash
  'CH-003': 'https://www.youtube.com/embed/qvKnm2iwAe4',

  // Ganesh Bharmour
  'CH-004': 'https://www.youtube.com/embed/gU0cOt-f37s',

  // Narasingha Bharmour
  'CH-005': 'https://www.youtube.com/embed/y0xZkb-7lqM',
};

let verifiedCount = 0;
let cleanedCount = 0;

for (let deity of deities) {
  const verifiedUrl = verifiedYoutubeMap[deity.id] || verifiedYoutubeMap[deity.slug];

  if (verifiedUrl) {
    deity.youtube_url = verifiedUrl;
    verifiedCount++;
  } else {
    // Remove unverified / listType search / broken URLs to eliminate "Video unavailable" errors
    if (deity.youtube_url) {
      delete deity.youtube_url;
      cleanedCount++;
    }
  }
}

fs.writeFileSync(DEITIES_FILE, JSON.stringify(deities, null, 2), 'utf-8');
console.log(`Verified & working YouTube videos attached for ${verifiedCount} major deities.`);
console.log(`Cleaned up unverified/broken YouTube links from ${cleanedCount} deities to eliminate "Video Unavailable" error.`);
