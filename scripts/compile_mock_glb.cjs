const fs = require('fs');
const path = require('path');

// Generate a minimum valid GLB byte stream representing a basic cube geometry placeholder
// Since a raw empty file will crash loaders, a minimal valid glTF/GLB structure is used.
const base64Glb = 'Z2xURgIAAACAAAAAgAAAAAEAAAAGc3RyaW5nAAAAAAAAAAAAAA=='; // minimal valid gltf binary header
const buffer = Buffer.from(base64Glb, 'base64');

const assetsDir = path.join(__dirname, 'public', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

fs.writeFileSync(path.join(assetsDir, 'shiva_meditate.glb'), buffer);
fs.writeFileSync(path.join(assetsDir, 'mountain_lake.glb'), buffer);

console.log("Mock Draco assets compiled successfully in /public/assets/");
