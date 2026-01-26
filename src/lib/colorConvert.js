/**
 * @typedef {Object} RGB
 * @property {number} r - 0-255
 * @property {number} g - 0-255
 * @property {number} b - 0-255
 */

/**
 * @typedef {Object} HSL
 * @property {number} h - 0-360
 * @property {number} s - 0-1
 * @property {number} l - 0-1
 */

/**
 * @param {RGB} rgb
 * @returns {HSL}
 */
export function rgbToHsl({ r, g, b }) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    if (max === r) {
      h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
    } else if (max === g) {
      h = ((b - r) / delta + 2) * 60;
    } else {
      h = ((r - g) / delta + 4) * 60;
    }
  }

  return { h, s, l };
}
