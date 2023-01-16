const TextToSVG = require('text-to-svg');
const svgtogeojson = require('svg-to-geojson').svgtogeojson;
const mapboxgl = require('mapbox-gl');
const buffer = require('@turf/buffer').default;
mapboxgl.accessToken =
  'pk.eyJ1IjoieXVsZXRpZGUiLCJhIjoiY2xjd3E4ZTliMTZ5cTNwcXoyMHo1Y3k0ZSJ9.-E6k5FuStkpZuZFaCbTAwQ'; //process.env['MAPBOX_ACCESS_TOKEN'];
import 'mapbox-gl/dist/mapbox-gl.css';
import MapTyper from './maptyper';

const font = '/fonts/blackswan.ttf';
const text = 'Hello World';
const parser = new DOMParser();
let map;

const input = document.getElementById('textInput');
input.addEventListener('input', onTextChange);
initMap();

const render = (text) => {
  TextToSVG.load(font, (err, textToSVG) => {
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
    // console.log(svg);
    previewContainer.innerHTML = svg;
    svgParsed = parser.parseFromString(svg, 'text/xml');

    const json = svgtogeojson.svgToGeoJson(
      [
        [60.60351870425863, 25.907366943359375],
        [42.042623007528246, -10.96829223632812494],
      ],
      svgParsed.firstChild,
      9
    );
    // console.log(JSON.stringify(json));

    // we must buffer to fix broken geojson
    return buffer(json, 0);
  });
};
// …processing SVG code as a string

const typer = new MapTyper(font, 72, (loaded) => {
  console.log('callback');
  const _svg = typer.textToFeatures('hello');
  console.log(_svg);
});

function setMapData(json) {
  map.getSource('text').setData(json);
}

function onTextChange(e) {
  // console.log(e);
  render(e.target.value);
}
function initMap() {
  // SF: http://localhost:1234/#7.59/37.967/-122.163/59.2/69
  // Boston: http://localhost:1234/#7.17/42.246/-71.165/-70.9/77
  map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/yuletide/clcwq3kd9000i14r2iamhpahi', // style URL
    center: [-0.46829223632812494, 51.342623007528246], // starting position [lng, lat]
    zoom: 3, // starting zoom
    hash: true,
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
    render('hello world!');
    setMapData(typer.textToFeatures('hello world'));
    // setMapData(buffer(json, 0));
  });
}
