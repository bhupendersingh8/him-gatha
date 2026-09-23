const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/deities.json', 'utf8'));

// Add audio URL to the first deity
if (data.length > 0) {
    data[0].audio_url = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b8f3d611.mp3?filename=om-chanting-111192.mp3";
    fs.writeFileSync('src/data/deities.json', JSON.stringify(data, null, 2));
    console.log('Added audio_url to ' + data[0].name);
}
