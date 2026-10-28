<script>
  import { exportRecipe } from '$lib/exportRecipe.js';
  import RecipeCard from './RecipeCard.svelte';
  import Button from '../ui/Button.svelte';
  import Icon from '../ui/Icon.svelte';
  /** @type {{swatch: import('$lib/fimo-colours.js').Swatch, grams?: number}} */
  let { swatch, grams = $bindable(10) } = $props();
  /** @type {HTMLDivElement | undefined} */
  let card = $state();
  let exporting = $state(false);
  let message = $state('');
  $effect(() => { swatch.id; message = ''; });
  async function download() {
    if (!card || exporting) return;
    exporting = true;
    message = '';
    try {
      await exportRecipe(card, {name: swatch.name, grams});
      message = 'Recipe image ready. Check your downloads.';
    } catch {
      message = 'Could not create the image. Please try again.';
    } finally { exporting = false; }
  }
</script>

<div class="space-y-6">
  <RecipeCard {swatch} bind:grams bind:element={card} />
  <Button onclick={download} loading={exporting} fullWidth class="leading-none" data-html2canvas-ignore="true">
    <Icon name="download" /><span class="block leading-none">{exporting ? 'Creating recipe card…' : 'Download recipe card'}</span>
  </Button>
  {#if message}<p class="text-sm text-body" role="status">{message}</p>{/if}
</div>
