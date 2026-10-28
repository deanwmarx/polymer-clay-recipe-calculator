import html2canvas from 'html2canvas-pro';

/** Export the entire recipe without clipping by its screen scroll container.
 * @param {HTMLElement} element
 * @param {{name: string, grams: number}} recipe
 */
export async function exportRecipe(element, recipe) {
  const width = element.getBoundingClientRect().width;
  const theme = getComputedStyle(document.documentElement);
  const background = theme.getPropertyValue('--surface-canvas').trim();
  const scale = 2;
  const canvas = await html2canvas(element, {
    backgroundColor: background,
    scale,
    onclone: (doc, card) => {
      // Tailwind supplies card styling; only the measured content width is dynamic.
      card.classList.add('box-content', 'p-6', 'rounded-panel', 'border', 'border-line', 'bg-surface');
      card.style.width = `${width}px`;
      doc.body.replaceChildren(card);
      doc.body.classList.add('overflow-visible!');
      const input = card.querySelector('[data-recipe-weight]');
      if (input) {
        const weight = doc.createElement('span');
        weight.textContent = `${recipe.grams}`;
        weight.className = `${input.className} block`;
        input.replaceWith(weight);
      }
    },
  });
  // Canvas coordinates are image geometry rather than interface CSS.
  const padding = 24 * scale;
  const framed = document.createElement('canvas');
  framed.width = canvas.width + padding * 2;
  framed.height = canvas.height + padding * 2;
  const context = framed.getContext('2d');
  if (!context) throw new Error('Could not create the recipe image.');
  context.fillStyle = background;
  context.fillRect(0, 0, framed.width, framed.height);
  context.drawImage(canvas, padding, padding);
  const link = document.createElement('a');
  link.download = `${recipe.name} - Polymer Clay Recipe Calculator.png`;
  link.href = framed.toDataURL('image/png');
  document.body.append(link);
  link.click();
  link.remove();
}
