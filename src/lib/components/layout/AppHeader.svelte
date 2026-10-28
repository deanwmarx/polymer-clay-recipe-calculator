<script>
  import clayIcon from '#lib/assets/favicon.svg';
  import ThemeToggle from './ThemeToggle.svelte';
  import Disclosure from '../ui/Disclosure.svelte';
</script>

<header class="border-b border-line bg-surface px-4 pt-0 pb-5 sm:px-6">
  <div class="-mx-4 mb-5 h-1 bg-brand-ribbon sm:-mx-6" aria-hidden="true"></div>
  <div class="flex flex-wrap items-center justify-between gap-3">
    <div class="flex items-center gap-2.5">
      <img src={clayIcon} width="40" height="40" alt="" class="shrink-0" />
      <h1 class="font-bold leading-tight tracking-tight text-ink">
        <span class="block text-xl sm:text-2xl">Polymer Clay</span>
        <span class="mt-1 block text-caption font-medium uppercase tracking-widest text-muted sm:text-xs">Recipe Calculator</span>
      </h1>
    </div>
    <ThemeToggle />
  </div>
  <p class="mt-3 text-sm text-muted">Choose a polymer clay colour. Get a FIMO Professional recipe in grams.</p>
  <div class="mt-2">
    <Disclosure title="What you'll need">
      <p>FIMO Professional in True Yellow, True Red, True Magenta, True Blue, True Green, White and Black. Use a kitchen scale, or a jeweller's scale for smaller batches.</p>
    </Disclosure>
  </div>
</header>
