<script>
  import Button from '../ui/Button.svelte';
  import Icon from '../ui/Icon.svelte';
  /** @type {{swatch: import('#lib/fimo-colours.js').Swatch, onclick: () => void}} */
  let { swatch, onclick } = $props();
</script>
<div class="sticky bottom-0 z-10 border-t border-line bg-surface/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm lg:hidden">
  <Button {onclick} align="between" fullWidth>
    <span class="flex min-w-0 items-center gap-2"><span class="size-6 shrink-0 rounded-md border border-on-accent/30" style:background-color={swatch.hex}></span><span class="truncate">{swatch.name}</span></span>
    <span class="flex shrink-0 items-center gap-2"><Icon name="recipe" />View recipe</span>
  </Button>
</div>
