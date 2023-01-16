import TextToSVG from 'text-to-svg';
import svgtogeojson from 'svg-to-geojson';
import buffer from '@turf/buffer';

/**
 * A class to convert text to geojson
 */
class MapTyper {
  _SVGOptions = {
    x: 0,
    y: 0,
    fontSize: 72,
    anchor: 'top',
    // this doesnt matter since we are styling later
    attributes: { fill: 'red', stroke: 'black' },
    preserveWhitespace: true,
  };

  _parser = new DOMParser();

  /**
   *
   * @param {String} font path to font file
   * @param {Number} fontSize optional
   * @param {Function} callback optional function to call once font is loaded
   */
  constructor(font, fontSize, callback) {
    console.log(svgtogeojson);
    if (!font) {
      throw new Error('Font required to create MapTyper');
    }
    this.loaded = false;
    this.callback = callback || null;
    if (fontSize) {
      this._SVGOptions.fontSize = fontSize;
    }
    // Usage?
    // const typer = new MapTyper(font)
    // typer.init.then(stuff)
    // typer.init could either be a function called after creation of object
    // or a refernence to the promise already created by constructor
    // usage B: old style callback
    (async () => {
      this.init = await this.initFont(font);
    })();
  }
  /**
   *
   * @param {String} font
   */
  initFont = async (font) => {
    // should we check if this has been called already and just return the promise here?
    const fontPromise = new Promise((resolve, reject) => {
      TextToSVG.load(font, (err, textToSVG) => {
        if (err) {
          reject('Error loading font ' + err);
        }
        console.log('Text to SVG loaded', textToSVG);
        this.loaded = true;
        this.textToSVG = textToSVG;
        // Allow callback or promise chaining for proper async handling
        if (this.callback) this.callback(this);
        resolve(textToSVG);
      });
    });
  };

  _textToSVG = (text) => {
    this.svg = this.textToSVG.getSVG(text, this._SVGOptions);
    // The SVG to JSON library requires an element, not string, so parse to XML
    this._svgParsed = this._parser.parseFromString(
      this.svg,
      'text/xml'
    ).firstChild;
    return this.svg;
  };

  /**
   * A placeholder for a function that takes in text, font size and origin point
   * And calculates a bounds of the correct size. Must take into account latitude.
   * TODO: Rewrite this in typescript with proper types for these
   * @param {String} text
   * @param {Number} size
   * @param {import('mapbox-gl').PointLike} origin
   * @returns {Array<Number>}
   */
  _calculateBounds = (text, size, origin) => {
    return [
      [60.60351870425863, 25.907366943359375],
      [42.042623007528246, -10.96829223632812494],
    ];
  };

  /**
   * Convert text to GeoJSON.
   * @param {String} text
   * @param {import('mapbox-gl').PointLike} origin point to draw text from -- bottom left or center?
   * we need some way to calculate the bounds dynamically and allow text positioning
   * @returns {GeoJSON}
   */
  textToFeatures = (text, origin) => {
    if (!this.loaded) {
      console.error('Unable to calltextToFeatures before font loaded');
      // this seems crazy... TODO
      return this.init.then(this.textToFeatures(text));
    }

    this._textToSVG(text);
    const bounds = this._calculateBounds(
      text,
      this._SVGOptions.fontSize,
      origin
    );
    // they really nested these objects huh
    const json = svgtogeojson.svgtogeojson.svgToGeoJson(
      bounds,
      this._svgParsed,
      9
    );
    return buffer(json, 0);
  };
}

export default MapTyper;
