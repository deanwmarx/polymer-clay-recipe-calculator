<script>
  import InstallApp from '../install/InstallApp.svelte';
  /** @type {{installBlocked?: boolean, hasSelection?: boolean}} */
  let { installBlocked = false, hasSelection = false } = $props();
</script>
<footer class="flex flex-col items-center gap-1 border-t border-line bg-surface px-6 py-4 text-center text-xs text-muted">
  <InstallApp blocked={installBlocked} {hasSelection} />
  <p>Built and maintained by <a href="https://deanwmarx.github.io" class="underline underline-offset-2 hover:text-ink">Dean Marx</a>.</p>
</footer>
