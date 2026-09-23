const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) results = results.concat(getFiles(p));
    else if (/\.(js|jsx)$/.test(p)) results.push(p);
  });
  return results;
}

const files = getFiles('src');
const imports = new Set();
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const regex = /from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const pkg = match[1];
    if (!pkg.startsWith('.')) {
      const rootPkg = pkg.startsWith('@') ? pkg.split('/').slice(0, 2).join('/') : pkg.split('/')[0];
      imports.add(rootPkg);
    }
  }
});
console.log('Actual imported packages in src/:', Array.from(imports).sort());
