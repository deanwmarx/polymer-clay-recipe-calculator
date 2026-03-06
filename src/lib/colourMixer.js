import { WHEEL_NAMES, WHEEL_RECIPES } from "./fimo-colours.js";

/**
 * @typedef {{ clay: string, parts: number }[]} Recipe
 *
 * @typedef {Object} RecipeLine
 * @property {string} clay     - Full clay name e.g. "True Yellow"
 * @property {string} key      - Clay key e.g. "Y"
 * @property {number} parts    - Raw parts from Leporello
 * @property {number} percent  - Percentage of total
 * @property {number} grams    - Exact grams
 *
 * @typedef {Object} MixResult
 * @property {RecipeLine[]} lines
 * @property {string[]} steps
 * @property {number} totalGrams
 */

const PRIMARY_CLAY_NAMES = {
  W: "White",
  K: "Black",
  Y: "True Yellow",
  R: "True Red",
  M: "True Magenta",
  B: "True Blue",
  G: "True Green",
};

/**
 * Check if a clay key is a compound wheel colour (not a primary).
 * @param {string} key
 * @returns {boolean}
 */
function isCompoundKey(key) {
  return key in WHEEL_RECIPES && !(key in PRIMARY_CLAY_NAMES);
}

/**
 * Expand a recipe, replacing compound wheel keys with their primary components.
 * @param {Recipe} recipe
 * @returns {Recipe}
 */
function expandRecipe(recipe) {
  /** @type {Record<string, number>} */
  const result = {};
  for (const { clay, parts } of recipe) {
    if (isCompoundKey(clay)) {
      // Expand compound key into primaries, scaled by parts
      for (const { clay: subClay, parts: subParts } of WHEEL_RECIPES[clay]) {
        result[subClay] = (result[subClay] ?? 0) + subParts * parts;
      }
    } else {
      result[clay] = (result[clay] ?? 0) + parts;
    }
  }
  return Object.entries(result).map(([clay, parts]) => ({ clay, parts }));
}

/**
 * Given a swatch recipe and a payload in grams, produce a full mix result.
 * @param {Recipe} recipe
 * @param {number} payloadGrams
 * @returns {MixResult}
 */
export function mixRecipe(recipe, payloadGrams) {
  // Expand compound wheel keys into primaries for gram calculations
  const expanded = expandRecipe(recipe);

  // Collapse duplicate clay keys
  /** @type {Record<string, number>} */
  const collapsed = {};
  for (const { clay, parts } of expanded) {
    collapsed[clay] = (collapsed[clay] ?? 0) + parts;
  }

  const totalParts = Object.values(collapsed).reduce((s, p) => s + p, 0);

  /** @type {RecipeLine[]} */
  const lines = Object.entries(collapsed)
    .filter(([, parts]) => parts > 0)
    .map(([key, parts]) => ({
      clay: PRIMARY_CLAY_NAMES[key] ?? key,
      key,
      parts,
      percent: (parts / totalParts) * 100,
      grams: roundGrams((parts / totalParts) * payloadGrams),
    }));

  // Fix rounding drift on largest component
  const gramsSum = lines.reduce((s, l) => s + l.grams, 0);
  const drift = parseFloat((payloadGrams - gramsSum).toFixed(2));
  if (Math.abs(drift) >= 0.01) {
    const largest = lines.reduce((a, b) => (a.parts > b.parts ? a : b));
    largest.grams = roundGrams(largest.grams + drift);
  }

  // Build steps using the original (unexpanded) recipe to preserve compound keys
  const steps = buildSteps(lines, recipe);

  return { lines, steps, totalGrams: payloadGrams };
}

/**
 * Round to 2 decimal places.
 * @param {number} v
 * @returns {number}
 */
function roundGrams(v) {
  return Math.round(v * 100) / 100;
}

/**
 * Build preparation steps from recipe lines.
 * Uses the original (unexpanded) recipe to detect compound colours and
 * generate proper two-step instructions matching the Leporello.
 * @param {RecipeLine[]} lines - Expanded recipe lines with grams
 * @param {Recipe} originalRecipe - Original recipe (may contain compound keys)
 * @returns {string[]}
 */
function buildSteps(lines, originalRecipe) {
  const chromatic = lines.filter((l) => !["W", "K"].includes(l.key));
  const white = lines.find((l) => l.key === "W");
  const black = lines.find((l) => l.key === "K");

  // Detect if the original recipe uses a compound wheel colour
  const compoundEntry = originalRecipe.find((e) => isCompoundKey(e.clay));

  const steps = [];

  if (chromatic.length === 0 && white && !black) {
    steps.push("Use White clay as-is. No mixing required.");
    return steps;
  }
  if (chromatic.length === 0 && black && !white) {
    steps.push("Use Black clay as-is. No mixing required.");
    return steps;
  }
  if (chromatic.length === 0 && white && black) {
    steps.push(`Weigh out ${white.grams}g White and ${black.grams}g Black.`);
    steps.push("Mix White and Black together until uniform to produce grey.");
    return steps;
  }

  if (compoundEntry) {
    // Two-step process: first mix the wheel colour, then add W/K
    const wheelKey = compoundEntry.clay;
    const wheelName = WHEEL_NAMES[wheelKey] ?? wheelKey;
    const wheelRecipe = WHEEL_RECIPES[wheelKey];
    const subRecipeStr = wheelRecipe
      .map((e) => `${e.parts} ${PRIMARY_CLAY_NAMES[e.clay] ?? e.clay}`)
      .join(" + ");

    // Step 1 — weigh chromatic clays for the wheel colour
    const chromaticList = chromatic
      .map((l) => `${l.grams}g ${l.clay}`)
      .join(", ");
    steps.push(`Weigh out the chromatic clays: ${chromaticList}.`);

    // Step 2 — mix chromatic clays to form the wheel colour
    if (chromatic.length > 1) {
      steps.push(
        `Mix the chromatic clays together to produce ${wheelName} (ratio: ${subRecipeStr}). Knead until the colour is fully uniform.`,
      );
    }

    // Step 3 — add white or black
    if (white) {
      steps.push(
        `Weigh out ${white.grams}g White. Add White to the ${wheelName} mix gradually and knead until fully blended.`,
      );
    }
    if (black) {
      steps.push(
        `Weigh out ${black.grams}g Black. Add Black to the ${wheelName} mix in small increments — it is very dominant. Knead thoroughly between each addition.`,
      );
    }
  } else {
    // Simple recipe — all primaries
    const chromaticList = chromatic
      .map((l) => `${l.grams}g ${l.clay}`)
      .join(", ");
    steps.push(`Weigh out the chromatic clays: ${chromaticList}.`);

    if (chromatic.length > 1) {
      steps.push(
        "Mix all chromatic clays together thoroughly until the colour is fully uniform. Work from the largest amount to the smallest.",
      );
    }

    if (white) {
      steps.push(
        `Weigh out ${white.grams}g White. Add White to the chromatic mix gradually and knead until fully blended.`,
      );
    }

    if (black) {
      steps.push(
        `Weigh out ${black.grams}g Black. Add Black last in small increments — it is very dominant. Knead thoroughly between each addition.`,
      );
    }
  }

  steps.push(
    "Continue kneading the full mix until the colour is completely even with no streaks.",
  );

  return steps;
}
