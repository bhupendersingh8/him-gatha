import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workspace = path.join(__dirname, '..');
console.log('--- Codebase Integrity Check ---');

// 1. Check deities.json
const deitiesFile = path.join(workspace, 'src/data/deities.json');
try {
  const deities = JSON.parse(fs.readFileSync(deitiesFile, 'utf-8'));
  console.log(`✓ deities.json: Valid JSON (${deities.length} entries)`);
  
  let missingId = 0, missingName = 0, missingDistrict = 0;
  deities.forEach((d, i) => {
    if (!d.id) missingId++;
    if (!d.name) missingName++;
    if (!d.district) missingDistrict++;
  });
  console.log(`  - Missing IDs: ${missingId}, Missing Names: ${missingName}, Missing Districts: ${missingDistrict}`);
} catch (err) {
  console.error(`✗ deities.json Error:`, err.message);
}

// 2. Check events.json
const eventsFile = path.join(workspace, 'src/data/events.json');
try {
  const events = JSON.parse(fs.readFileSync(eventsFile, 'utf-8'));
  console.log(`✓ events.json: Valid JSON (${events.length} entries)`);
  
  let missingDeityId = 0;
  events.forEach((ev) => {
    if (!ev.deityId) missingDeityId++;
  });
  console.log(`  - Events missing deityId: ${missingDeityId}`);
} catch (err) {
  console.error(`✗ events.json Error:`, err.message);
}

// 3. Check LanguageContext keys
const langFile = path.join(workspace, 'src/context/LanguageContext.jsx');
try {
  const content = fs.readFileSync(langFile, 'utf-8');
  if (content.includes('en:') && content.includes('hi:')) {
    console.log(`✓ LanguageContext.jsx: Both English and Hindi dictionary keys present`);
  } else {
    console.warn(`! LanguageContext.jsx: Potential missing language dictionaries`);
  }
} catch (err) {
  console.error(`✗ LanguageContext.jsx Error:`, err.message);
}

console.log('--- Audit Complete ---');
