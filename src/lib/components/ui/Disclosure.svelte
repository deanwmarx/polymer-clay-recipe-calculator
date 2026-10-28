<script>
  import { slide } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { tick } from 'svelte';
  import { mediaQuery } from '#lib/media.svelte.js';
  import Button from './Button.svelte';
  import Icon from './Icon.svelte';

  /** @type {{title: string, description?: string, variant?: 'compact' | 'panel', desktopOpen?: boolean, open?: boolean, children: import('svelte').Snippet<[() => Promise<void>]>}} */
  let { title, description = '', variant = 'compact', desktopOpen = false, open = $bindable(false), children } = $props();
  const id = $props.id();
  const motion = mediaQuery('(prefers-reduced-motion: reduce)');
  /** @type {HTMLButtonElement | undefined} */
  let trigger = $state();
  async function close() {
    open = false;
    await tick();
    trigger?.focus();
  }
</script>

{#snippet body()}
  <div class={variant === 'panel' ? 'space-y-4 p-3 lg:p-4' : 'max-w-2xl pt-1 text-sm leading-relaxed text-muted'}>
    {@render children(close)}
  </div>
{/snippet}

<div class={variant === 'panel' ? 'rounded-panel border bg-surface-subtle data-[open=true]:border-accent border-line' : ''} data-open={open}>
  <Button bind:element={trigger} variant="plain" size="bare" align="start" radius={variant === 'panel' ? 'panel' : 'control'}
    aria-expanded={open} aria-controls={`${id}-content`} onclick={() => (open = !open)}
    class={variant === 'panel' ? `w-full min-h-16 gap-3 p-3 text-left hover:bg-accent-soft aria-expanded:rounded-b-none aria-expanded:bg-accent-soft aria-expanded:shadow-divider ${desktopOpen ? 'lg:hidden' : ''}` : 'group text-accent-text'}>
    {#if variant === 'panel'}
      <span class="grid size-10 shrink-0 place-items-center rounded-control bg-accent text-on-accent"><Icon name="filters" class="size-5.5" /></span>
      <span class="min-w-0 flex-1"><span class="block text-sm font-bold text-ink">{title}</span>
        <span class="mt-0.5 block text-xs leading-relaxed text-muted">{description}</span></span>
      <Icon name="chevronDown" class={`size-5 text-accent transition-transform duration-240 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`} />
    {:else}
      <span class="inline-flex items-center gap-1 rounded-lg border border-line-strong py-1 pl-1 pr-2.5 text-xs font-medium group-hover:border-accent group-hover:bg-accent-soft transition-colors">
        <Icon name="chevron" class={`size-4 transition-transform duration-240 motion-reduce:transition-none ${open ? 'rotate-90' : ''}`} />{title}
      </span>
    {/if}
  </Button>
  {#if desktopOpen}<div class="hidden lg:block">{@render body()}</div>{/if}
  <div id={`${id}-content`} class={desktopOpen ? 'lg:hidden' : ''}>
    {#if open}
      <div transition:slide={{ duration: motion.current ? 0 : 240, easing: cubicOut }}>
        {@render body()}
      </div>
    {/if}
  </div>
</div>
