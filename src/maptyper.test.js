import MapTyper from './maptyper';

// Mock the external dependencies
jest.mock('text-to-svg', () => {
  return {
    __esModule: true,
    default: {
      load: jest.fn((fontPath, callback) => {
        const mockTextToSVG = {
          getSVG: jest.fn((text, options) => {
            return `<svg><path d="M0,0 L10,10"/></svg>`;
          }),
        };
        setTimeout(() => callback(null, mockTextToSVG), 0);
      }),
    },
  };
});

jest.mock('svg-to-geojson', () => {
  return {
    __esModule: true,
    default: {
      svgtogeojson: {
        svgToGeoJson: jest.fn(() => ({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [0, 0],
                    [1, 0],
                    [1, 1],
                    [0, 1],
                    [0, 0],
                  ],
                ],
              },
              properties: {},
            },
          ],
        })),
      },
    },
  };
});

jest.mock('@turf/buffer', () => {
  return {
    __esModule: true,
    default: jest.fn((geojson) => geojson),
  };
});

describe('MapTyper', () => {
  describe('constructor', () => {
    test('should throw error when font is not provided', () => {
      expect(() => {
        new MapTyper();
      }).toThrow('Font required to create MapTyper');
    });

    test('should throw error when font is null', () => {
      expect(() => {
        new MapTyper(null);
      }).toThrow('Font required to create MapTyper');
    });

    test('should throw error when font is empty string', () => {
      expect(() => {
        new MapTyper('');
      }).toThrow('Font required to create MapTyper');
    });

    test('should create instance with valid font path', () => {
      const typer = new MapTyper('/path/to/font.ttf');
      expect(typer).toBeInstanceOf(MapTyper);
      expect(typer.loaded).toBe(false);
    });

    test('should accept optional fontSize parameter', () => {
      const typer = new MapTyper('/path/to/font.ttf', 48);
      expect(typer).toBeInstanceOf(MapTyper);
      expect(typer._SVGOptions.fontSize).toBe(48);
    });

    test('should use default fontSize when not provided', () => {
      const typer = new MapTyper('/path/to/font.ttf');
      expect(typer._SVGOptions.fontSize).toBe(72);
    });

    test('should accept optional callback parameter', () => {
      const callback = jest.fn();
      const typer = new MapTyper('/path/to/font.ttf', 72, callback);
      expect(typer.callback).toBe(callback);
    });
  });

  describe('initFont', () => {
    test('should initialize font successfully', async () => {
      const typer = new MapTyper('/path/to/font.ttf');
      
      // Wait for font to load
      await new Promise((resolve) => setTimeout(resolve, 10));
      
      expect(typer.loaded).toBe(true);
      expect(typer.textToSVG).toBeDefined();
    });

    test('should call callback when provided', async () => {
      const callback = jest.fn();
      const typer = new MapTyper('/path/to/font.ttf', 72, callback);
      
      // Wait for font to load
      await new Promise((resolve) => setTimeout(resolve, 10));
      
      expect(callback).toHaveBeenCalledWith(typer);
    });
  });

  describe('textToFeatures', () => {
    test('should convert text to GeoJSON features after font loads', async () => {
      const typer = new MapTyper('/path/to/font.ttf');
      
      // Wait for font to load
      await new Promise((resolve) => setTimeout(resolve, 10));
      
      const result = typer.textToFeatures('Hello');
      
      expect(result).toBeDefined();
      expect(result.type).toBe('FeatureCollection');
      expect(result.features).toBeInstanceOf(Array);
    });

    test('should handle empty text', async () => {
      const typer = new MapTyper('/path/to/font.ttf');
      
      // Wait for font to load
      await new Promise((resolve) => setTimeout(resolve, 10));
      
      const result = typer.textToFeatures('');
      
      expect(result).toBeDefined();
      expect(result.type).toBe('FeatureCollection');
    });

    test('should handle text with whitespace', async () => {
      const typer = new MapTyper('/path/to/font.ttf');
      
      // Wait for font to load
      await new Promise((resolve) => setTimeout(resolve, 10));
      
      const result = typer.textToFeatures('Hello World');
      
      expect(result).toBeDefined();
      expect(result.type).toBe('FeatureCollection');
    });

    test('should handle special characters', async () => {
      const typer = new MapTyper('/path/to/font.ttf');
      
      // Wait for font to load
      await new Promise((resolve) => setTimeout(resolve, 10));
      
      const result = typer.textToFeatures('Hello! @#$%');
      
      expect(result).toBeDefined();
      expect(result.type).toBe('FeatureCollection');
    });
  });

  describe('_textToSVG', () => {
    test('should convert text to SVG', async () => {
      const typer = new MapTyper('/path/to/font.ttf');
      
      // Wait for font to load
      await new Promise((resolve) => setTimeout(resolve, 10));
      
      const svg = typer._textToSVG('Test');
      
      expect(svg).toBeDefined();
      expect(typeof svg).toBe('string');
      expect(svg).toContain('svg');
    });

    test('should store parsed SVG', async () => {
      const typer = new MapTyper('/path/to/font.ttf');
      
      // Wait for font to load
      await new Promise((resolve) => setTimeout(resolve, 10));
      
      typer._textToSVG('Test');
      
      expect(typer._svgParsed).toBeDefined();
    });
  });

  describe('_calculateBounds', () => {
    test('should return bounds array', () => {
      const typer = new MapTyper('/path/to/font.ttf');
      const bounds = typer._calculateBounds('Test', 72, [0, 0]);
      
      expect(bounds).toBeInstanceOf(Array);
      expect(bounds.length).toBe(2);
      expect(bounds[0]).toBeInstanceOf(Array);
      expect(bounds[1]).toBeInstanceOf(Array);
    });

    test('should return consistent bounds', () => {
      const typer = new MapTyper('/path/to/font.ttf');
      const bounds1 = typer._calculateBounds('Test', 72, [0, 0]);
      const bounds2 = typer._calculateBounds('Test', 72, [0, 0]);
      
      expect(bounds1).toEqual(bounds2);
    });
  });

  describe('SVGOptions', () => {
    test('should have default SVG options', () => {
      const typer = new MapTyper('/path/to/font.ttf');
      
      expect(typer._SVGOptions).toBeDefined();
      expect(typer._SVGOptions.x).toBe(0);
      expect(typer._SVGOptions.y).toBe(0);
      expect(typer._SVGOptions.fontSize).toBe(72);
      expect(typer._SVGOptions.anchor).toBe('top');
      expect(typer._SVGOptions.preserveWhitespace).toBe(true);
    });

    test('should have fill and stroke attributes', () => {
      const typer = new MapTyper('/path/to/font.ttf');
      
      expect(typer._SVGOptions.attributes).toBeDefined();
      expect(typer._SVGOptions.attributes.fill).toBe('red');
      expect(typer._SVGOptions.attributes.stroke).toBe('black');
    });
  });
});
