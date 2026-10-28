<script>
  /** @type {{name: string, class?: string}} */
  let { name, class: className = 'size-4.5' } = $props();
  /** @type {Record<string, string>} */
  const paths = {
    download: 'M12 3v12m-4-4 4 4 4-4M5 16v5h14v-5',
    recipe: 'M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM9 7h6M9 11h1m3 0h2M9 15h1m3 0h2',
    check: 'm5 12 4 4L19 6',
    chevron: 'm9 5 7 7-7 7',
    chevronDown: 'm6 9 6 6 6-6',
    system: 'M3 4h18v12H3zM8 20h8M12 16v4',
    light: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5',
    dark: 'M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z',
  };
</script>

<svg class={`block shrink-0 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  {#if name === 'families'}
    <circle cx="8" cy="7" r="6" fill="var(--color-clay-yellow)" stroke="none" />
    <circle cx="16" cy="12" r="6" fill="var(--color-clay-cyan)" stroke="none" />
    <circle cx="8" cy="17" r="6" fill="var(--color-clay-pink)" stroke="none" />
  {:else if name === 'filters'}
    <path d="M4 7h16M4 17h16" /><circle cx="9" cy="7" r="3" fill="currentColor" stroke="none" /><circle cx="15" cy="17" r="3" fill="currentColor" stroke="none" />
  {:else}
    <path d={paths[name]} />
  {/if}
</svg>
