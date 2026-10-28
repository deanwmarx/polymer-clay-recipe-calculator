/**
 * Visual descriptions of the current screen swatches, not official FIMO names.
 * Keep these curated names in step with any future changes to the hex colours.
 * Row order: pastel light, pastel medium, pastel deep, main, dark light,
 * dark medium, dark deep. FIMO codes and recipes remain separate metadata.
 */
/** @type {Record<string, string[]>} */
const VISUAL_ROWS = {
  Y: ['Primrose', 'Lemon Yellow', 'Bright Yellow', 'Golden Yellow', 'Mustard', 'Olive', 'Dark Olive'],
  YI: ['Butter Yellow', 'Sunshine Yellow', 'Marigold', 'Amber Yellow', 'Khaki', 'Olive Drab', 'Deep Olive'],
  YII: ['Pale Gold', 'Honey Yellow', 'Goldenrod', 'Golden Orange', 'Ochre', 'Muted Olive', 'Army Green'],
  YIII: ['Apricot Cream', 'Apricot', 'Tangerine', 'Burnt Orange', 'Copper', 'Umber', 'Olive Brown'],
  YIV: ['Peach', 'Salmon', 'Coral Orange', 'Vermilion', 'Rust', 'Terracotta', 'Dark Brown'],
  R: ['Blush Pink', 'Rose Pink', 'Cerise', 'Crimson Red', 'Brick Red', 'Burgundy', 'Black Cherry'],
  RI: ['Powder Pink', 'Candy Pink', 'Raspberry Pink', 'Ruby Red', 'Wine Red', 'Dusty Burgundy', 'Deep Burgundy'],
  RII: ['Orchid Pink', 'Rose Mauve', 'Deep Rose', 'Hot Pink', 'Mulberry', 'Plum', 'Dark Plum'],
  M: ['Petal Pink', 'Orchid Rose', 'Fuchsia Rose', 'Magenta', 'Berry', 'Muted Plum', 'Aubergine'],
  MI: ['Pale Orchid', 'Dusty Orchid', 'Orchid Purple', 'Red Violet', 'Berry Purple', 'Muted Grape', 'Deep Aubergine'],
  MII: ['Pale Lilac', 'Lilac', 'Amethyst', 'Violet', 'Grape', 'Deep Grape', 'Smoky Purple'],
  MIII: ['Lavender Mist', 'Lavender', 'Iris', 'Blue Violet', 'Deep Violet', 'Dark Iris', 'Midnight Violet'],
  MIV: ['Ice Blue', 'Periwinkle Blue', 'Cornflower Blue', 'Royal Blue', 'Cobalt Blue', 'Navy Blue', 'Midnight Blue'],
  MV: ['Powder Blue', 'Sky Blue', 'Azure', 'Deep Azure', 'Prussian Blue', 'Petrol Blue', 'Ink Blue'],
  B: ['Pale Sky Blue', 'Clear Sky Blue', 'Cyan Blue', 'Ocean Blue', 'Deep Ocean Blue', 'Dark Petrol Blue', 'Midnight Teal'],
  BI: ['Ice Turquoise', 'Soft Turquoise', 'Bright Cyan', 'Cerulean', 'Deep Cerulean', 'Petrol Teal', 'Blackened Teal'],
  BII: ['Pale Aqua', 'Aqua', 'Turquoise', 'Deep Turquoise', 'Deep Blue Teal', 'Dark Blue Teal', 'Charcoal Teal'],
  BIII: ['Sea Mist', 'Soft Aqua', 'Bright Teal', 'Teal', 'Deep Teal', 'Dark Teal', 'Deep Pine'],
  G: ['Pale Mint', 'Seafoam', 'Jade', 'Jade Green', 'Deep Jade', 'Dark Jade', 'Pine Green'],
  GI: ['Mint Cream', 'Soft Mint', 'Emerald', 'Emerald Green', 'Deep Emerald', 'Forest Green', 'Dark Forest Green'],
  GII: ['Pistachio', 'Soft Leaf Green', 'Fresh Leaf Green', 'Grass Green', 'Leaf Green', 'Moss Green', 'Dark Moss Green'],
  GIII: ['Pale Lime', 'Soft Lime', 'Bright Lime', 'Apple Green', 'Fern Green', 'Avocado Green', 'Deep Moss'],
  GIV: ['Lemon Cream', 'Citron Yellow', 'Bright Citron', 'Chartreuse', 'Olive Yellow', 'Muted Avocado', 'Woodland Green'],
  GV: ['Pale Lemon', 'Soft Lemon', 'Lemon Lime', 'Citron', 'Golden Mustard', 'Yellow Olive', 'Military Olive'],
};

const POSITIONS = ['_P1', '_P2', '_P3', '', '_D1', '_D2', '_D3'];

/** @type {Record<string, string>} */
export const VISUAL_COLOUR_NAMES = Object.fromEntries(
  Object.entries(VISUAL_ROWS).flatMap(([key, names]) =>
    names.map((name, index) => [`${key}${POSITIONS[index]}`, name]),
  ),
);
