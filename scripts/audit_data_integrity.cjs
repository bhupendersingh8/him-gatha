const fs = require('fs');

const deities = JSON.parse(fs.readFileSync('src/data/deities.json', 'utf8'));
const events = JSON.parse(fs.readFileSync('src/data/events.json', 'utf8'));
const lineages = JSON.parse(fs.readFileSync('src/data/lineages.json', 'utf8'));
const atlas = JSON.parse(fs.readFileSync('src/data/himachal.json', 'utf8'));

const HP_DISTRICTS = new Set([
  'Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur',
  'Kullu', 'Lahaul and Spiti', 'Lahaul & Spiti', 'Mandi',
  'Shimla', 'Sirmaur', 'Solan', 'Una'
]);

console.log('=== DATA INTEGRITY REPORT ===');
console.log('Total Deities:', deities.length);

const ids = new Set();
const duplicateIds = [];
const slugs = new Set();
const duplicateSlugs = [];
let missingName = 0;
let missingDistrict = 0;
let invalidDistrict = [];
let withCoords = 0;
let withoutCoords = 0;
let outOfBoundsCoords = 0;

deities.forEach(d => {
  if (ids.has(d.id)) duplicateIds.push(d.id);
  ids.add(d.id);

  if (d.slug) {
    if (slugs.has(d.slug)) duplicateSlugs.push(d.slug);
    slugs.add(d.slug);
  }

  if (!d.name || d.name.trim() === '') missingName++;
  if (!d.district || d.district.trim() === '') {
    missingDistrict++;
  } else if (!HP_DISTRICTS.has(d.district.trim())) {
    invalidDistrict.push({ id: d.id, district: d.district });
  }

  if (d.coordinates && typeof d.coordinates.lat === 'number' && typeof d.coordinates.lng === 'number') {
    withCoords++;
    const { lat, lng } = d.coordinates;
    if (lat < 30.2 || lat > 33.3 || lng < 75.5 || lng > 79.1) {
      outOfBoundsCoords++;
    }
  } else {
    withoutCoords++;
  }
});

console.log('Duplicate IDs:', duplicateIds.length, duplicateIds);
console.log('Duplicate Slugs:', duplicateSlugs.length, duplicateSlugs);
console.log('Missing Names:', missingName);
console.log('Missing Districts:', missingDistrict);
console.log('Invalid Districts:', invalidDistrict.length, invalidDistrict);
console.log('Deities with valid coords:', withCoords);
console.log('Deities without coords:', withoutCoords);
console.log('Out of bounds coords:', outOfBoundsCoords);

console.log('\nTotal Events:', events.length);
let brokenEvents = 0;
events.forEach(e => {
  if (!ids.has(e.deityId)) {
    console.log('Broken event link:', e.id, '-> deityId:', e.deityId);
    brokenEvents++;
  }
});
console.log('Broken Event Deity Links:', brokenEvents);

console.log('\nTotal Lineages:', lineages.length);
let brokenLineages = 0;
lineages.forEach(l => {
  if (!ids.has(l.deityId1)) {
    console.log('Broken lineage deityId1:', l.id, '->', l.deityId1);
    brokenLineages++;
  }
  if (!ids.has(l.deityId2)) {
    console.log('Broken lineage deityId2:', l.id, '->', l.deityId2);
    brokenLineages++;
  }
});
console.log('Broken Lineage Deity Links:', brokenLineages);

console.log('\nAtlas Districts:', atlas.features ? atlas.features.length : 'N/A');
