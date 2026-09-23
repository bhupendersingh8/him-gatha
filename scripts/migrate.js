import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const legacyDir = path.join(__dirname, '../legacy_v1');
const dataDir = path.join(__dirname, '../src/data');

// Ensure output directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helper to slugify names
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
}

// Parse coordinates from map string (Leaflet iframe url or google maps links)
function parseCoordinates(mapUrl) {
  if (!mapUrl) return { lat: null, lng: null };
  // Extract coordinates from patterns like q=lat,lng or @lat,lng or coordinates in URL
  const coordRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const match = mapUrl.match(coordRegex);
  if (match) {
    return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  }
  
  const queryRegex = /q=(-?\d+\.\d+),(-?\d+\.\d+)/;
  const queryMatch = mapUrl.match(queryRegex);
  if (queryMatch) {
    return { lat: parseFloat(queryMatch[1]), lng: parseFloat(queryMatch[2]) };
  }

  // Fallback coords for districts in HP if found
  return { lat: null, lng: null };
}

// 1. Migrate Deities
function migrateDeities() {
  console.log('Migrating deities...');
  const deitiesPath = path.join(legacyDir, 'kuldev_db.tsv');
  if (!fs.existsSync(deitiesPath)) {
    console.error('deities tsv file not found at:', deitiesPath);
    return;
  }

  const content = fs.readFileSync(deitiesPath, 'utf-8');
  const lines = content.split('\n');
  const deities = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    
    // Split by tab
    const fields = line.split('\t');
    if (fields.length < 5) continue;

    const [
      id,
      name,
      district,
      village,
      history,
      image,
      video,
      map,
      links,
      gurName,
      travelGuide,
      devKhel,
      oracleRecords
    ] = fields;

    // Clean strings (remove carriage returns, trailing/leading spaces)
    const clean = (str) => (str ? str.replace(/\r/g, '').trim() : '');

    const deityId = clean(id);
    const deityName = clean(name);
    const deityDistrict = clean(district);
    const deityVillage = clean(village);
    const deityHistory = clean(history);
    const deityImage = clean(image);
    const deityVideo = clean(video);
    const deityMap = clean(map);
    const deityLinks = clean(links);
    const deityGur = clean(gurName);
    const deityTravel = clean(travelGuide);
    const deityKhel = clean(devKhel);
    const deityOracle = clean(oracleRecords);

    // Skip empty IDs
    if (!deityId) continue;

    // Construct coordinates
    const coords = parseCoordinates(deityMap);

    deities.push({
      id: deityId,
      slug: slugify(deityName) || deityId.toLowerCase(),
      name: deityName,
      district: deityDistrict,
      village: deityVillage,
      state: "Himachal Pradesh",
      category: "deity",
      description: deityHistory,
      images: deityImage ? [deityImage] : [],
      coordinates: coords,
      administrativeFramework: {
        gurName: deityGur,
        kardar: "",
        pujari: "",
        bhandari: "",
        bajantris: "",
        chharidhar: ""
      },
      devKhel: deityKhel,
      oracleRecords: deityOracle,
      travelGuide: deityTravel,
      video: deityVideo,
      map: deityMap,
      links: deityLinks ? deityLinks.split(',').map(l => l.trim()) : [],
      status: "approved",
      submittedBy: "migration-script",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  fs.writeFileSync(
    path.join(dataDir, 'deities.json'),
    JSON.stringify(deities, null, 2),
    'utf-8'
  );
  console.log(`Successfully migrated ${deities.length} deities to deities.json`);
}

// 2. Migrate Events
function migrateEvents() {
  console.log('Migrating events...');
  const eventsPath = path.join(legacyDir, 'events.tsv');
  if (!fs.existsSync(eventsPath)) {
    console.error('events tsv file not found at:', eventsPath);
    return;
  }

  const content = fs.readFileSync(eventsPath, 'utf-8');
  const lines = content.split('\n');
  const events = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    const fields = line.split('\t');
    if (fields.length < 3) continue;

    const [deityId, title, date, description, location, map] = fields;
    const clean = (str) => (str ? str.replace(/\r/g, '').trim() : '');

    events.push({
      deityId: clean(deityId),
      title: clean(title),
      date: clean(date),
      description: clean(description),
      location: clean(location),
      map: clean(map),
      createdAt: new Date().toISOString()
    });
  }

  fs.writeFileSync(
    path.join(dataDir, 'events.json'),
    JSON.stringify(events, null, 2),
    'utf-8'
  );
  console.log(`Successfully migrated ${events.length} events to events.json`);
}

// 3. Migrate Slides
function migrateSlides() {
  console.log('Migrating slides...');
  const slidesPath = path.join(legacyDir, 'hero_slides.tsv');
  if (!fs.existsSync(slidesPath)) {
    console.error('slides tsv file not found at:', slidesPath);
    return;
  }

  const content = fs.readFileSync(slidesPath, 'utf-8');
  const lines = content.split('\n');
  const slides = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    const fields = line.split('\t');
    if (fields.length < 4) continue;

    const [id, title, subtitle, imageUrl, deityId] = fields;
    const clean = (str) => (str ? str.replace(/\r/g, '').trim() : '');

    slides.push({
      id: clean(id),
      title: clean(title),
      subtitle: clean(subtitle),
      imageUrl: clean(imageUrl),
      deityId: clean(deityId)
    });
  }

  fs.writeFileSync(
    path.join(dataDir, 'slides.json'),
    JSON.stringify(slides, null, 2),
    'utf-8'
  );
  console.log(`Successfully migrated ${slides.length} slides to slides.json`);
}

// 4. Migrate Lineages
function migrateLineages() {
  console.log('Migrating lineages...');
  const lineagesPath = path.join(legacyDir, 'lineages.tsv');
  if (!fs.existsSync(lineagesPath)) {
    console.error('lineages tsv file not found at:', lineagesPath);
    return;
  }

  const content = fs.readFileSync(lineagesPath, 'utf-8');
  const lines = content.split('\n');
  const lineages = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    const fields = line.split('\t');
    if (fields.length < 3) continue;

    const [deityId1, deityId2, relationType] = fields;
    const clean = (str) => (str ? str.replace(/\r/g, '').trim() : '');

    lineages.push({
      deityId1: clean(deityId1),
      deityId2: clean(deityId2),
      relationType: clean(relationType)
    });
  }

  fs.writeFileSync(
    path.join(dataDir, 'lineages.json'),
    JSON.stringify(lineages, null, 2),
    'utf-8'
  );
  console.log(`Successfully migrated ${lineages.length} lineages to lineages.json`);
}

// Run all migrations
migrateDeities();
migrateEvents();
migrateSlides();
migrateLineages();

console.log('TSV Migration Completed successfully!');
