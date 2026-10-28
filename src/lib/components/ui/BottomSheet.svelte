<script>
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { mediaQuery } from '$lib/media.svelte.js';
  import Button from './Button.svelte';

  /** @type {{open?: boolean, title: string, children: import('svelte').Snippet}} */
  let { open = $bindable(false), title, children } = $props();
  const id = $props.id();
  const motion = mediaQuery('(prefers-reduced-motion: reduce)');
  /** @type {HTMLDialogElement | undefined} */
  let dialog = $state();
  let modalOpen = $state(false);
  let offset = $state(0);
  let dragging = $state(false);
  let pointer = -1;
  let startY = 0;
  let startTime = 0;
  let suppressClick = false;

  function close() { open = false; dragging = false; pointer = -1; }
  function finishClose() {
    if (!open) { dialog?.close(); offset = 0; modalOpen = false; }
  }
  function nativeClose() {
    // A queued close event can arrive after the next recipe has already opened.
    if (dialog?.open) return;
    close(); offset = 0; modalOpen = false;
  }
  /** @param {HTMLElement} node */
  function exitSheet(node) {
    const height = node.getBoundingClientRect().height;
    const remaining = Math.max(0, height - offset);
    return fly(node, {
      y: remaining,
      duration: motion.current || !height ? 0 : 280 * remaining / height,
      opacity: 1,
      easing: cubicOut
    });
  }
  /** @param {Event} event */
  function cancel(event) { event.preventDefault(); close(); }
  /** @param {MouseEvent} event */
  function backdropClick(event) { if (event.target === event.currentTarget) close(); }
  /** @param {PointerEvent} event */
  function startDrag(event) {
    if (!event.isPrimary || event.button !== 0) return;
    pointer = event.pointerId;
    startY = event.clientY;
    startTime = performance.now();
    suppressClick = false;
    dragging = true;
    /** @type {HTMLElement} */ (event.currentTarget).setPointerCapture(event.pointerId);
  }
  /** @param {PointerEvent} event */
  function moveDrag(event) {
    if (event.pointerId !== pointer) return;
    const distance = event.clientY - startY;
    if (Math.abs(distance) > 6) suppressClick = true;
    offset = Math.max(0, distance);
  }
  /** @param {PointerEvent} event */
  function endDrag(event) {
    if (event.pointerId !== pointer) return;
    const distance = Math.max(0, event.clientY - startY);
    const speed = distance / Math.max(1, performance.now() - startTime);
    const handle = /** @type {HTMLElement} */ (event.currentTarget);
    if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
    pointer = -1;
    dragging = false;
    if (distance >= 96 || (distance >= 32 && speed > 0.65)) close();
    else offset = 0;
  }
  function cancelDrag() { pointer = -1; dragging = false; offset = 0; }
  /** @param {MouseEvent} event */
  function handleClick(event) {
    if (suppressClick) { event.preventDefault(); event.stopPropagation(); }
    if (event.detail === 0 || !suppressClick) close();
    suppressClick = false;
  }
  $effect(() => {
    if (open && dialog && !dialog.open) { offset = 0; dialog.showModal(); modalOpen = true; }
  });
  $effect(() => {
    if (!modalOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  });
</script>

<dialog bind:this={dialog} aria-labelledby={`${id}-title`} oncancel={cancel} onclose={nativeClose} onclick={backdropClick}
  data-dragging={dragging} data-closing={!open} style:--sheet-offset={`${offset}px`}
  class="fixed inset-x-0 top-auto bottom-0 mx-auto my-0 max-h-none w-full max-w-2xl translate-y-(--sheet-offset) overflow-visible border-0 bg-transparent p-0 transition-transform duration-180 ease-out data-[dragging=true]:transition-none motion-reduce:transition-none backdrop:bg-scrim backdrop:opacity-100 backdrop:transition-opacity backdrop:duration-280 data-[closing=true]:backdrop:opacity-0 motion-reduce:backdrop:transition-none">
  {#if open}
    <div class="flex max-h-[88dvh] flex-col overflow-hidden rounded-t-panel bg-surface-canvas text-ink shadow-panel"
      in:fly={{y:'100%',duration:motion.current ? 0 : 280,opacity:1,easing:cubicOut}} out:exitSheet onoutroend={finishClose}>
      <div class="shrink-0 border-b border-line bg-surface">
        <Button variant="ghost" size="bare" fullWidth aria-label="Close colour recipe" title="Drag down or tap to close"
          onclick={handleClick} onpointerdown={startDrag} onpointermove={moveDrag} onpointerup={endDrag} onpointercancel={cancelDrag}
          class="group h-11 touch-none cursor-grab select-none active:cursor-grabbing">
          <span class="h-1.5 w-10 rounded-full bg-line-strong group-hover:bg-accent" aria-hidden="true"></span>
        </Button>
        <h2 id={`${id}-title`} class="sr-only">{title}</h2>
      </div>
      <div class="min-h-0 space-y-6 overflow-y-auto overscroll-contain p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {@render children()}
      </div>
    </div>
  {/if}
</dialog>
