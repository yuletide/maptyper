const TextToSVG = require('text-to-svg');
const { geoFromSVGFile, geoFromSVGXML } = require('svg2geojson');

const font = '/fonts/ipag.ttf';
const parser = new DOMParser();

const metadata = `<MetaInfo xmlns="http://www.prognoz.ru"><Geo>
<GeoItem X="-595.30" Y="-142.88" Latitude="37.375593" Longitude="-121.977795"/>
<GeoItem X="1388.66" Y=" 622.34" Latitude="37.369930" Longitude="-121.959404"/>
</Geo></MetaInfo>`;

const meta = document.createAttributeNS('http://www.prognoz.ru', 'MetaInfo');

const metadataParsed = parser.parseFromString(metadata, 'text/xml');
console.log(metadataParsed);

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
  const svg = textToSVG.getSVG('o', options);
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
});

// …processing SVG code as a string

const onTextChange = (e) => {
  console.log(e);
};

//const textToSVG = TextToSVG.loadSync();

function textToElement(html) {
  template = document.createElement('template');
  template.innerHTML = html;
  console.log(template.content.firstChild);
}
