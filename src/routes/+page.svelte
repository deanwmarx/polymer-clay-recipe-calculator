<script>
  import { parseColor } from "$lib/colorParser.js";
  import { rgbToHsl } from "$lib/colorConvert.js";
  import { calculateClayRatios, clayMixToRgb, getDefaultPigmentScalars } from "$lib/clayCalculator.js";
  import { roundClayGrams } from "$lib/rounding.js";

  let color_input = "rgb(191, 136, 68)";
  let payload_grams = 10;
  let avoid_black = true;

  let parsed_color = null;
  let result = null;
  let error_message = "";

  function calculate() {
    error_message = "";
    result = null;
    parsed_color = null;

    const rgb = parseColor(color_input);
    if (!rgb) {
      error_message = "Invalid color format. Use hex, rgb(), or hsl().";
      return;
    }

    parsed_color = rgb;
    const hsl = rgbToHsl(rgb);
    const ratios = calculateClayRatios(hsl, avoid_black);
    const rounded = roundClayGrams(ratios, payload_grams);

    const exact = {
      yellow: ratios.yellow * payload_grams,
      red: ratios.red * payload_grams,
      blue: ratios.blue * payload_grams,
      white: ratios.white * payload_grams,
      black: ratios.black * payload_grams,
    };

    const scalars = getDefaultPigmentScalars();
    const mixedRgb = clayMixToRgb(ratios, scalars);

    console.debug('[ui] scalars', scalars);

    result = {
      ratios,
      exact,
      rounded,
      mixedRgb,
    };
  }

  function formatPercent(ratio) {
    return (ratio * 100).toFixed(1) + "%";
  }

  function formatGrams(grams) {
    return grams.toFixed(2);
  }

  function formatRounded(grams) {
    return grams.toFixed(1);
  }

  function rgbToHex({ r, g, b }) {
    return (
      "#" +
      [r, g, b]
        .map((v) => v.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase()
    );
  }
</script>

<div class="min-h-screen bg-gray-50 p-8">
  <div class="max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Polymer Clay Recipe Calculator</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Input Section -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Input</h2>

        <div class="space-y-4">
          <div>
            <label for="color-input" class="block text-sm font-medium mb-2">
              Color (hex, rgb, or hsl)
            </label>
            <input
              id="color-input"
              type="text"
              bind:value={color_input}
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g. #BF8844, rgb(191,136,68)"
            />
          </div>

          {#if parsed_color}
            <div>
              <label for="color-preview" class="block text-sm font-medium mb-2">
                Color Preview
              </label>
              <div
                id="color-preview"
                class="w-full h-16 rounded-md border border-gray-300"
                style="background-color: rgb({parsed_color.r}, {parsed_color.g}, {parsed_color.b});"
              ></div>
            </div>
          {/if}

          <div>
            <label for="payload-grams" class="block text-sm font-medium mb-2">
              Payload (grams)
            </label>
            <input
              id="payload-grams"
              type="number"
              bind:value={payload_grams}
              min="1"
              step="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div class="flex items-start">
            <input
              type="checkbox"
              id="avoid-black"
              bind:checked={avoid_black}
              class="mt-1 mr-2"
            />
            <div>
              <label
                for="avoid-black"
                class="text-sm font-medium cursor-pointer"
              >
                Start recipe without Black
              </label>
              <p class="text-xs text-gray-600 mt-1">
                Black won't be included in the initial mix. Use only if needed
                during adjustments.
              </p>
            </div>
          </div>

          <button
            onclick={calculate}
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium"
          >
            Calculate Recipe
          </button>

          {#if error_message}
            <div class="text-red-600 text-sm">{error_message}</div>
          {/if}
        </div>
      </div>

      <!-- Output Section -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Recipe</h2>

        {#if result}
          <div class="space-y-6">
            <!-- Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b">
                    <th class="text-left py-2 font-semibold">Clay</th>
                    <th class="text-right py-2 font-semibold">%</th>
                    <th class="text-right py-2 font-semibold">Exact (g)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b">
                    <td class="py-2">Yellow</td>
                    <td class="text-right"
                      >{formatPercent(result.ratios.yellow)}</td
                    >
                    <td class="text-right"
                      >{formatGrams(result.exact.yellow)}</td
                    >
                  </tr>
                  <tr class="border-b">
                    <td class="py-2">Red</td>
                    <td class="text-right"
                      >{formatPercent(result.ratios.red)}</td
                    >
                    <td class="text-right">{formatGrams(result.exact.red)}</td>
                  </tr>
                  <tr class="border-b">
                    <td class="py-2">Blue</td>
                    <td class="text-right"
                      >{formatPercent(result.ratios.blue)}</td
                    >
                    <td class="text-right">{formatGrams(result.exact.blue)}</td>
                  </tr>
                  <tr class="border-b">
                    <td class="py-2">White</td>
                    <td class="text-right"
                      >{formatPercent(result.ratios.white)}</td
                    >
                    <td class="text-right">{formatGrams(result.exact.white)}</td
                    >
                  </tr>
                  <tr class="border-b">
                    <td class="py-2">Black</td>
                    <td class="text-right"
                      >{formatPercent(result.ratios.black)}</td
                    >
                    <td class="text-right">{formatGrams(result.exact.black)}</td
                    >
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mixed Color Preview -->
            <div>
              <label class="block text-sm font-medium mb-2">Mixed Color Preview</label>
              <div class="flex items-center space-x-4">
                <div
                  class="w-20 h-12 rounded-md border border-gray-300"
                  style="background-color: rgb({result.mixedRgb.r}, {result.mixedRgb.g}, {result.mixedRgb.b});"
                ></div>
                <div class="text-sm">
                  <div class="font-semibold">{rgbToHex(result.mixedRgb)}</div>
                  <div class="text-gray-600">Approximate mixed clay color</div>
                </div>
              </div>
            </div>

            <!-- Mix Order -->
            <div>
              <h3 class="font-semibold mb-2">Mix Order</h3>
              <ol
                class="list-decimal list-inside text-sm space-y-1 text-gray-700"
              >
                <li>Mix Red + Yellow first until uniform</li>
                <li>Add White to reach target brightness</li>
                <li>Add Blue in tiny amounts to brown it (if needed)</li>
                <li>Avoid Black unless targeting very dark colors</li>
              </ol>
            </div>

            <!-- Tweak Instructions -->
            <div>
              <h3 class="font-semibold mb-2">Adjustment Guide</h3>
              <ul class="list-disc list-inside text-sm space-y-1 text-gray-700">
                <li>Too orange/bright → add a tiny bit of Blue</li>
                <li>Too dark → add White</li>
                <li>Too yellow → add Red</li>
                <li>
                  Too dull/grey → reduce Blue/Black next time, add Yellow + Red
                </li>
                <li>
                  If still too bright after Blue tweaks → add a speck of Black
                </li>
              </ul>
            </div>
          </div>
        {:else}
          <p class="text-gray-500 text-sm">
            Enter a color and click Calculate to see the recipe.
          </p>
        {/if}
      </div>
    </div>
  </div>
</div>
