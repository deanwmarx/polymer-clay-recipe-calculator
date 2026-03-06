<script>
  import {
    COLOUR_ROWS,
    NEUTRAL_SWATCHES,
    COLOUR_GROUPS,
  } from "$lib/fimo-colours.js";
  import { mixRecipe } from "$lib/colourMixer.js";
  import html2canvas from "html2canvas-pro";

  /** @type {HTMLElement | undefined} */
  let recipeEl = $state();

  async function downloadRecipe() {
    if (!recipeEl) return;
    const canvas = await html2canvas(recipeEl, {
      backgroundColor: "#f3f4f6",
      scale: 2,
      onclone: (/** @type {Document} */ doc) => {
        // Replace the input with a static span so it renders cleanly
        const input = doc.getElementById("payload");
        if (input) {
          const span = doc.createElement("span");
          span.textContent = `${payload_grams}`;
          span.className = input.className;
          span.style.display = "block";
          input.replaceWith(span);
        }
      },
    });
    const link = document.createElement("a");
    link.download = `${selected_swatch?.name ?? "recipe"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  /** @type {import('$lib/fimo-colours.js').Swatch | null} */
  let selected_swatch = $state(null);
  let payload_grams = $state(10);

  /** @type {Set<string>} */
  let activeGroups = $state(new Set());

  /** Whether "Select All" is active (shows everything) */
  let selectAll = $state(true);

  let result = $derived(
    selected_swatch ? mixRecipe(selected_swatch.recipe, payload_grams) : null,
  );

  let filteredRows = $derived(
    selectAll
      ? COLOUR_ROWS
      : COLOUR_ROWS.filter((row) => activeGroups.has(row.group)),
  );

  let showNeutrals = $derived(selectAll || activeGroups.has("Neutrals"));

  /**
   * @param {string} hex
   * @returns {"#000000" | "#ffffff"}
   */
  function contrastColour(hex) {
    const h = hex.replace("#", "");
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.55 ? "#000000" : "#ffffff";
  }

  function toggleSelectAll() {
    selectAll = !selectAll;
    if (selectAll) {
      activeGroups = new Set();
    }
  }

  /**
   * @param {string} group
   */
  function toggleGroup(group) {
    if (selectAll) {
      // Coming from "All" mode — start fresh with just this group
      selectAll = false;
      activeGroups = new Set([group]);
      return;
    }
    const next = new Set(activeGroups);
    if (next.has(group)) {
      next.delete(group);
    } else {
      next.add(group);
    }
    // If nothing is left checked, re-enable select all
    if (next.size === 0) {
      selectAll = true;
      activeGroups = new Set();
    } else {
      activeGroups = next;
    }
  }
</script>

<div class="min-h-screen bg-gray-100">
  <!-- Header -->
  <header class="bg-white border-b border-gray-200 px-6 py-4">
    <h1 class="text-2xl font-bold tracking-tight">
      FIMO True Colours - Recipe Calculator
    </h1>
    <p class="text-sm text-gray-500 mt-1">
      Select a colour swatch to generate your mixing recipe.
    </p>
  </header>

  <div class="flex flex-col lg:flex-row gap-0 min-h-[calc(100vh-73px)]">
    <!-- Left: Palette -->
    <aside class="lg:w-2/3 p-6 space-y-4 border-r border-gray-200 bg-white">
      <!-- Filter checkboxes -->
      <div class="flex flex-wrap gap-3">
        <label
          class="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider cursor-pointer select-none"
          class:text-gray-400={!selectAll}
          class:text-gray-700={selectAll}
        >
          <input
            type="checkbox"
            checked={selectAll}
            onchange={toggleSelectAll}
            class="accent-blue-500 w-3.5 h-3.5"
          />
          All
        </label>
        <span class="border-l border-gray-200"></span>
        {#each COLOUR_GROUPS as group}
          <label
            class="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider cursor-pointer select-none"
            class:text-gray-400={!activeGroups.has(group) && !selectAll}
            class:text-gray-700={activeGroups.has(group) || selectAll}
          >
            <input
              type="checkbox"
              checked={!selectAll && activeGroups.has(group)}
              onchange={() => toggleGroup(group)}
              class="accent-blue-500 w-3.5 h-3.5"
            />
            {group}
          </label>
        {/each}
      </div>

      <!-- Neutrals row -->
      {#if showNeutrals}
        <div class="flex gap-4 items-center justify-center">
          {#each NEUTRAL_SWATCHES as swatch}
            {@const isSelected = selected_swatch?.id === swatch.id}
            {@const fg = contrastColour(swatch.hex)}
            <button
              onclick={() => (selected_swatch = isSelected ? null : swatch)}
              title={swatch.name}
              class="w-16 h-16 cursor-pointer rounded transition-all duration-300 {!isSelected
                ? 'hover:scale-95'
                : ''} flex flex-col items-center justify-center p-0.5 ring-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              class:ring-2={isSelected}
              class:ring-blue-500={isSelected}
              class:scale-110={isSelected}
              style="background-color: {swatch.hex};"
              aria-label={swatch.name}
              aria-pressed={isSelected}
            >
              {#each swatch.recipe as { clay, parts }, i}
                <span
                  class="leading-none text-center text-xs {isSelected
                    ? 'font-bold'
                    : 'font-normal'}"
                  style="color: {fg};"
                >
                  {#if i > 0}<span>+</span>{/if}
                  {parts}{clay}
                </span>
              {/each}
            </button>
          {/each}
        </div>
      {/if}

      <!-- Colour grid: each row = P1 P2 P3 | Main | D1 D2 D3 -->
      <div class="space-y-4">
        {#each filteredRows as row}
          <div class="flex gap-4 items-center justify-center">
            <!-- Pastels: lightest to deepest -->
            {#each row.pastels as swatch}
              {@const isSelected = selected_swatch?.id === swatch.id}
              {@const fg = contrastColour(swatch.hex)}
              <button
                onclick={() => (selected_swatch = isSelected ? null : swatch)}
                title={swatch.name}
                class="w-16 h-16 cursor-pointer rounded transition-all duration-300 {!isSelected
                  ? 'hover:scale-95'
                  : ''} flex flex-col items-center justify-center p-0.5 ring-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                class:ring-2={isSelected}
                class:ring-blue-500={isSelected}
                class:scale-110={isSelected}
                style="background-color: {swatch.hex};"
                aria-label={swatch.name}
                aria-pressed={isSelected}
              >
                {#each swatch.recipe as { clay, parts }, j}
                  <span
                    class="leading-none text-center text-xs {isSelected
                      ? 'font-bold'
                      : 'font-normal'}"
                    style="color: {fg};"
                  >
                    {#if j > 0}<span>+</span>{/if}
                    {parts}{clay}
                  </span>
                {/each}
              </button>
            {/each}

            <!-- Main wheel colour -->
            {#each [row.main] as mainSwatch}
              {@const isSelected = selected_swatch?.id === mainSwatch.id}
              {@const fg = contrastColour(mainSwatch.hex)}
              <button
                onclick={() =>
                  (selected_swatch = isSelected ? null : mainSwatch)}
                title={mainSwatch.name}
                class="w-16 h-16 cursor-pointer rounded transition-all duration-300 {!isSelected
                  ? 'hover:scale-95'
                  : ''} flex flex-col items-center justify-center p-0.5 ring-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                class:ring-2={isSelected}
                class:ring-blue-500={isSelected}
                class:scale-110={isSelected}
                style="background-color: {mainSwatch.hex};"
                aria-label={mainSwatch.name}
                aria-pressed={isSelected}
              >
                {#each mainSwatch.recipe as { clay, parts }, j}
                  <span
                    class="leading-none text-center text-xs {isSelected
                      ? 'font-bold'
                      : 'font-normal'}"
                    style="color: {fg};"
                  >
                    {#if j > 0}<span>+</span>{/if}
                    {parts}{clay}
                  </span>
                {/each}
              </button>
            {/each}

            <!-- Darks: lightest to deepest -->
            {#each row.darks as swatch}
              {@const isSelected = selected_swatch?.id === swatch.id}
              {@const fg = contrastColour(swatch.hex)}
              <button
                onclick={() => (selected_swatch = isSelected ? null : swatch)}
                title={swatch.name}
                class="w-16 h-16 cursor-pointer rounded transition-all duration-300 {!isSelected
                  ? 'hover:scale-95'
                  : ''} flex flex-col items-center justify-center p-0.5 ring-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                class:ring-2={isSelected}
                class:ring-blue-500={isSelected}
                class:scale-110={isSelected}
                style="background-color: {swatch.hex};"
                aria-label={swatch.name}
                aria-pressed={isSelected}
              >
                {#each swatch.recipe as { clay, parts }, j}
                  <span
                    class="leading-none text-center text-xs {isSelected
                      ? 'font-bold'
                      : 'font-normal'}"
                    style="color: {fg};"
                  >
                    {#if j > 0}<span>+</span>{/if}
                    {parts}{clay}
                  </span>
                {/each}
              </button>
            {/each}
          </div>
        {/each}
      </div>
    </aside>

    <!-- Right: Recipe -->
    <main
      class="lg:w-1/3 p-6 space-y-6 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto"
    >
      {#if selected_swatch}
        <div bind:this={recipeEl} class="space-y-6">
          <!-- Colour Preview -->
          <div
            class="w-full h-24 rounded-xl border border-gray-200 flex items-end p-3"
            style="background-color: {selected_swatch.hex};"
          >
            <span
              class="text-sm font-semibold"
              style="color: {contrastColour(selected_swatch.hex)};"
            >
              {selected_swatch.name}
            </span>
          </div>

          <!-- Payload Input -->
          <div>
            <label
              for="payload"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Total clay (grams)
            </label>
            <input
              id="payload"
              type="number"
              bind:value={payload_grams}
              min="1"
              step="1"
              class="w-full px-3 py-2.5 border transition-all duration-300 bg-white border-gray-300 rounded-lg text-sm leading-none align-middle focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {#if result}
            <!-- Recipe Table -->
            <div>
              <h2
                class="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3"
              >
                Recipe
              </h2>
              <div class="overflow-x-auto rounded-lg border border-gray-200">
                <table class="w-full text-sm">
                  <thead class="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th
                        class="text-left px-4 py-2 font-semibold text-gray-600"
                      >
                        Clay
                      </th>
                      <th
                        class="text-right px-4 py-2 font-semibold text-gray-600"
                      >
                        %
                      </th>
                      <th
                        class="text-right px-4 py-2 font-semibold text-gray-600"
                      >
                        Grams
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each result.lines as line, i}
                      <tr
                        class="border-b border-gray-100 last:border-0"
                        class:bg-white={i % 2 === 0}
                        class:bg-gray-50={i % 2 !== 0}
                      >
                        <td class="px-4 py-2 font-medium">{line.clay}</td>
                        <td class="px-4 py-2 text-right text-gray-500">
                          {line.percent.toFixed(1)}%
                        </td>
                        <td
                          class="px-4 py-2 text-right font-mono font-semibold"
                        >
                          {line.grams}g
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                  <tfoot class="border-t-2 border-gray-200 bg-gray-50">
                    <tr>
                      <td class="px-4 py-2 font-semibold">Total</td>
                      <td class="px-4 py-2 text-right font-semibold">100%</td>
                      <td class="px-4 py-2 text-right font-mono font-semibold">
                        {result.totalGrams}g
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Preparation Steps -->
            <div>
              <h2
                class="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3"
              >
                Preparation
              </h2>
              <ol class="space-y-2">
                {#each result.steps as step, i}
                  <li class="flex gap-3 text-sm text-gray-700">
                    <span
                      class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center mt-0.5"
                    >
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                {/each}
              </ol>
            </div>
          {/if}
        </div>

        <!-- Download Button (excluded from image capture) -->
        <button
          data-html2canvas-ignore="true"
          onclick={downloadRecipe}
          class="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Download as Image
        </button>
      {:else}
        <div
          class="flex flex-col items-center justify-center h-64 text-center text-gray-400"
        >
          <div class="text-4xl mb-3">🎨</div>
          <p class="text-sm">
            Select a colour from the palette to get started.
          </p>
        </div>
      {/if}
    </main>
  </div>
</div>
