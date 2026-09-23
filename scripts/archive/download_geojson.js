const https = require('https');
const fs = require('fs');

https.get('https://raw.githubusercontent.com/geohacker/india/master/district/india_district.geojson', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const hp = json.features.filter(f => 
        (f.properties.NAME_1 === 'Himachal Pradesh' || f.properties.ST_NM === 'Himachal Pradesh')
      );
      json.features = hp;
      fs.writeFileSync('src/data/himachal.json', JSON.stringify(json));
      console.log('Saved ' + hp.length + ' features to src/data/himachal.json');
    } catch (e) {
      console.error('Error parsing JSON:', e.message);
    }
  });
}).on('error', (e) => {
  console.error('Request error:', e.message);
});
