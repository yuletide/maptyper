console.log('hi');

const TextToSVG = require('text-to-svg');
const font = '/fonts/ipag.ttf';

TextToSVG.load(font, (err, textToSVG) => {
  // const svg = textToSVG.getSVG('hello');
  previewContainer = document.getElementById('preview');
  console.log(previewContainer);
  const attributes = { fill: 'red', stroke: 'black' };
  const options = {
    x: 0,
    y: 0,
    fontSize: 72,
    anchor: 'top',
    attributes: attributes,
  };
  const svg = textToSVG.getSVG('hello', options);
  console.log(svg);
  previewContainer.innerHTML = svg;
});

const onTextChange = (e) => {
  console.log(e);
};

//const textToSVG = TextToSVG.loadSync();
