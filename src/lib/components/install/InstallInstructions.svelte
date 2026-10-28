<script>
  /** @type {{platform: string}} */
  let { platform } = $props();
</script>

    {#if platform === 'ios'}
      <h3 class="text-sm font-bold text-ink">On iPhone or iPad</h3>
      <ol class="list-decimal pl-5 space-y-3 text-sm leading-relaxed text-body">
        <li>Open this page in <strong class="text-ink">Safari</strong>.</li>
        <li>Tap <strong class="text-ink">Share</strong> (the square with an upward arrow). It may be inside the browser's menu.</li>
        <li>Choose <strong class="text-ink">Add to Home Screen</strong>. If offered, turn on <strong class="text-ink">Open as Web App</strong>.</li>
        <li>Tap <strong class="text-ink">Add</strong>.</li>
      </ol>
    {:else if platform === 'android'}
      <h3 class="text-sm font-bold text-ink">On Android</h3>
      <ol class="list-decimal pl-5 space-y-3 text-sm leading-relaxed text-body">
        <li>Open this page in <strong class="text-ink">Chrome</strong>.</li>
        <li>Open the <strong class="text-ink">three-dot menu</strong>.</li>
        <li>Choose <strong class="text-ink">Install app</strong> or <strong class="text-ink">Add to Home screen</strong>, then confirm.</li>
      </ol>
    {:else}
      <h3 class="text-sm font-bold text-ink">In your browser</h3>
      <ol class="list-decimal pl-5 space-y-3 text-sm leading-relaxed text-body">
        <li>Look for the <strong class="text-ink">install icon</strong> in the address bar, or open the browser menu.</li>
        <li>Choose <strong class="text-ink">Install app</strong> (sometimes under <strong class="text-ink">Apps</strong> or <strong class="text-ink">Save and share</strong>).</li>
        <li>Confirm to add Polymer Clay Recipe Calculator to your device.</li>
      </ol>
      <p class="text-xs leading-relaxed text-muted">If installation isn't offered, try Chrome or Edge. On iPhone or iPad, use Safari's Share menu → Add to Home Screen.</p>
    {/if}
