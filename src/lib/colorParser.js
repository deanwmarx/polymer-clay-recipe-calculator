/**
 * @typedef {Object} RGB
 * @property {number} r - 0-255
 * @property {number} g - 0-255
 * @property {number} b - 0-255
 */

/**
 * Parse color string to RGB
 * @param {string} input - hex, rgb(), or hsl()
 * @returns {RGB | null}
 */
export function parseColor(input) {
  const trimmed = input.trim();

  // Try hex
  const hex_match = trimmed.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (hex_match) {
    return {
      r: parseInt(hex_match[1], 16),
      g: parseInt(hex_match[2], 16),
      b: parseInt(hex_match[3], 16),
    };
  }

  // Try short hex
  const short_hex_match = trimmed.match(/^#?([a-f\d])([a-f\d])([a-f\d])$/i);
  if (short_hex_match) {
    return {
      r: parseInt(short_hex_match[1] + short_hex_match[1], 16),
      g: parseInt(short_hex_match[2] + short_hex_match[2], 16),
      b: parseInt(short_hex_match[3] + short_hex_match[3], 16),
    };
  }

  // Try rgb()
  const rgb_match = trimmed.match(
    /^rgba?\(\s*(\d+)\s*[,\s]\s*(\d+)\s*[,\s]\s*(\d+)/i
  );
  if (rgb_match) {
    return {
      r: parseInt(rgb_match[1]),
      g: parseInt(rgb_match[2]),
      b: parseInt(rgb_match[3]),
    };
  }

  // Try hsl()
  const hsl_match = trimmed.match(
    /^hsla?\(\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)%?\s*[,\s]\s*(\d+(?:\.\d+)?)%?/i
  );
  if (hsl_match) {
    const h = parseFloat(hsl_match[1]);
    const s = parseFloat(hsl_match[2]) / 100;
    const l = parseFloat(hsl_match[3]) / 100;
    return hslToRgb({ h, s, l });
  }

  return null;
}

/**
 * @typedef {Object} HSL
 * @property {number} h - 0-360
 * @property {number} s - 0-1
 * @property {number} l - 0-1
 */

/**
 * @param {HSL} hsl
 * @returns {RGB}
 */
function hslToRgb({ h, s, l }) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}
