const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/deities.json', 'utf8'));

if (data.length > 0) {
    data[0].transport = {
        air: "Nearest airport is Jubbarhatti Airport (Shimla), approximately 120km away.",
        rail: "Closest major railhead is Kalka broad-gauge railway station, or Shimla narrow-gauge.",
        road: "Take an HRTC bus or private taxi from the main district bus stand. Local transport connects the headquarters directly to the base village.",
        trek: "A minor 2km traditional trekking route connects the base village to the sacred grove."
    };
    fs.writeFileSync('src/data/deities.json', JSON.stringify(data, null, 2));
    console.log('Added transport data to ' + data[0].name);
}
