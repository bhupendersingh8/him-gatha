const fs = require('fs');

const file = 'src/data/deities.json';
const deities = JSON.parse(fs.readFileSync(file, 'utf8'));

deities.forEach(d => {
  if (d.id === 'MND16') d.slug = 'shri-naag-chawasi-sidh-ji-karsog';
  if (d.id === 'HMR01') d.slug = 'baba-balak-nath-deotsidh';
  if (d.id === 'BLP11') d.slug = 'baba-balak-nath-shahtalai';
  if (d.id === 'BLP08') d.slug = 'laxmi-narayan-bilaspur';
  if (d.id === 'CHM01') d.slug = 'laxmi-narayan-chamba';
  if (d.id === 'CHM14') d.slug = 'chamunda-devi-chamba';
  if (d.id === 'KNG03') d.slug = 'chamunda-devi-kangra';
  if (d.id === 'MND04') d.slug = 'shikari-devi-janjehli';
  if (d.id === 'KLU03') d.slug = 'bijli-mahadev-mathaanh';
});

fs.writeFileSync(file, JSON.stringify(deities, null, 2));
console.log('Disambiguated duplicate slugs in deities.json successfully.');
