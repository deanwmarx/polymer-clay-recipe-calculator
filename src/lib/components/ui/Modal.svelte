<script>
  import Button from './Button.svelte';
  /** @type {{open?: boolean, title: string, descriptionId?: string, children: import('svelte').Snippet}} */
  let { open = $bindable(false), title, descriptionId, children } = $props();
  const id = $props.id();
  /** @type {HTMLDialogElement | undefined} */
  let dialog = $state();
  function close() { open = false; }
  /** @param {MouseEvent} event */
  function backdropClick(event) { if (event.target === event.currentTarget) close(); }
  $effect(() => {
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  });
  $effect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  });
</script>

<dialog bind:this={dialog} aria-labelledby={`${id}-title`} aria-describedby={descriptionId} onclose={close} onclick={backdropClick}
  class="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto overscroll-contain rounded-panel border border-line bg-surface p-0 text-ink shadow-panel backdrop:bg-scrim">
  <div class="flex items-center justify-between gap-3 border-b border-line p-4">
    <h2 id={`${id}-title`} class="text-lg font-bold">{title}</h2>
    <Button variant="secondary" size="compact" onclick={close}>Close</Button>
  </div>
  <div class="space-y-5 p-5">{@render children()}</div>
</dialog>
