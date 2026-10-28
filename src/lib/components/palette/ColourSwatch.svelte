<script>
  import { contrastColour } from '$lib/colourDisplay.js';
  /** @type {{swatch: import('$lib/fimo-colours.js').Swatch, selected?: boolean, mode?: 'named' | 'compact', onselect: (swatch: import('$lib/fimo-colours.js').Swatch) => void}} */
  let { swatch, selected = false, mode = 'named', onselect } = $props();
</script>

<button onclick={() => onselect(swatch)} aria-pressed={selected}
  title={`${swatch.name} — ${swatch.fimoName} · FIMO ${swatch.fimoReference}`}
  aria-label={`${swatch.name} — ${swatch.fimoName} · FIMO ${swatch.fimoReference}`}
  class={mode === 'named' ? 'min-w-0 rounded-lg text-left cursor-pointer' : `flex size-16 shrink-0 flex-col items-center justify-center rounded p-0.5 ring-offset-2 ring-offset-surface transition-transform duration-300 motion-reduce:transition-none cursor-pointer ${selected ? 'scale-110 ring-2 ring-accent' : 'hover:scale-95'}`}
  style:background-color={mode === 'compact' ? swatch.hex : undefined}>
  {#if mode === 'named'}
    <span class={`block aspect-square rounded-xl border border-line ${selected ? 'ring-2 ring-accent ring-offset-2 ring-offset-surface' : ''}`} style:background-color={swatch.hex}></span>
    <span class="mt-2 block text-xs font-medium leading-snug text-ink">{swatch.name}</span>
  {:else}
    {#each swatch.recipe as {clay, parts}, index (clay)}
      <span class={`text-center text-xs leading-none ${selected ? 'font-bold' : 'font-normal'}`} style:color={contrastColour(swatch.hex)}>
        {#if index > 0}<span>+</span>{/if}{parts}{clay}
      </span>
    {/each}
  {/if}
</button>
