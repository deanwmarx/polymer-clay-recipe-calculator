<script>
  import { preparationSegments } from '$lib/colourMixer.js';
  /** @type {{steps: string[]}} */
  let { steps } = $props();
</script>

<ol class="space-y-2">
  {#each steps as step, index (index)}
    <li class="flex gap-3 text-sm text-body">
      <span class="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent-text">{index + 1}</span>
      <span>{#each preparationSegments(step) as segment, part (part)}{#if segment.ingredient}<strong class="font-semibold text-ink">{segment.text}</strong>{:else}{segment.text}{/if}{/each}</span>
    </li>
  {/each}
</ol>
