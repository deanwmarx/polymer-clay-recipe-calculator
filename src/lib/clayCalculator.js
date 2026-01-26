/**
 * @typedef {Object} HSL
 * @property {number} h - 0-360
 * @property {number} s - 0-1
 * @property {number} l - 0-1
 */

/**
 * @typedef {Object} ClayRatios
 * @property {number} yellow
 * @property {number} red
 * @property {number} blue
 * @property {number} white
 * @property {number} black
 */

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function srgbByteToLinear(v) {
  const s = v / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function linearToSrgbByte(v) {
  const s = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  return Math.round(clamp(s, 0, 1) * 255);
}

function xyzToLab({ X, Y, Z }) {
  const Xn = 0.95047, Yn = 1.0, Zn = 1.08883;
  function f(t) {
    return t > 0.008856 ? Math.pow(t, 1 / 3) : 7.787037 * t + 16 / 116;
  }
  const fx = f(X / Xn);
  const fy = f(Y / Yn);
  const fz = f(Z / Zn);
  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);
  return { L, a, b };
}

function rgbToLab(rgb) {
  const R = srgbByteToLinear(rgb.r);
  const G = srgbByteToLinear(rgb.g);
  const B = srgbByteToLinear(rgb.b);
  const X = R * 0.4124564 + G * 0.3575761 + B * 0.1804375;
  const Y = R * 0.2126729 + G * 0.7151522 + B * 0.0721750;
  const Z = R * 0.0193339 + G * 0.1191920 + B * 0.9503041;
  return xyzToLab({ X, Y, Z });
}

export function deltaE(rgbA, rgbB) {
  const a = rgbToLab(rgbA);
  const b = rgbToLab(rgbB);
  const dL = a.L - b.L;
  const da = a.a - b.a;
  const db = a.b - b.b;
  return Math.sqrt(dL * dL + da * da + db * db);
}

/**
 * @param {HSL} hsl
 * @param {boolean} avoid_black
 * @returns {ClayRatios}
 */
export function calculateClayRatios({ h, s, l }, avoid_black) {
  // 1. Hue mix (base pigments)
  let p_r = 0,
    p_y = 0,
    p_b = 0;

  if (h >= 0 && h < 60) {
    // Red to Yellow
    p_r = 1 - h / 60;
    p_y = h / 60;
  } else if (h >= 60 && h < 240) {
    // Yellow to Blue
    p_y = 1 - (h - 60) / 180;
    p_b = (h - 60) / 180;
  } else {
    // Blue to Red
    p_b = 1 - (h - 240) / 120;
    p_r = (h - 240) / 120;
  }

  // Prepare black amount (base)
  let k = 0;
  let w_bump = 0;

  // 2. Toasted-light-brown adjustment: favor Yellow, reduce Red and Blue, add White for light dough
  if (h >= 20 && h <= 45 && l > 0.5) {
    // favor yellow over red for dough-like tones
    p_y *= 1.18;
    p_r *= 0.45;

    // keep blue minimal (just enough to neutralize if very saturated)
    const blue_bump = clamp((0.85 - s) * 0.04, 0, 0.12);
    p_b += blue_bump;

    // Add a white bump for lighter doughs
    w_bump = clamp((l - 0.55) * 0.7 + (0.95 - s) * 0.06, 0, 0.6);

    // small black bump only if explicitly allowed and very light
    if (!avoid_black && l > 0.68) {
      k = clamp((l - 0.68) * 0.08, 0, 0.12);
    }

    // Renormalize hue pigments (before allocating white/black)
    const total = p_r + p_y + p_b;
    p_r /= total;
    p_y /= total;
    p_b /= total;
  }

  // 3. White amount (base + any toast bump)
  const w = clamp((l - 0.35) * 1.2 + (0.35 - s) * 0.4 + w_bump, 0, 0.85);

  // 4. Black amount (base rule for very dark colors — ensure max)
  if (!avoid_black && l < 0.25) {
    k = clamp(Math.max(k, (0.25 - l) * 0.8), 0, 0.25);
  }

  // 5. Allocate final ratios
  const c = 1 - w - k;

  return {
    yellow: c * p_y,
    red: c * p_r,
    blue: c * p_b,
    white: w,
    black: k,
  };
}

/**
 * Simulate mixed clay color (approximate) by mixing pigment base sRGBs in linear space.
 * @param {ClayRatios} ratios
 * @returns {{r:number,g:number,b:number}}
 */
// Top-level pigment sRGB primaries (0-255)
const PIGMENT_SRGB = {
  yellow: { r: 255, g: 210, b: 74 },
  red: { r: 180, g: 60, b: 40 },
  blue: { r: 50, g: 90, b: 170 },
  white: { r: 255, g: 255, b: 255 },
  black: { r: 0, g: 0, b: 0 },
};

// Default per-pigment scalars (calibrated to your sample recipe)
export const DEFAULT_PIGMENT_SCALARS = {
  yellow: 0.9499329039842722,
  red: 1.465556282172434,
  blue: 0.9784238247834341,
  white: 0.7248806821119501,
  black: 1,
};

export function getDefaultPigmentScalars() {
  return Object.assign({}, DEFAULT_PIGMENT_SCALARS);
}

export function setDefaultPigmentScalars(newScalars) {
  for (const k of Object.keys(DEFAULT_PIGMENT_SCALARS)) {
    if (newScalars[k] !== undefined) DEFAULT_PIGMENT_SCALARS[k] = newScalars[k];
  }
}

export function clayMixToRgb(ratios, scalars = null) {
  scalars = scalars || DEFAULT_PIGMENT_SCALARS;

  function srgbToLinear(v) {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  }

  function linearToSrgb(v) {
    const s = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
    return Math.round(clamp(s, 0, 1) * 255);
  }

  let lr = 0,
    lg = 0,
    lb = 0;

  for (const key of Object.keys(PIGMENT_SRGB)) {
    const w = ratios[key] || 0;
    const s = scalars && scalars[key] ? scalars[key] : 1;
    lr += srgbToLinear(PIGMENT_SRGB[key].r * s) * w;
    lg += srgbToLinear(PIGMENT_SRGB[key].g * s) * w;
    lb += srgbToLinear(PIGMENT_SRGB[key].b * s) * w;
  }

  return {
    r: linearToSrgb(lr),
    g: linearToSrgb(lg),
    b: linearToSrgb(lb),
  };
}

// --- Calibration: adjust per-pigment sRGB scalars so a sample recipe reproduces target color ---
export function calibrateScalarsToRecipe(targetRgb, sampleRecipeGrams, opts = {}) {
  // Convert sample recipe grams to normalized ratios
  const total = Object.values(sampleRecipeGrams).reduce((a,b)=>a+b,0) || 1;
  const targetRatios = {};
  for (const k of Object.keys(PIGMENT_SRGB)) targetRatios[k] = (sampleRecipeGrams[k]||0) / total;

  // initial scalars
  const scalars = {};
  for (const k of Object.keys(PIGMENT_SRGB)) scalars[k] = 1.0;

  function mixedRgbForScalars(s) {
    return clayMixToRgb(targetRatios, s);
  }

  function lossForScalars(s) {
    const mix = mixedRgbForScalars(s);
    return deltaE(mix, targetRgb);
  }

  // simple random-search calibration
  let best = Object.assign({}, scalars);
  let bestLoss = lossForScalars(best);

  let step = opts.step || 0.2;
  const iterations = opts.iter || 4000;

  for (let i = 0; i < iterations; i++) {
    const cand = Object.assign({}, best);
    // perturb one pigment
    const keys = Object.keys(PIGMENT_SRGB);
    const k = keys[Math.floor(Math.random() * keys.length)];
    const factor = Math.exp((Math.random()*2 -1) * step);
    cand[k] = clamp(cand[k] * factor, 0.5, 2.0);
    const loss = lossForScalars(cand);
    if (loss < bestLoss) {
      bestLoss = loss;
      best = cand;
      // reduce step for fine tuning
      step *= 0.995;
    }
    if (i % 1000 === 0 && i>0) step *= 0.9;
  }

  const finalMix = mixedRgbForScalars(best);
  return { scalars: best, finalDeltaE: bestLoss, mixedRgb: finalMix };
}

/**
 * Optimize non-negative pigment weights (sum=1) to best match targetRgb using current scalars.
 * Uses projected gradient descent with multi-starts.
 * @param {{r:number,g:number,b:number}} targetRgb
 * @param {boolean} avoid_black
 * @param {object} opts
 * @returns {ClayRatios}
 */
export function optimizeRecipeForTargetRgb(targetRgb, avoid_black = true, opts = {}) {
  const scalars = opts.scalars || DEFAULT_PIGMENT_SCALARS;
  const keys = Object.keys(PIGMENT_SRGB).filter((k) => !(avoid_black && k === 'black'));
  const n = keys.length;

  function lossForW(wvec) {
    // wvec: array length n, not necessarily normalized
    let s = wvec.reduce((a,b)=>a+b,0);
    const weights = {};
    for (let i=0;i<n;i++) weights[keys[i]] = s>0 ? wvec[i]/s : 0;
    const mix = clayMixToRgb(weights, scalars);
    return deltaE(mix, targetRgb);
  }

  function optimizeFrom(wInit) {
    let w = wInit.slice();
    let lr = opts.step || 0.05;
    for (let iter=0; iter < (opts.iter || 3000); iter++) {
      const baseLoss = lossForW(w);
      // numeric gradient
      const grad = new Array(n).fill(0);
      const eps = 1e-6;
      for (let i=0;i<n;i++) {
        const w2 = w.slice();
        w2[i] += eps;
        const l2 = lossForW(w2);
        grad[i] = (l2 - baseLoss)/eps;
      }
      // update
      for (let i=0;i<n;i++) {
        w[i] -= lr * grad[i];
        if (w[i] < 0) w[i] = 0;
      }
      const s = w.reduce((a,b)=>a+b,0) || 1;
      for (let i=0;i<n;i++) w[i] /= s;
      lr *= 0.9999;
    }
    return { w, loss: lossForW(w) };
  }

  // starts
  const starts = [];
  starts.push(new Array(n).fill(1/n));
  for (let r=0;r<6;r++) {
    const w0 = new Array(n);
    let sum=0;
    for (let i=0;i<n;i++) { w0[i] = Math.random(); sum+=w0[i]; }
    for (let i=0;i<n;i++) w0[i] /= sum;
    starts.push(w0);
  }

  let best=null;
  for (const s0 of starts) {
    const res = optimizeFrom(s0);
    if (!best || res.loss < best.loss) best=res;
  }

  const ratios = { yellow:0, red:0, blue:0, white:0, black:0 };
  for (let i=0;i<n;i++) ratios[keys[i]] = best.w[i];
  // normalize
  const sum = ratios.yellow + ratios.red + ratios.blue + ratios.white + ratios.black;
  if (sum>0) for (const k of Object.keys(ratios)) ratios[k] /= sum;
  return ratios;
}

// Keep file stable: export a simple wrapper that returns the original HSL heuristic for now
export function generateClayRatiosSpectral(rgb, avoid_black) {
  const hsl = rgbToHsl(rgb);
  return calculateClayRatios(hsl, avoid_black);
}
