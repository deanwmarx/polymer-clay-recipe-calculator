/**
 * FIMO True Colours — Swatch Definitions
 *
 * Each swatch has:
 *   - id: unique identifier
 *   - name: human readable label
 *   - family: colour group for UI sectioning
 *   - hex: screen approximation (update with eyedropper later)
 *   - recipe: array of { clay, parts } — the raw Leporello ratios
 *
 * Clay keys: "W" | "K" | "Y" | "R" | "M" | "B" | "G"
 */

// ─── Primary clay colours ─────────────────────────────────────────────────────
export const PRIMARY_HEX = {
  W: "#ffffff",
  K: "#1a1a1a",
  Y: "#ffdc00",
  R: "#e10017",
  M: "#b4167a",
  B: "#006fb4",
  G: "#009776",
};

// ─── Per-swatch hex overrides ─────────────────────────────────────────────────
// All values are pre-populated with derived approximations.
// Replace any value with an eyedropper-sampled hex when ready.
export const SWATCH_HEX_OVERRIDES = {
  // ── Neutrals ─────────────────────────────────────────────────
  W: "#ffffff",
  K: "#1a1a1a",
  KW5: "#4a4a4e",
  KW10: "#66656a",
  KW20: "#858488",
  KW80: "#a6a4a8",
  KW95: "#cac9cc",

  // ── Main Wheel ───────────────────────────────────────────────
  Y: "#ffdc00",
  YI: "#fcc200",
  YII: "#f39100",
  YIII: "#ec6616",
  YIV: "#e5310d",
  R: "#e10017",
  RI: "#ce0f41",
  RII: "#d30064",
  M: "#b4167a",
  MI: "#981876",
  MII: "#613485",
  MIII: "#534495",
  MIV: "#124093",
  MV: "#005ba9",
  B: "#006fb4",
  BI: "#0079a9",
  BII: "#0090a7",
  BIII: "#009088",
  G: "#009776",
  GI: "#008446",
  GII: "#15a236",
  GIII: "#7cb925",
  GIV: "#c7d300",
  GV: "#dddb00",

  // ── Yellow Pastels ───────────────────────────────────────────
  Y_P1: "#fff15d",
  Y_P2: "#ffe336",
  Y_P3: "#ffe10d",
  YI_P1: "#ffea71",
  YI_P2: "#ffde2e",
  YI_P3: "#ffcf00",
  YII_P1: "#ffe462",
  YII_P2: "#fece43",
  YII_P3: "#fbba1e",
  YIII_P1: "#ffda7b",
  YIII_P2: "#fabd5c",
  YIII_P3: "#f18723",
  YIV_P1: "#f9c29c",
  YIV_P2: "#f39768",
  YIV_P3: "#ec662e",

  // ── Yellow Darks ─────────────────────────────────────────────
  Y_D1: "#b9b909",
  Y_D2: "#8a8f23",
  Y_D3: "#4f5a2a",
  YI_D1: "#b8b034",
  YI_D2: "#808527",
  YI_D3: "#586229",
  YII_D1: "#bf9514",
  YII_D2: "#8a812e",
  YII_D3: "#45532b",
  YIII_D1: "#c46a19",
  YIII_D2: "#8a6424",
  YIII_D3: "#5b5127",
  YIV_D1: "#b7401d",
  YIV_D2: "#893c23",
  YIV_D3: "#4c3125",

  // ── Red Pastels ──────────────────────────────────────────────
  R_P1: "#f7c4d3",
  R_P2: "#ee7993",
  R_P3: "#e84164",
  RI_P1: "#f5b7cd",
  RI_P2: "#ee799d",
  RI_P3: "#ea507d",
  RII_P1: "#efb2d1",
  RII_P2: "#e784b5",
  RII_P3: "#da4f97",

  // ── Red Darks ────────────────────────────────────────────────
  R_D1: "#b62a34",
  R_D2: "#892c35",
  R_D3: "#4a2932",
  RI_D1: "#b32a46",
  RI_D2: "#893543",
  RI_D3: "#553139",
  RII_D1: "#a61d53",
  RII_D2: "#79244c",
  RII_D3: "#4d3046",

  // ── Magenta Pastels ──────────────────────────────────────────
  M_P1: "#ebb1d1",
  M_P2: "#de7bb0",
  M_P3: "#d24994",
  MI_P1: "#e3b6d6",
  MI_P2: "#c47db3",
  MI_P3: "#af5199",
  MII_P1: "#dbbedd",
  MII_P2: "#b597c7",
  MII_P3: "#9769aa",
  MIII_P1: "#d1cde7",
  MIII_P2: "#aca3d0",
  MIII_P3: "#7b6daf",
  MIV_P1: "#c7d8f0",
  MIV_P2: "#8faedc",
  MIV_P3: "#638ac7",
  MV_P1: "#c1e0f5",
  MV_P2: "#7ac5ea",
  MV_P3: "#318fce",

  // ── Magenta Darks ────────────────────────────────────────────
  M_D1: "#9d1d67",
  M_D2: "#793460",
  M_D3: "#4a2842",
  MI_D1: "#851e70",
  MI_D2: "#702c63",
  MI_D3: "#422842",
  MII_D1: "#563574",
  MII_D2: "#513063",
  MII_D3: "#422846",
  MIII_D1: "#41357a",
  MIII_D2: "#3d3369",
  MIII_D3: "#292644",
  MIV_D1: "#133e86",
  MIV_D2: "#133868",
  MIV_D3: "#102e4b",
  MV_D1: "#00538a",
  MV_D2: "#004c71",
  MV_D3: "#05314e",

  // ── Blue Pastels ─────────────────────────────────────────────
  B_P1: "#abd8e9",
  B_P2: "#60bee5",
  B_P3: "#00aada",
  BI_P1: "#a2d8e6",
  BI_P2: "#60c3d8",
  BI_P3: "#00aed1",
  BII_P1: "#a9d9df",
  BII_P2: "#4bbcc9",
  BII_P3: "#00abb8",
  BIII_P1: "#a4d6d8",
  BIII_P2: "#63c2c7",
  BIII_P3: "#00a09c",

  // ── Blue Darks ───────────────────────────────────────────────
  B_D1: "#00689c",
  B_D2: "#005073",
  B_D3: "#003d4a",
  BI_D1: "#00678a",
  BI_D2: "#005569",
  BI_D3: "#003b44",
  BII_D1: "#006c81",
  BII_D2: "#00555e",
  BII_D3: "#1c3a3b",
  BIII_D1: "#008281",
  BIII_D2: "#005a5a",
  BIII_D3: "#1a3834",

  // ── Green Pastels ────────────────────────────────────────────
  G_P1: "#a0d3c7",
  G_P2: "#52baab",
  G_P3: "#00a893",
  GI_P1: "#aed7bc",
  GI_P2: "#8ac9ad",
  GI_P3: "#00a76d",
  GII_P1: "#b8d37c",
  GII_P2: "#95c354",
  GII_P3: "#63b338",
  GIII_P1: "#dbe282",
  GIII_P2: "#bad042",
  GIII_P3: "#a1c518",
  GIV_P1: "#f2ea6e",
  GIV_P2: "#e7e248",
  GIV_P3: "#dddc00",
  GV_P1: "#f6ec74",
  GV_P2: "#f9eb55",
  GV_P3: "#f1e500",

  // ── Green Darks ──────────────────────────────────────────────
  G_D1: "#007161",
  G_D2: "#005a48",
  G_D3: "#1e3b33",
  GI_D1: "#00703a",
  GI_D2: "#005933",
  GI_D3: "#11442c",
  GII_D1: "#2e9336",
  GII_D2: "#3c7732",
  GII_D3: "#2b502d",
  GIII_D1: "#77af38",
  GIII_D2: "#6c8f27",
  GIII_D3: "#43582b",
  GIV_D1: "#a1ab1d",
  GIV_D2: "#7f8c26",
  GIV_D3: "#45532b",
  GV_D1: "#c0b900",
  GV_D2: "#8a8f23",
  GV_D3: "#4e5e2a",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0"))
      .join("")
  );
}

/**
 * Blend hex colours by parts (subtractive approximation via RGB averaging).
 * @param {{ hex: string, parts: number }[]} inputs
 * @returns {string}
 */
function blendHex(inputs) {
  const total = inputs.reduce((s, i) => s + i.parts, 0);
  let r = 0,
    g = 0,
    b = 0;
  for (const { hex, parts } of inputs) {
    const c = hexToRgb(hex);
    r += c.r * (parts / total);
    g += c.g * (parts / total);
    b += c.b * (parts / total);
  }
  return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
}

/**
 * Derive hex from a recipe using PRIMARY_HEX as base colours.
 * @param {{ clay: string, parts: number }[]} recipe
 * @returns {string}
 */
function deriveHex(recipe) {
  return blendHex(
    recipe.map(({ clay, parts }) => ({ hex: PRIMARY_HEX[clay], parts })),
  );
}

// ─── Intermediate wheel colour ratios (from Leporello) ────────────────────────
export const WHEEL_RECIPES = {
  Y: [{ clay: "Y", parts: 1 }],
  YI: [
    { clay: "Y", parts: 80 },
    { clay: "R", parts: 1 },
  ],
  YII: [
    { clay: "Y", parts: 20 },
    { clay: "R", parts: 1 },
  ],
  YIII: [
    { clay: "Y", parts: 4 },
    { clay: "R", parts: 1 },
  ],
  YIV: [
    { clay: "Y", parts: 2 },
    { clay: "R", parts: 3 },
  ],
  R: [{ clay: "R", parts: 1 }],
  RI: [
    { clay: "R", parts: 3 },
    { clay: "M", parts: 2 },
  ],
  RII: [
    { clay: "R", parts: 1 },
    { clay: "M", parts: 4 },
  ],
  M: [{ clay: "M", parts: 1 }],
  MI: [
    { clay: "M", parts: 20 },
    { clay: "B", parts: 1 },
  ],
  MII: [
    { clay: "M", parts: 4 },
    { clay: "B", parts: 1 },
  ],
  MIII: [
    { clay: "M", parts: 3 },
    { clay: "B", parts: 2 },
  ],
  MIV: [
    { clay: "M", parts: 3 },
    { clay: "B", parts: 7 },
  ],
  MV: [
    { clay: "M", parts: 1 },
    { clay: "B", parts: 9 },
  ],
  B: [{ clay: "B", parts: 1 }],
  BI: [
    { clay: "B", parts: 9 },
    { clay: "G", parts: 1 },
  ],
  BII: [
    { clay: "B", parts: 7 },
    { clay: "G", parts: 3 },
  ],
  BIII: [
    { clay: "B", parts: 2 },
    { clay: "G", parts: 3 },
  ],
  G: [{ clay: "G", parts: 1 }],
  GI: [
    { clay: "G", parts: 9 },
    { clay: "Y", parts: 1 },
  ],
  GII: [
    { clay: "G", parts: 2 },
    { clay: "Y", parts: 3 },
  ],
  GIII: [
    { clay: "G", parts: 1 },
    { clay: "Y", parts: 9 },
  ],
  GIV: [
    { clay: "G", parts: 1 },
    { clay: "Y", parts: 40 },
  ],
  GV: [
    { clay: "G", parts: 1 },
    { clay: "Y", parts: 120 },
  ],
};

// ─── Swatch builder ───────────────────────────────────────────────────────────

/**
 * @typedef {Object} Swatch
 * @property {string} id
 * @property {string} name
 * @property {string} family
 * @property {string} hex
 * @property {{ clay: string, parts: number }[]} recipe
 */

/** @returns {Swatch} */
function makeSwatch(id, name, family, recipe) {
  const hex = SWATCH_HEX_OVERRIDES[id] ?? deriveHex(recipe);
  return { id, name, family, hex, recipe };
}

// ─── Neutral swatches ─────────────────────────────────────────────────────────
const neutrals = [
  makeSwatch("W", "White", "Neutrals", [{ clay: "W", parts: 1 }]),
  makeSwatch("K", "Black", "Neutrals", [{ clay: "K", parts: 1 }]),
  makeSwatch("KW5", "Near Black", "Neutrals", [
    { clay: "K", parts: 1 },
    { clay: "W", parts: 1 },
  ]),
  makeSwatch("KW10", "Dark Grey", "Neutrals", [
    { clay: "K", parts: 1 },
    { clay: "W", parts: 5 },
  ]),
  makeSwatch("KW20", "Mid Grey", "Neutrals", [
    { clay: "K", parts: 1 },
    { clay: "W", parts: 10 },
  ]),
  makeSwatch("KW80", "Light Grey", "Neutrals", [
    { clay: "K", parts: 1 },
    { clay: "W", parts: 20 },
  ]),
  makeSwatch("KW95", "Pale Grey", "Neutrals", [
    { clay: "K", parts: 1 },
    { clay: "W", parts: 80 },
  ]),
];

// ─── Main wheel swatches (pure) ───────────────────────────────────────────────
export const WHEEL_NAMES = {
  Y: "True Yellow",
  YI: "Yellow-Orange I",
  YII: "Yellow-Orange II",
  YIII: "Yellow-Orange III",
  YIV: "Yellow-Orange IV",
  R: "True Red",
  RI: "Red-Magenta I",
  RII: "Red-Magenta II",
  M: "True Magenta",
  MI: "Magenta-Blue I",
  MII: "Magenta-Blue II",
  MIII: "Magenta-Blue III",
  MIV: "Magenta-Blue IV",
  MV: "Magenta-Blue V",
  B: "True Blue",
  BI: "Blue-Green I",
  BII: "Blue-Green II",
  BIII: "Blue-Green III",
  G: "True Green",
  GI: "Green-Yellow I",
  GII: "Green-Yellow II",
  GIII: "Green-Yellow III",
  GIV: "Green-Yellow IV",
  GV: "Green-Yellow V",
};

const WHEEL_FAMILIES = {
  Y: "Yellow",
  YI: "Yellow",
  YII: "Yellow",
  YIII: "Yellow",
  YIV: "Yellow",
  R: "Red",
  RI: "Red",
  RII: "Red",
  M: "Magenta",
  MI: "Magenta",
  MII: "Magenta",
  MIII: "Magenta",
  MIV: "Magenta",
  MV: "Magenta",
  B: "Blue",
  BI: "Blue",
  BII: "Blue",
  BIII: "Blue",
  G: "Green",
  GI: "Green",
  GII: "Green",
  GIII: "Green",
  GIV: "Green",
  GV: "Green",
};

const mainWheel = Object.entries(WHEEL_RECIPES).map(([key, recipe]) =>
  makeSwatch(key, WHEEL_NAMES[key], WHEEL_FAMILIES[key], recipe),
);

// ─── Pastel swatches (W + colour) ─────────────────────────────────────────────
const PASTEL_LEVELS = [
  { suffix: "_P1", label: "Pastel Light", wParts: 20 },
  { suffix: "_P2", label: "Pastel Medium", wParts: 4 },
  { suffix: "_P3", label: "Pastel Deep", wParts: 1 },
];

const pastels = [];
for (const [key] of Object.entries(WHEEL_RECIPES)) {
  const family = WHEEL_FAMILIES[key];
  const baseName = WHEEL_NAMES[key];
  for (const { suffix, label, wParts } of PASTEL_LEVELS) {
    const recipe = [
      { clay: "W", parts: wParts },
      { clay: key, parts: 1 },
    ];
    pastels.push(
      makeSwatch(
        `${key}${suffix}`,
        `${baseName} — ${label}`,
        `${family} Pastels`,
        recipe,
      ),
    );
  }
}

// ─── Dark swatches (K + colour) ───────────────────────────────────────────────
const DARK_LEVELS = [
  { suffix: "_D1", label: "Dark Shade Light", cParts: 80 },
  { suffix: "_D2", label: "Dark Shade Medium", cParts: 20 },
  { suffix: "_D3", label: "Dark Shade Deep", cParts: 5 },
];

const darks = [];
for (const [key] of Object.entries(WHEEL_RECIPES)) {
  const family = WHEEL_FAMILIES[key];
  const baseName = WHEEL_NAMES[key];
  for (const { suffix, label, cParts } of DARK_LEVELS) {
    const recipe = [
      { clay: "K", parts: 1 },
      { clay: key, parts: cParts },
    ];
    darks.push(
      makeSwatch(
        `${key}${suffix}`,
        `${baseName} — ${label}`,
        `${family} Darks`,
        recipe,
      ),
    );
  }
}

// ─── Full palette export ──────────────────────────────────────────────────────
export const FIMO_SWATCHES = [...neutrals, ...mainWheel, ...pastels, ...darks];

/** Index all swatches by id for fast lookup */
const SWATCH_BY_ID = Object.fromEntries(FIMO_SWATCHES.map((s) => [s.id, s]));

/**
 * @typedef {Object} ColourRow
 * @property {string} key       - Wheel colour key e.g. "GIII"
 * @property {string} name      - Display name e.g. "Green-Yellow III"
 * @property {string} group     - Filter group e.g. "Yellow"
 * @property {Swatch} main      - The main wheel swatch
 * @property {Swatch[]} pastels - [P1, P2, P3] lightest to deepest
 * @property {Swatch[]} darks   - [D1, D2, D3] lightest to deepest
 */

/**
 * Palette arranged as rows matching the Leporello PDF layout.
 * Each row: P1 | P2 | P3 | Main | D1 | D2 | D3
 */
export const COLOUR_ROWS = Object.keys(WHEEL_RECIPES).map((key) => ({
  key,
  name: WHEEL_NAMES[key],
  group: WHEEL_FAMILIES[key],
  main: SWATCH_BY_ID[key],
  pastels: [
    SWATCH_BY_ID[`${key}_P1`],
    SWATCH_BY_ID[`${key}_P2`],
    SWATCH_BY_ID[`${key}_P3`],
  ],
  darks: [
    SWATCH_BY_ID[`${key}_D1`],
    SWATCH_BY_ID[`${key}_D2`],
    SWATCH_BY_ID[`${key}_D3`],
  ],
}));

/** Neutral swatches as a flat array (no pastel/dark variants). */
export const NEUTRAL_SWATCHES = neutrals;

/** Unique filter groups in display order. */
export const COLOUR_GROUPS = [
  "Neutrals",
  "Yellow",
  "Red",
  "Magenta",
  "Blue",
  "Green",
];
