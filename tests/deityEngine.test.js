import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  validateHimachalCoordinates, 
  searchDeities, 
  formatGoogleMapsUrl 
} from '../src/utils/deityEngine.js';

test('validateHimachalCoordinates returns true for valid coordinates within Himachal bounds', () => {
  // Hidimba Devi Manali (32.2472, 77.1892)
  assert.equal(validateHimachalCoordinates(32.2472, 77.1892), true);
  // Kamrunag Mandi (31.4530, 77.2050)
  assert.equal(validateHimachalCoordinates(31.4530, 77.2050), true);
});

test('validateHimachalCoordinates returns false for coordinates outside Himachal bounds', () => {
  // New Delhi (28.6139, 77.2090)
  assert.equal(validateHimachalCoordinates(28.6139, 77.2090), false);
  // Null or invalid input
  assert.equal(validateHimachalCoordinates(null, null), false);
  assert.equal(validateHimachalCoordinates(NaN, 77.0), false);
});

test('formatGoogleMapsUrl builds an encoded Google Maps search URL', () => {
  const url = formatGoogleMapsUrl('Shri Lakshana Devi', 'Bharmour', 'Chamba');
  assert.ok(url.startsWith('https://www.google.com/maps/search/?api=1&query='));
  assert.ok(url.includes('Lakshana'));
  assert.ok(url.includes('Chamba'));
  assert.ok(url.includes('Himachal+Pradesh'));
});

test('searchDeities filters deities by district and query faithfully', () => {
  const mockDeities = [
    { id: '1', name: 'Hidimba Devi', district: 'Kullu', description: 'Ancient wood temple in Manali' },
    { id: '2', name: 'Bijli Mahadev', district: 'Kullu', description: 'Lightning struck Shiva temple' },
    { id: '3', name: 'Lakshana Devi', district: 'Chamba', description: 'Seventh century shrine in Bharmour' }
  ];

  // Search by text
  const shivaResults = searchDeities(mockDeities, 'Mahadev', 'All');
  assert.equal(shivaResults.length, 1);
  assert.equal(shivaResults[0].name, 'Bijli Mahadev');

  // Filter by district
  const chambaResults = searchDeities(mockDeities, '', 'Chamba');
  assert.equal(chambaResults.length, 1);
  assert.equal(chambaResults[0].name, 'Lakshana Devi');

  // Search by Hindi field
  const hindiMock = [
    { id: '4', name: 'Shikari Devi', name_hi: 'शिकारी देवी', district: 'Mandi', description: 'Roofless mountain peak shrine' }
  ];
  const hindiResults = searchDeities(hindiMock, 'शिकारी', 'All');
  assert.equal(hindiResults.length, 1);
  assert.equal(hindiResults[0].id, '4');
});

test('sanitizeInput strips dangerous HTML markup and control characters', async () => {
  const { sanitizeInput } = await import('../src/hooks/useSanitizeInput.js');
  
  const dirty = '<script>alert("xss")</script>Shikari Devi';
  const clean = sanitizeInput(dirty);
  assert.equal(clean.includes('<script>'), false);
  assert.equal(clean.includes('alert'), false);

  const payload = {
    name: '<b>Hadimba Devi</b>',
    district: 'Kullu\u0000',
    tags: ['<i>Sacred</i>', '<img src=x onerror=alert(1)>']
  };
  const sanitized = sanitizeInput(payload);
  assert.equal(sanitized.name, 'Hadimba Devi');
  assert.equal(sanitized.district, 'Kullu');
  assert.equal(sanitized.tags[0], 'Sacred');
});

test('Strict URL validation blocks dangerous schemes and accepts valid HTTP(S) links', () => {
  const isValidHttpUrl = (str) => {
    if (!str) return true;
    try {
      const parsed = new URL(str.trim());
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  assert.equal(isValidHttpUrl('https://maps.app.goo.gl/xyz'), true);
  assert.equal(isValidHttpUrl('http://maps.google.com/?q=hidimba'), true);
  assert.equal(isValidHttpUrl('javascript:alert(1)'), false);
  assert.equal(isValidHttpUrl('data:text/html,<script>alert(1)</script>'), false);
  assert.equal(isValidHttpUrl('vbscript:msgbox(1)'), false);
  assert.equal(isValidHttpUrl('not-a-url'), false);
});

test('Dataset integrity: all 222 deities in src/data/deities.json have valid identifiers and schemas', async () => {
  const deitiesModule = await import('../src/data/deities.json', { with: { type: 'json' } });
  const deities = deitiesModule.default;
  
  assert.ok(Array.isArray(deities));
  assert.equal(deities.length, 222);

  const ids = new Set();
  for (const d of deities) {
    assert.ok(d.id, 'Deity must possess an id');
    assert.ok(d.name, `Deity ${d.id} must have a name`);
    assert.ok(d.district, `Deity ${d.id} must have a district`);
    assert.ok(!ids.has(d.id), `Deity id ${d.id} must be unique`);
    ids.add(d.id);
  }
});
