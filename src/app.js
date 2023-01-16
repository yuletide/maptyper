const TextToSVG = require('text-to-svg');
const svgtogeojson = require('svg-to-geojson').svgtogeojson;
// const { geoFromSVGXML } = require('svg2geojson');
const mapboxgl = require('mapbox-gl');
const buffer = require('@turf/buffer').default;
mapboxgl.accessToken =
  'pk.eyJ1IjoieXVsZXRpZGUiLCJhIjoiY2xjd3E4ZTliMTZ5cTNwcXoyMHo1Y3k0ZSJ9.-E6k5FuStkpZuZFaCbTAwQ'; //process.env['MAPBOX_ACCESS_TOKEN'];
import 'mapbox-gl/dist/mapbox-gl.css';

const font = '/fonts/blackswan.ttf';
const text = 'Hello World';
const parser = new DOMParser();
let map;

const input = document.getElementById('textInput');
input.addEventListener('input', onTextChange);
initMap();

const render = (text) => {
  TextToSVG.load(font, (err, textToSVG) => {
    // const svg = textToSVG.getSVG('hello');
    previewContainer = document.getElementById('preview');
    const attributes = { fill: 'red', stroke: 'black' };
    const options = {
      x: 0,
      y: 0,
      fontSize: 72,
      anchor: 'top',
      attributes: attributes,
      preserveWhitespace: true,
    };

    const svg = textToSVG.getSVG(text, options);
    console.log(svg);
    previewContainer.innerHTML = svg;
    svgParsed = parser.parseFromString(svg, 'text/xml');

    var json = svgtogeojson.svgToGeoJson(
      [
        [60.60351870425863, 25.907366943359375],
        [42.042623007528246, -10.96829223632812494],
      ],
      svgParsed.firstChild,
      9
    );
    // console.log(JSON.stringify(json));
    setMapData(buffer(json, 0));
  });
};
// …processing SVG code as a string

//const textToSVG = TextToSVG.loadSync();
function setMapData(json) {
  map.getSource('text').setData(json);
}
// function parseSVGOldWay(svg) {
//   const metadata = `<MetaInfo xmlns="http://www.prognoz.ru"><Geo>
// <GeoItem X="-595.30" Y="-142.88" Latitude="37.375593" Longitude="-121.977795"/>
// <GeoItem X="1388.66" Y=" 622.34" Latitude="37.369930" Longitude="-121.959404"/>
// </Geo></MetaInfo>`;

//   const meta = document.createAttributeNS('http://www.prognoz.ru', 'MetaInfo');

//   const metadataParsed = parser.parseFromString(metadata, 'text/xml');
//   console.log(metadataParsed);
//   svgParsed = parser.parseFromString(svg, 'text/xml');
//   console.log(svg);
//   console.log(svgParsed);
//   // previewContainer.innerHTML = svg;
//   previewContainer.append(svg.firstChild);
//   // textToElement(svg);
//   svgParsed.firstChild.append(metadataParsed.firstChild);
//   console.log(svgParsed);

//   geoFromSVGXML(svgParsed.firstChild.outerHTML, (layer) => {
//     let json = JSON.stringify(layer.geo); // Turn JS object into JSON string
//     console.log(json);
//   });
// }

// function textToElement(html) {
//   template = document.createElement('template');
//   template.innerHTML = html;
//   console.log(template.content.firstChild);
// }

function onTextChange(e) {
  // console.log(e);
  render(e.target.value);
}
function initMap() {
  map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/yuletide/clcwq3kd9000i14r2iamhpahi', // style URL
    center: [-0.46829223632812494, 51.342623007528246], // starting position [lng, lat]
    zoom: 3, // starting zoom
  });
  map.on('load', () => {
    map.addSource('text', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
    map.addLayer(
      {
        id: 'textLayer',
        type: 'fill-extrusion',
        // Use "iso" as the data source for this layer
        source: 'text',
        layout: {},
        paint: {
          // The fill color for the layer is set to a light purple
          // 'fill-color': 'white',
          // 'fill-opacity': 0.3,
          'fill-extrusion-color': '#5a3fc0',
          'fill-extrusion-height': 1000000,
        },
      }
      // 'poi-label'
    );
    console.log('map loaded');
    render('alex yule');
  });
}
