<script>
  import { COLOUR_GROUPS } from '$lib/fimo-colours.js';
  import Button from '../ui/Button.svelte';
  import Icon from '../ui/Icon.svelte';
  import Disclosure from '../ui/Disclosure.svelte';

  /** @type {{all: boolean, groups: string[], shade?: string, open?: boolean, count: number, onall: () => void, ontoggle: (group: string) => void}} */
  let { all, groups, shade = $bindable('All shades'), open = $bindable(false), count, onall, ontoggle } = $props();
  /** @type {Record<string, string>} */
  const tones = { Neutrals: 'var(--content-muted)', Yellow: 'var(--color-clay-yellow)', Red: 'var(--color-clay-red)', Magenta: 'var(--color-clay-pink)', Blue: 'var(--color-clay-cyan)', Green: 'var(--color-clay-lime)' };
  const shades = [
    { name: 'All shades', sample: 'bg-linear-135 from-clay-pink-soft from-33% via-clay-pink via-33% to-clay-pink-deep to-66%' },
    { name: 'Pastels', sample: 'bg-clay-pink-soft' },
    { name: 'Main colours', sample: 'bg-clay-pink' },
    { name: 'Dark shades', sample: 'bg-clay-pink-deep' },
  ];
</script>

<Disclosure title="Palette filters" description={`${all ? 'All families' : groups.join(', ')} · ${shade}`} variant="panel" desktopOpen bind:open>
  {#snippet children(close)}
    <fieldset>
      <legend class="mb-3 text-xs font-bold uppercase tracking-wider text-muted">FIMO families</legend>
      <div class="flex flex-wrap gap-2">
        <Button variant="filter" size="compact" aria-pressed={all} onclick={onall}><Icon name="families" />All colours</Button>
        {#each COLOUR_GROUPS as group (group)}
          <Button variant="filter" size="compact" aria-pressed={!all && groups.includes(group)} onclick={() => ontoggle(group)} style={`--family-colour: ${tones[group]}`}>
            <span class="size-3.5 shrink-0 rounded-full bg-family" aria-hidden="true"></span>{group}
            <span class="inline-flex w-0 shrink-0 -ml-2 -translate-x-1 overflow-hidden opacity-0 transition-[width,margin-left,opacity,transform] duration-220 ease-out group-aria-pressed:w-3.5 group-aria-pressed:ml-0 group-aria-pressed:translate-x-0 group-aria-pressed:opacity-100 motion-reduce:transition-none" aria-hidden="true"><Icon name="check" class="size-3.5" /></span>
          </Button>
        {/each}
      </div>
    </fieldset>
    <fieldset class="lg:hidden">
      <legend class="mb-3 text-xs font-bold uppercase tracking-wider text-muted">Shades</legend>
      <div class="grid grid-cols-2 gap-1 rounded-panel border border-line p-1">
        {#each shades as option (option.name)}
          <Button variant="shade" size="shade" align="start" aria-pressed={shade === option.name} onclick={() => (shade = option.name)}><span class={`size-4.5 shrink-0 rounded-md ${option.sample}`} aria-hidden="true"></span>{option.name}</Button>
        {/each}
      </div>
    </fieldset>
    <Button fullWidth class="lg:hidden" onclick={close}>Explore {count} colours <span aria-hidden="true">→</span></Button>
  {/snippet}
</Disclosure>
