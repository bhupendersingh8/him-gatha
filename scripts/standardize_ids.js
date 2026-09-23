import fs from 'fs';

const idMap = {
  "SHM05": "SH-005",
  "SHM06": "SH-006",
  "SHM07": "SH-007",
  "SHM08": "SH-008",
  "SHM11": "SH-011",
  "SHM02": "SH-002",
  "SHM04": "SH-001",
  "SIR04": "SI-004",
  "SIR02": "SI-002",
  "SIR03": "SI-003",
  "MND03": "MA-003",
  "MND05": "MA-005",
  "MND08": "MA-008",
  "KLU01": "KU-001",
  "KLU02": "KU-002",
  "KLU04": "KU-004",
  "KLU06": "KU-006",
  "CHM02": "CH-003",
  "KNG04": "KA-004",
  "KNG01": "KA-004",
  "BLP01": "BL-001",
  "UNA01": "UN-001"
};

// 1. Standardize events.json
const eventsPath = 'src/data/events.json';
const events = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));
const updatedEvents = events.map(e => {
  if (idMap[e.deityId]) {
    e.deityId = idMap[e.deityId];
  }
  return e;
});
fs.writeFileSync(eventsPath, JSON.stringify(updatedEvents, null, 2), 'utf8');
console.log("Standardized events.json");

// 2. Standardize lineages.json
const lineagesPath = 'src/data/lineages.json';
const lineages = JSON.parse(fs.readFileSync(lineagesPath, 'utf8'));
const updatedLineages = lineages.map(l => {
  if (idMap[l.deityId1]) l.deityId1 = idMap[l.deityId1];
  if (idMap[l.deityId2]) l.deityId2 = idMap[l.deityId2];
  return l;
});
fs.writeFileSync(lineagesPath, JSON.stringify(updatedLineages, null, 2), 'utf8');
console.log("Standardized lineages.json");

// 3. Standardize slides.json
const slidesPath = 'src/data/slides.json';
if (fs.existsSync(slidesPath)) {
  const slides = JSON.parse(fs.readFileSync(slidesPath, 'utf8'));
  const updatedSlides = slides.map(s => {
    if (idMap[s.deityId]) s.deityId = idMap[s.deityId];
    return s;
  });
  fs.writeFileSync(slidesPath, JSON.stringify(updatedSlides, null, 2), 'utf8');
  console.log("Standardized slides.json");
}

// 4. Clean up deities.json duplicates (remove old compressed ID copies if standard ID copies exist)
const deitiesPath = 'src/data/deities.json';
const deities = JSON.parse(fs.readFileSync(deitiesPath, 'utf8'));

// Build a set of all standard IDs that exist in the database
const existingStandardIds = new Set(deities.map(d => d.id));

// Filter out old IDs if their standardized equivalents exist
const cleanedDeities = deities.filter(d => {
  const mappedId = idMap[d.id];
  if (mappedId && existingStandardIds.has(mappedId)) {
    // There is a duplicate under the standard ID! Remove this old record.
    console.log(`Removing duplicate deity record: ${d.id} (${d.name}) in favor of ${mappedId}`);
    return false;
  }
  
  // If this deity uses an old ID but NO standard ID copy exists yet, rename its ID to the standard format.
  if (mappedId && !existingStandardIds.has(mappedId)) {
    console.log(`Renaming deity ID: ${d.id} -> ${mappedId} for ${d.name}`);
    d.id = mappedId;
  }
  
  return true;
});

fs.writeFileSync(deitiesPath, JSON.stringify(cleanedDeities, null, 2), 'utf8');
console.log(`Cleaned deities.json (Final size: ${cleanedDeities.length} deities)`);
