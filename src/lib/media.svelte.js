import { onMount } from 'svelte';

/** A reactive media query with an SSR-safe initial value.
 * @param {string} query
 * @param {boolean} [initial]
 */
export function mediaQuery(query, initial = false) {
  let current = $state(initial);
  onMount(() => {
    const media = window.matchMedia(query);
    const update = () => { current = media.matches; };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  });
  return { get current() { return current; } };
}
