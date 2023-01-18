import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapTyper from './maptyper';

mapboxgl.accessToken =
  'pk.eyJ1IjoieXVsZXRpZGUiLCJhIjoiY2xjd3E4ZTliMTZ5cTNwcXoyMHo1Y3k0ZSJ9.-E6k5FuStkpZuZFaCbTAwQ'; //process.env['MAPBOX_ACCESS_TOKEN'];

const font = '/fonts/Lora-BoldItalic.ttf';
const defaultText = 'Hello World';
let map, currentText;

const previewContainer = document.getElementById('preview');
const input = document.getElementById('textInput');
const fontInput = document.getElementById('fontInput');

let typer = new MapTyper(font, 72, (loaded) => {
  console.log('MapTyper Loaded');
  // possible race condition here, we should return a promise from typer and use that in on map load
});

const setMapData = (json) => {
  map.getSource('text').setData(json);
};

const renderText = (text) => {
  currentText = text;
  const json = typer.textToFeatures(text);
  console.log(JSON.stringify(json));
  setMapData(json);
  previewContainer.innerHTML = typer.svg;
};

const onTextChange = (e) => {
  e.target.value && renderText(e.target.value);
};

const onFontChange = (e) => {
  if (!e.target.value) return;
  console.log(e.target.value);
  typer = new MapTyper('/fonts/' + e.target.value, 72, (loaded) => {
    console.log('Font changed ', e.target.value);
    renderText(currentText);
  });
};

const initMap = () => {
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
        source: 'text',
        layout: {},
        paint: {
          // 'fill-color': 'white',
          // 'fill-opacity': 0.3,
          'fill-extrusion-color': '#5a3fc0',
          'fill-extrusion-height': 1000000,
        },
      }
      // 'poi-label'
    );
    // console.log('map loaded');
    renderText(defaultText);
  });
};

input.addEventListener('input', onTextChange);
fontInput.addEventListener('change', onFontChange);
initMap();
