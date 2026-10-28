<script>
  import { mediaQuery } from '#lib/media.svelte.js';
  import AppHeader from '#lib/components/layout/AppHeader.svelte';
  import AppFooter from '#lib/components/layout/AppFooter.svelte';
  import ColourPalette from '#lib/components/palette/ColourPalette.svelte';
  import RecipePanel from '#lib/components/recipe/RecipePanel.svelte';
  import RecipeLauncher from '#lib/components/recipe/RecipeLauncher.svelte';
  import EmptyRecipe from '#lib/components/recipe/EmptyRecipe.svelte';
  import BottomSheet from '#lib/components/ui/BottomSheet.svelte';

  /** @type {import('#lib/fimo-colours.js').Swatch | null} */
  let selected = $state(null);
  let grams = $state(10);
  let sheetOpen = $state(false);
  let filtersOpen = $state(false);
  const mobile = mediaQuery('(max-width: 1023px)');
  $effect(() => { if (!mobile.current) sheetOpen = false; });

  /** @param {import('#lib/fimo-colours.js').Swatch} swatch */
  function selectSwatch(swatch) {
    selected = !mobile.current && selected?.id === swatch.id ? null : swatch;
    if (mobile.current) sheetOpen = true;
  }
</script>

<div class="min-h-screen bg-surface-canvas">
  <AppHeader />
  <div class="flex min-h-[calc(100dvh-172px)] flex-col lg:flex-row">
    <aside class="min-w-0 border-line bg-surface p-4 sm:p-6 lg:w-2/3 lg:border-r">
      <ColourPalette {selected} bind:filtersOpen onselect={selectSwatch} />
    </aside>
    <main class="hidden min-w-0 p-6 lg:sticky lg:top-0 lg:block lg:h-screen lg:w-1/3 lg:overflow-y-auto">
      {#if !mobile.current}
        {#if selected}<RecipePanel swatch={selected} bind:grams />{:else}<EmptyRecipe />{/if}
      {/if}
    </main>
  </div>
  {#if selected}<RecipeLauncher swatch={selected} onclick={() => (sheetOpen = true)} />{/if}
  <AppFooter installBlocked={sheetOpen || filtersOpen} hasSelection={selected !== null} />
</div>

{#if mobile.current}
  <BottomSheet bind:open={sheetOpen} title={`${selected?.name ?? 'Colour'} recipe`}>
    {#if selected}<RecipePanel swatch={selected} bind:grams />{/if}
  </BottomSheet>
{/if}
