<script>
  import { onMount, tick } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { mediaQuery } from '#lib/media.svelte.js';
  import Button from './Button.svelte';

  /** @type {{open?: boolean, title: string, children: import('svelte').Snippet}} */
  let { open = $bindable(false), title, children } = $props();
  const id = $props.id();
  const motion = mediaQuery('(prefers-reduced-motion: reduce)');
  /** @type {HTMLDivElement | undefined} */
  let panel = $state();
  let offset = $state(0);
  let dragging = $state(false);
  let pointer = -1;
  let startY = 0;
  let startTime = 0;
  let lastY = 0;
  let didDrag = false;
  let backdropPressed = false;
  let releaseFrame = 0;

  function close() {
    if (releaseFrame) cancelAnimationFrame(releaseFrame);
    releaseFrame = 0;
    open = false;
    dragging = false;
    pointer = -1;
  }

  /** @param {HTMLElement} node */
  function exitSheet(node) {
    // Freeze this exiting panel's position if another recipe opens during its outro.
    node.style.setProperty('--sheet-offset', `${offset}px`);
    const height = node.getBoundingClientRect().height;
    const remaining = Math.max(0, height - offset);
    return fly(node, {
      y: remaining,
      duration: motion.current || !height ? 0 : 280 * remaining / height,
      opacity: 1,
      easing: cubicOut
    });
  }

  /** @param {PointerEvent} event */
  function startDrag(event) {
    if (!event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    pointer = event.pointerId;
    startY = event.clientY;
    lastY = event.clientY;
    startTime = performance.now();
    didDrag = false;
    backdropPressed = false;
    dragging = true;
    /** @type {HTMLElement} */ (event.currentTarget).setPointerCapture(event.pointerId);
  }
  /** @param {PointerEvent} event */
  function moveDrag(event) {
    if (event.pointerId !== pointer) return;
    if (event.pointerType === 'mouse' && !(event.buttons & 1)) { finishDrag(); return; }
    lastY = event.clientY;
    const distance = event.clientY - startY;
    if (Math.abs(distance) > 6) didDrag = true;
    offset = Math.max(0, distance);
  }
  /** @param {PointerEvent} event */
  function endDrag(event) {
    if (event.pointerId !== pointer) return;
    lastY = event.clientY;
    finishDrag(true);
  }
  function finishDrag(afterRelease = false) {
    if (pointer === -1) return;
    const distance = Math.max(0, lastY - startY);
    const speed = distance / Math.max(1, performance.now() - startTime);
    didDrag ||= distance > 6;
    pointer = -1;
    dragging = false;
    // Let the browser release pointer capture after pointerup. Releasing it inside
    // this handler can retarget the drag's click onto the backdrop or palette.
    if ((!didDrag && distance <= 6) || distance >= 96 || (distance >= 32 && speed > 0.65)) {
      if (afterRelease) {
        // Keep the pressed target alive until the browser finishes mouseup/touchend.
        // Removing or making it inert during pointerup can cancel the NEXT click.
        releaseFrame = requestAnimationFrame(() => { releaseFrame = 0; close(); });
      } else close();
    }
    else offset = 0;
  }
  /** @param {PointerEvent} event */
  function lostCapture(event) { if (event.pointerId === pointer) finishDrag(); }
  /** @param {PointerEvent} event */
  function cancelDrag(event) { if (event.pointerId === pointer) finishDrag(); }

  onMount(() => {
    const capture = { capture: true };
    // Finish the gesture even if the moving handle no longer receives its release.
    /** @param {MouseEvent} event */
    function mouseup(event) { if (pointer !== -1) { lastY = event.clientY; finishDrag(true); } }
    function blur() { finishDrag(); }
    function pointerdown() { if (pointer !== -1) finishDrag(); }
    /** @param {TouchEvent} event */
    function touchstart(event) { if (pointer !== -1) event.preventDefault(); }
    const touchCapture = { capture: true, passive: false };
    window.addEventListener('pointermove', moveDrag, capture);
    window.addEventListener('pointerup', endDrag, capture);
    window.addEventListener('pointercancel', cancelDrag, capture);
    window.addEventListener('mouseup', mouseup, capture);
    window.addEventListener('blur', blur);
    window.addEventListener('pointerdown', pointerdown, capture);
    window.addEventListener('touchstart', touchstart, touchCapture);
    return () => {
      window.removeEventListener('pointermove', moveDrag, capture);
      window.removeEventListener('pointerup', endDrag, capture);
      window.removeEventListener('pointercancel', cancelDrag, capture);
      window.removeEventListener('mouseup', mouseup, capture);
      window.removeEventListener('blur', blur);
      window.removeEventListener('pointerdown', pointerdown, capture);
      window.removeEventListener('touchstart', touchstart, touchCapture);
      if (releaseFrame) cancelAnimationFrame(releaseFrame);
    };
  });
  /** @param {MouseEvent} event */
  function handleClick(event) {
    if (didDrag && !(event.detail === 0 && !/** @type {PointerEvent} */ (event).pointerType)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    close();
  }
  function backdropClick() {
    if (backdropPressed) close();
    backdropPressed = false;
  }

  $effect(() => {
    if (!open) return;
    offset = 0;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    let cancelled = false;
    void tick().then(() => {
      if (cancelled || !open || !panel) return;
      panel.style.removeProperty('--sheet-offset');
      panel.focus({ preventScroll: true });
    });

    /** @param {KeyboardEvent} event */
    function keydown(event) {
      if (event.key === 'Escape') { event.preventDefault(); close(); return; }
      if (event.key !== 'Tab' || !panel) return;
      const controls = [...panel.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]')]
        .filter((node) => node instanceof HTMLElement && node.getClientRects().length);
      const first = /** @type {HTMLElement | undefined} */ (controls[0]);
      const last = /** @type {HTMLElement | undefined} */ (controls.at(-1));
      if (!first || !last) { event.preventDefault(); panel.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === panel)) {
        event.preventDefault(); first.focus();
      }
    }
    document.addEventListener('keydown', keydown);
    return () => {
      cancelled = true;
      document.removeEventListener('keydown', keydown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  });
</script>

<!-- This wrapper stays outside the transitioning block. Its state immediately
     disables the entire outgoing overlay, regardless of any running animation. -->
<div class="group/sheet pointer-events-none fixed inset-0 z-50" data-open={open} data-dragging={dragging}
  aria-hidden={!open} inert={!open} style:--sheet-offset={`${offset}px`}>
  {#if open}
    <div role="presentation" class="pointer-events-auto absolute inset-0 bg-scrim group-data-[open=false]/sheet:pointer-events-none"
      onpointerdown={() => (backdropPressed = true)} onclick={backdropClick}
      transition:fade={{duration:motion.current ? 0 : 280}}></div>
    <div bind:this={panel} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} tabindex="-1"
      class="pointer-events-auto absolute inset-x-0 bottom-0 mx-auto flex max-h-[88dvh] w-full max-w-2xl translate-y-(--sheet-offset) flex-col overflow-hidden rounded-t-panel bg-surface-canvas text-ink shadow-panel outline-none transition-[translate] duration-180 ease-out group-data-[dragging=true]/sheet:transition-none group-data-[open=false]/sheet:pointer-events-none motion-reduce:transition-none"
      in:fly={{y:'100%',duration:motion.current ? 0 : 280,opacity:1,easing:cubicOut}} out:exitSheet>
      <div class="shrink-0 border-b border-line bg-surface">
        <Button variant="ghost" size="bare" fullWidth aria-label="Close colour recipe" title="Drag down or tap to close"
          onclick={handleClick} onpointerdown={startDrag} onlostpointercapture={lostCapture}
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
</div>
