const TextToSVG = require('text-to-svg');
const svgtogeojson = require('svg-to-geojson').svgtogeojson;
const { geoFromSVGXML } = require('svg2geojson');

const font = '/fonts/ipag.ttf';
const text = 'Hello World';
const parser = new DOMParser();

const input = document.getElementById('textInput');
input.addEventListener('input', onTextChange);
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
        [51.60351870425863, 0.207366943359375],
        [51.342623007528246, -0.46829223632812494],
      ],
      svgParsed.firstChild,
      9
    );
    console.log(JSON.stringify(json));
  });
};
// …processing SVG code as a string

//const textToSVG = TextToSVG.loadSync();

function parseSVGOldWay(svg) {
  const metadata = `<MetaInfo xmlns="http://www.prognoz.ru"><Geo>
<GeoItem X="-595.30" Y="-142.88" Latitude="37.375593" Longitude="-121.977795"/>
<GeoItem X="1388.66" Y=" 622.34" Latitude="37.369930" Longitude="-121.959404"/>
</Geo></MetaInfo>`;

  const meta = document.createAttributeNS('http://www.prognoz.ru', 'MetaInfo');

  const metadataParsed = parser.parseFromString(metadata, 'text/xml');
  console.log(metadataParsed);
  svgParsed = parser.parseFromString(svg, 'text/xml');
  console.log(svg);
  console.log(svgParsed);
  // previewContainer.innerHTML = svg;
  previewContainer.append(svg.firstChild);
  // textToElement(svg);
  svgParsed.firstChild.append(metadataParsed.firstChild);
  console.log(svgParsed);

  geoFromSVGXML(svgParsed.firstChild.outerHTML, (layer) => {
    let json = JSON.stringify(layer.geo); // Turn JS object into JSON string
    console.log(json);
  });
}

function textToElement(html) {
  template = document.createElement('template');
  template.innerHTML = html;
  console.log(template.content.firstChild);
}

function onTextChange(e) {
  console.log(e);
  render(e.target.value);
}
