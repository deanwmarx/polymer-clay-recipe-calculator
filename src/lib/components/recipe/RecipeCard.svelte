<script>
  import { mixRecipe } from '#lib/colourMixer.js';
  import { contrastColour } from '#lib/colourDisplay.js';
  import RecipeTable from './RecipeTable.svelte';
  import PreparationSteps from './PreparationSteps.svelte';
  /** @type {{swatch: import('#lib/fimo-colours.js').Swatch, grams?: number, element?: HTMLDivElement}} */
  let { swatch, grams = $bindable(10), element = $bindable() } = $props();
  const inputId = $props.id();
  const result = $derived(mixRecipe(swatch.recipe, grams));
</script>

<div bind:this={element} class="space-y-6">
  <div class="flex h-24 w-full items-end rounded-xl border border-line p-3" style:background-color={swatch.hex}>
    <span class="text-sm font-semibold" style:color={contrastColour(swatch.hex)}>{swatch.name}</span>
  </div>
  <div class="space-y-1 text-sm text-body">
    <p class="font-medium">FIMO reference: {swatch.fimoReference}</p>
    <p class="hidden lg:block">{swatch.fimoName}</p>
    <p class="text-xs text-muted">Visual names describe the screen preview; actual clay colours may vary.</p>
  </div>
  <div>
    <label for={inputId} class="mb-1 block text-sm font-medium text-body">Total clay (grams)</label>
    <input id={inputId} data-recipe-weight type="number" inputmode="decimal" bind:value={grams} min="1" step="1"
      class="w-full rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-base leading-none focus:ring-2 focus:ring-focus" />
  </div>
  <section aria-labelledby={`${inputId}-recipe`}>
    <h2 id={`${inputId}-recipe`} class="mb-3 text-sm font-semibold uppercase tracking-widest text-muted">Recipe</h2>
    <RecipeTable {result} />
  </section>
  <section aria-labelledby={`${inputId}-preparation`}>
    <h2 id={`${inputId}-preparation`} class="mb-3 text-sm font-semibold uppercase tracking-widest text-muted">Preparation</h2>
    <PreparationSteps steps={result.steps} />
  </section>
</div>
