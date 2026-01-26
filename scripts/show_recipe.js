import { parseColor } from '../src/lib/colorParser.js';
import { rgbToHsl } from '../src/lib/colorConvert.js';
import { calculateClayRatios, clayMixToRgb, getDefaultPigmentScalars } from '../src/lib/clayCalculator.js';

const hex = process.argv[2] || '#e5b978';
const payload = Number(process.argv[3] || 10);
const rgb = parseColor(hex);
if (!rgb) { console.error('Invalid color:', hex); process.exit(1); }
const hsl = rgbToHsl(rgb);
const ratios = calculateClayRatios(hsl, true);
const rounded = Object.fromEntries(Object.entries(ratios).map(([k,v])=>[k, Math.round(v*payload*10)/10]));
const scalars = getDefaultPigmentScalars();
const mixed = clayMixToRgb(ratios, scalars);
import { deltaE } from '../src/lib/clayCalculator.js';
console.log('color', hex);
console.log('hsl', hsl);
console.log('ratios', ratios);
console.log('rounded grams for', payload, 'g', rounded);
console.log('using scalars', scalars);
console.log('mixedRgb', mixed);
console.log('Delta-E to target:', deltaE(mixed, rgb));
