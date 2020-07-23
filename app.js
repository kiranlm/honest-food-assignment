const express = require('express');
const tj = require('@mapbox/togeojson');
const fs = require('fs');
const DOMParser = require('xmldom').DOMParser;
const path = require('path');
const openGeocoder = require('node-open-geocoder');
const cors = require('cors');

const bodyParser = require('body-parser');
const app = express();

app.use(cors());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

const port = process.env.PORT || 3001;

app.get('/', (req, res) => res.send('Honest Food API!'));
app.post('/search', async (req, res) => {
  const kml = new DOMParser().parseFromString(
    fs.readFileSync(
      path.resolve(__dirname + '/kml/FullStackTest_DeliveryAreas.kml'),
      'utf8'
    )
  );
  const address = req.body.address;
  const converted = tj.kml(kml);
  let responseString = 'not found';
  await openGeocoder()
    .geocode(address)
    .end(async (err, data) => {
      if (data && data[0] && address) {
        const outData = converted.features.filter(({ geometry }) => {
          if (
            isPointInPolygon(
              { lat: data[0].lat, lon: data[0].lon },
              geometry.coordinates[0]
            )
          ) {
            return true;
          } else {
            return false;
          }
        });
        console.log(outData);
        if (outData.length && outData[0]) {
          responseString = outData[0].properties.name;
        }
      }
      res.send(responseString);
    });
});

function isPointInPolygon(point, vs) {
  let x = point.lon,
    y = point.lat;

  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    let xi = vs[i][0],
      yi = vs[i][1];
    let xj = vs[j][0],
      yj = vs[j][1];

    let intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

app.listen(port, () => console.log(`app listening on port ${port}!`));
