// @ts-nocheck -- Executed directly by the Node test runner.
import test from 'node:test';
import assert from 'node:assert/strict';
import { FIMO_SWATCHES, WHEEL_RECIPES } from '../src/lib/fimo-colours.js';
import { mixRecipe } from '../src/lib/colourMixer.js';

const swatch = (id) => FIMO_SWATCHES.find((entry) => entry.id === id);
const weights = (result) => Object.fromEntries(result.lines.map((line) => [line.key, line.grams]));

test('FIMO example: four parts White to one part premixed RI', () => {
  const result = mixRecipe(swatch('RI_P2').recipe, 10);
  assert.deepEqual(weights(result), { W: 8, R: 1.2, M: 0.8 });
  assert.ok(result.steps.some((step) => step.includes('8g White')));
});

test('five parts premixed yellow-orange to one part Black', () => {
  const result = mixRecipe(swatch('YI_D3').recipe, 48.6);
  assert.deepEqual(weights(result), { K: 8.1, Y: 40, R: 0.5 });
});

test('all palette recipes preserve the mass of each premixed portion', () => {
  for (const entry of FIMO_SWATCHES) {
    for (const grams of [1, 10, 37.5, 100]) {
      const totalParts = entry.recipe.reduce((sum, ingredient) => sum + ingredient.parts, 0);
      const expected = {};
      for (const ingredient of entry.recipe) {
        const portion = ingredient.parts / totalParts;
        const base = WHEEL_RECIPES[ingredient.clay] ?? [{ clay: ingredient.clay, parts: 1 }];
        const baseTotal = base.reduce((sum, item) => sum + item.parts, 0);
        for (const item of base) {
          expected[item.clay] = (expected[item.clay] ?? 0) + portion * item.parts / baseTotal;
        }
      }
      const result = mixRecipe(entry.recipe, grams);
      assert.ok(Math.abs(result.lines.reduce((sum, line) => sum + line.grams, 0) - grams) < 1e-9, entry.id);
      for (const line of result.lines) {
        assert.ok(Math.abs(line.percent - expected[line.key] * 100) < 1e-9, entry.id);
        assert.ok(Math.abs(line.grams - expected[line.key] * grams) <= 0.015001, entry.id);
      }
    }
  }
});

test('direct wheel recipes, primary shades and neutrals retain known weights', () => {
  assert.deepEqual(weights(mixRecipe(swatch('YI').recipe, 81)), { Y: 80, R: 1 });
  assert.deepEqual(weights(mixRecipe(swatch('Y_P1').recipe, 21)), { W: 20, Y: 1 });
  assert.deepEqual(weights(mixRecipe(swatch('M_D3').recipe, 6)), { K: 1, M: 5 });
  assert.deepEqual(weights(mixRecipe(swatch('KW10').recipe, 6)), { K: 1, W: 5 });
});
