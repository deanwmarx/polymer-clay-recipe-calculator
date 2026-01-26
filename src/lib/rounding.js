/**
 * @typedef {Object} ClayRatios
 * @property {number} yellow
 * @property {number} red
 * @property {number} blue
 * @property {number} white
 * @property {number} black
 */

/**
 * @typedef {Object} ClayGrams
 * @property {number} yellow
 * @property {number} red
 * @property {number} blue
 * @property {number} white
 * @property {number} black
 */

/**
 * @param {ClayRatios} ratios
 * @param {number} payload_grams
 * @returns {ClayGrams}
 */
export function roundClayGrams(ratios, payload_grams) {
  const exact = {
    yellow: ratios.yellow * payload_grams,
    red: ratios.red * payload_grams,
    blue: ratios.blue * payload_grams,
    white: ratios.white * payload_grams,
    black: ratios.black * payload_grams,
  };

  const rounded = {
    yellow: Math.round(exact.yellow * 10) / 10,
    red: Math.round(exact.red * 10) / 10,
    blue: Math.round(exact.blue * 10) / 10,
    white: Math.round(exact.white * 10) / 10,
    black: Math.round(exact.black * 10) / 10,
  };

  const sum =
    rounded.yellow + rounded.red + rounded.blue + rounded.white + rounded.black;
  const error = payload_grams - sum;

  if (Math.abs(error) > 0.01) {
    // Find largest component and adjust
    const keys = ["yellow", "red", "blue", "white", "black"];
    let max_key = keys[0];
    let max_val = rounded[max_key];

    for (const key of keys) {
      if (rounded[key] > max_val) {
        max_val = rounded[key];
        max_key = key;
      }
    }

    rounded[max_key] = Math.round((rounded[max_key] + error) * 10) / 10;
  }

  return rounded;
}
