<script>
  /** @type {{result: import('#lib/colourMixer.js').MixResult}} */
  let { result } = $props();
</script>

<div class="overflow-x-auto rounded-lg border border-line">
  <table class="w-full text-sm">
    <thead class="border-b border-line bg-surface-subtle text-body">
      <tr><th class="px-4 py-2 text-left font-semibold">Clay</th><th class="px-4 py-2 text-right font-semibold">%</th><th class="px-4 py-2 text-right font-semibold">Grams</th></tr>
    </thead>
    <tbody>
      {#each result.lines as line, index (line.key)}
        <tr class={`border-b border-line last:border-0 ${index % 2 ? 'bg-surface-subtle' : 'bg-surface'}`}>
          <td class="px-4 py-2 font-medium">{line.clay}</td>
          <td class="px-4 py-2 text-right text-muted">{line.percent.toFixed(1)}%</td>
          <td class="px-4 py-2 text-right font-mono font-semibold">{line.grams}g</td>
        </tr>
      {/each}
    </tbody>
    <tfoot class="border-t-2 border-line bg-surface-subtle font-semibold">
      <tr><td class="px-4 py-2">Total</td><td class="px-4 py-2 text-right">100%</td><td class="px-4 py-2 text-right font-mono">{result.totalGrams}g</td></tr>
    </tfoot>
  </table>
</div>
