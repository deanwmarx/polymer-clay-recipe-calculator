import { parseColor } from '../src/lib/colorParser.js';
import { optimizeRecipeForTargetRgb, clayMixToRgb, deltaE, getDefaultPigmentScalars } from '../src/lib/clayCalculator.js';

const hex = process.argv[2] || '#e5b978';
const payload = Number(process.argv[3] || 10);
const avoidBlack = process.argv[4] === 'true' ? true : false;
const rgb = parseColor(hex);
if (!rgb) { console.error('Invalid color:', hex); process.exit(1); }

console.log('Optimizing recipe for', hex, 'payload', payload, 'avoidBlack', avoidBlack);
const scalars = getDefaultPigmentScalars();
const ratios = optimizeRecipeForTargetRgb(rgb, avoidBlack, { scalars, iter: 3000, step: 0.05 });
const grams = Object.fromEntries(Object.entries(ratios).map(([k,v])=>[k, +(v*payload).toFixed(2)]));
const mixed = clayMixToRgb(ratios, scalars);
console.log('Optimized ratios:', ratios);
console.log('Grams:', grams);
console.log('Mixed RGB:', mixed);
console.log('Delta-E:', deltaE(mixed, rgb));