import { parseColor } from '../src/lib/colorParser.js';
import { calibrateScalarsToRecipe, clayMixToRgb, deltaE } from '../src/lib/clayCalculator.js';

const hex = process.argv[2] || '#e5b978';
const payload = Number(process.argv[3] || 10);
const rgb = parseColor(hex);
if (!rgb) {
  console.error('Invalid color:', hex);
  process.exit(1);
}

const sample = { yellow: 5.7, white: 3.0, red: 1.2, blue: 0.1, black: 0 };
console.log('Running sRGB scalar calibration for', hex, 'and sample recipe (grams):', sample);
const res = calibrateScalarsToRecipe(rgb, sample, { iter: 3000, step: 0.2 });
console.log('Result scalars:', res.scalars);
console.log('Final deltaE:', res.finalDeltaE);
console.log('Mixed RGB after scaling:', res.mixedRgb);
const finalGrams = Object.fromEntries(Object.entries(sample).map(([k,v])=>[k, +(v).toFixed(2)]));
console.log('Sample grams unchanged (used for calibration):', finalGrams);

// Show what solver would return using the scaled pigments: we don't have a full spectral solver
// but we can show that mixing the sample yields close color
console.log('DeltaE to target:', deltaE(res.mixedRgb, rgb));
