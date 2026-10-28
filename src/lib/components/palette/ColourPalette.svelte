<script>
  import { COLOUR_ROWS, NEUTRAL_SWATCHES } from '#lib/fimo-colours.js';
  import PaletteFilters from './PaletteFilters.svelte';
  import ColourSwatch from './ColourSwatch.svelte';
  import Button from '../ui/Button.svelte';
  /** @type {{selected: import('#lib/fimo-colours.js').Swatch | null, filtersOpen?: boolean, onselect: (swatch: import('#lib/fimo-colours.js').Swatch) => void}} */
  let { selected, filtersOpen = $bindable(false), onselect } = $props();
  let all = $state(true);
  /** @type {string[]} */
  let groups = $state([]);
  let shade = $state('All shades');
  const rows = $derived(all ? COLOUR_ROWS : COLOUR_ROWS.filter((row) => groups.includes(row.group)));
  const showNeutrals = $derived(all || groups.includes('Neutrals'));
  const sections = $derived([
    ...(showNeutrals && ['All shades', 'Main colours'].includes(shade) ? [{title:'Neutrals', swatches:NEUTRAL_SWATCHES}] : []),
    ...[
      {title:'Pastels', swatches:rows.flatMap((row) => row.pastels)},
      {title:'Main colours', swatches:rows.map((row) => row.main)},
      {title:'Dark shades', swatches:rows.flatMap((row) => row.darks)},
    ].filter((section) => section.swatches.length && (shade === 'All shades' || shade === section.title)),
  ]);
  const count = $derived(sections.reduce((sum, section) => sum + section.swatches.length, 0));
  function selectAll() { all = true; groups = []; }
  /** @param {string} group */
  function toggleGroup(group) {
    if (all) { all = false; groups = [group]; return; }
    groups = groups.includes(group) ? groups.filter((value) => value !== group) : [...groups, group];
    if (!groups.length) all = true;
  }
</script>

<div class="space-y-5">
  <PaletteFilters {all} {groups} bind:shade bind:open={filtersOpen} {count} onall={selectAll} ontoggle={toggleGroup} />
  <p class="text-xs text-muted">Families follow the FIMO chart. Select a colour to see its recipe.</p>
  <div class="space-y-6 lg:hidden">
    <p class="text-sm text-muted" aria-live="polite">{count} colours</p>
    {#each sections as section (section.title)}
      <section aria-label={section.title}>
        <h2 class="mb-3 text-sm font-semibold text-body">{section.title}</h2>
        <div class="grid grid-cols-3 gap-x-3 gap-y-4">
          {#each section.swatches as swatch (swatch.id)}<ColourSwatch {swatch} selected={selected?.id === swatch.id} {onselect} />{/each}
        </div>
      </section>
    {:else}
      <div class="space-y-3 rounded-xl bg-surface-subtle p-5 text-sm text-body">
        <p>Neutrals have no pastel or dark variants. Choose main colours to see them.</p>
        <Button onclick={() => (shade = 'Main colours')}>Show main colours</Button>
      </div>
    {/each}
  </div>
  <div class="hidden space-y-4 lg:block">
    {#if showNeutrals}
      <div class="flex items-center justify-center gap-4">
        {#each NEUTRAL_SWATCHES as swatch (swatch.id)}<ColourSwatch {swatch} mode="compact" selected={selected?.id === swatch.id} {onselect} />{/each}
      </div>
    {/if}
    {#each rows as row (row.key)}
      <div class="flex items-center justify-center gap-4">
        {#each [...row.pastels, row.main, ...row.darks] as swatch (swatch.id)}<ColourSwatch {swatch} mode="compact" selected={selected?.id === swatch.id} {onselect} />{/each}
      </div>
    {/each}
  </div>
</div>
