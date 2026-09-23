import fs from 'fs';

const deities = JSON.parse(fs.readFileSync('src/data/deities.json', 'utf8'));
const events = JSON.parse(fs.readFileSync('src/data/events.json', 'utf8'));
const lineages = JSON.parse(fs.readFileSync('src/data/lineages.json', 'utf8'));

console.log("Analyzing Events Deity IDs:");
events.forEach(e => {
  const match = deities.find(d => 
    d.id.toLowerCase() === e.deityId.toLowerCase() || 
    d.name.toLowerCase().includes(e.title.split(' ')[0].toLowerCase()) ||
    e.title.toLowerCase().includes(d.name.split(' ')[0].toLowerCase())
  );
  console.log(`Event ID: ${e.deityId} (${e.title}) => Matched Deity: ${match ? `${match.id} (${match.name})` : 'NONE'}`);
});

console.log("\nAnalyzing Lineages Deity IDs:");
const uniqueIds = new Set();
lineages.forEach(l => {
  uniqueIds.add(l.deityId1);
  uniqueIds.add(l.deityId2);
});

Array.from(uniqueIds).forEach(id => {
  const match = deities.find(d => 
    d.id.toLowerCase() === id.toLowerCase() ||
    d.name.toLowerCase().includes(id.toLowerCase())
  );
  console.log(`Lineage ID: ${id} => Matched Deity: ${match ? `${match.id} (${match.name})` : 'NONE'}`);
});
