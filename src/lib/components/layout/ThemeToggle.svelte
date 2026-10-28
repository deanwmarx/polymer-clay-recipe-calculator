<script>
  import { onMount } from 'svelte';
  import { mediaQuery } from '$lib/media.svelte.js';
  import Button from '../ui/Button.svelte';
  import Icon from '../ui/Icon.svelte';

  /** @type {'system' | 'light' | 'dark'} */
  let preference = $state('system');
  const systemTheme = mediaQuery('(prefers-color-scheme: dark)');
  const resolvedTheme = $derived(preference === 'system' ? (systemTheme.current ? 'dark' : 'light') : preference);
  let ready = $state(false);
  const options = [
    { value: 'system', label: 'System' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ];

  $effect(() => { if (ready) document.documentElement.dataset.theme = resolvedTheme; });

  /** @param {string} value */
  function chooseTheme(value) {
    preference = value === 'light' || value === 'dark' ? value : 'system';
    try {
      if (preference === 'system') localStorage.removeItem('clay-colour-theme');
      else localStorage.setItem('clay-colour-theme', preference);
    } catch { /* Appearance still works when browser storage is unavailable. */ }
  }

  onMount(() => {
    let saved;
    try { saved = localStorage.getItem('clay-colour-theme'); } catch {}
    preference = saved === 'light' || saved === 'dark' ? saved : 'system';
    ready = true;
    const syncTabs = (/** @type {StorageEvent} */ event) => {
      if (event.key === 'clay-colour-theme' || event.key === null) {
        preference = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : 'system';
      }
    };
    window.addEventListener('storage', syncTabs);
    return () => {
      window.removeEventListener('storage', syncTabs);
    };
  });
</script>

<Button variant="secondary" size="icon" class="lg:hidden"
  aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
  title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
  onclick={() => chooseTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
  <Icon name={resolvedTheme === 'dark' ? 'light' : 'dark'} class="size-5" />
</Button>

<div class="hidden shrink-0 gap-0.5 rounded-control border border-line bg-surface-subtle p-1 lg:flex" role="group" aria-label="Appearance">
  {#each options as option (option.value)}
    <Button variant="theme" size="icon" aria-label={`Use ${option.label.toLowerCase()} appearance`}
      title={`${option.label}${option.value === 'system' ? ' — follow your device' : ' mode'}`}
      aria-pressed={preference === option.value} onclick={() => chooseTheme(option.value)}>
      <Icon name={option.value} />
    </Button>
  {/each}
</div>
