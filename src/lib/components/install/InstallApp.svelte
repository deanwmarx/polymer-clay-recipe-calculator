<script>
  import { onMount } from 'svelte';
  import InstallInstructions from './InstallInstructions.svelte';
  import clayIcon from '$lib/assets/favicon.svg';
  import Button from '../ui/Button.svelte';
  import Icon from '../ui/Icon.svelte';
  import Modal from '../ui/Modal.svelte';
  import { fly } from 'svelte/transition';
  import { mediaQuery } from '$lib/media.svelte.js';
  const motion = mediaQuery('(prefers-reduced-motion: reduce)');
  const descriptionId = $props.id();

  let { blocked = false, hasSelection = false } = $props();
  const HINT_KEY = 'clay-colour-install-hint-seen';
  const HINT_DELAY_MS = 60_000;
  let mounted = $state(false);
  const mobileScreen = mediaQuery('(max-width: 1023px)');
  const mobile = $derived(mobileScreen.current);
  let visible = $state(false);
  let hintSeen = $state(false);
  let showHint = $state(false);

  function dismissHint() { showHint = false; }

  $effect(() => {
    if (!mounted || !mobile || !visible || installed || hintSeen || blocked || guideOpen) return;
    const timer = window.setTimeout(() => {
      hintSeen = true;
      showHint = true;
      try { localStorage.setItem(HINT_KEY, 'true'); }
      catch { try { sessionStorage.setItem(HINT_KEY, 'true'); } catch {} }
    }, HINT_DELAY_MS);
    return () => window.clearTimeout(timer);
  });


  $effect(() => {
    if (blocked || installed || !mobile || guideOpen) dismissHint();
  });

  /** @typedef {Event & { prompt: () => Promise<void>, userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> }} InstallPromptEvent */
  /** @type {InstallPromptEvent | null} */
  let installPrompt = $state(null);
  let installed = $state(false);
  let prompting = $state(false);
  let platform = $state('desktop');
  let guideOpen = $state(false);

  onMount(() => {
    const updateVisibility = () => { visible = !document.hidden; };
    updateVisibility();
    try { hintSeen = localStorage.getItem(HINT_KEY) === 'true'; }
    catch { try { hintSeen = sessionStorage.getItem(HINT_KEY) === 'true'; } catch {} }
    mounted = true;
    const displayMode = window.matchMedia('(display-mode: standalone)');
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    platform = ios ? 'ios' : /Android/.test(navigator.userAgent) ? 'android' : 'desktop';
    const refreshInstalled = () => {
      installed = displayMode.matches ||
        /** @type {Navigator & { standalone?: boolean }} */ (navigator).standalone === true;
    };
    refreshInstalled();
    const capturePrompt = (/** @type {Event} */ event) => {
      event.preventDefault();
      installPrompt = /** @type {InstallPromptEvent} */ (event);
    };
    const finishInstall = () => {
      installed = true;
      installPrompt = null;
      guideOpen = false;
    };
    window.addEventListener('beforeinstallprompt', capturePrompt);
    window.addEventListener('appinstalled', finishInstall);
    displayMode.addEventListener('change', refreshInstalled);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      window.removeEventListener('beforeinstallprompt', capturePrompt);
      window.removeEventListener('appinstalled', finishInstall);
      displayMode.removeEventListener('change', refreshInstalled);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  });

  async function installApp() {
    dismissHint();
    if (prompting) return;
    if (!installPrompt) {
      guideOpen = true;
      return;
    }
    prompting = true;
    const prompt = installPrompt;
    // Each browser prompt can only be used once, including after dismissal.
    installPrompt = null;
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === 'accepted') {
        installed = true;
        guideOpen = false;
      }
    } catch {
      guideOpen = true;
    } finally {
      prompting = false;
    }
  }
</script>

{#if showHint && !installed && mobile}
  <aside aria-label="Install app suggestion"
    class={`fixed inset-x-4 z-20 mx-auto max-w-sm rounded-panel border border-line-strong bg-surface-raised p-3.5 text-left shadow-panel lg:hidden ${hasSelection ? 'bottom-[calc(6rem+env(safe-area-inset-bottom))]' : 'bottom-[max(1rem,env(safe-area-inset-bottom))]'}`}
    transition:fly={{y:12,duration:motion.current ? 0 : 220,opacity:0}}>

    <div class="flex items-start gap-3">
      <img src={clayIcon} width="36" height="36" alt="" class="shrink-0" />
      <div role="status">
        <p class="text-sm font-bold text-ink">Use this calculator often?</p>
        <p class="mt-1 text-xs leading-relaxed text-body">Save it to your phone for quick access from your home screen.</p>
      </div>
    </div>
    <div class="mt-2 flex items-center gap-2 pl-12">
      <Button onclick={installApp} loading={prompting}>Save app</Button>
      <Button variant="ghost" size="compact" onclick={dismissHint}>Dismiss forever</Button>
    </div>
    <p class="mt-2 text-xs leading-relaxed text-muted">You can still install it later using “Save app to your phone” in the footer.</p>
  </aside>
{/if}

{#if !installed}
  <Button variant="link" size="compact" onclick={installApp} loading={prompting} class="lg:hidden">
    <Icon name="download" />{prompting ? 'Opening installer…' : 'Save app to your phone'}
  </Button>
{/if}

<Modal bind:open={guideOpen} title="Install Polymer Clay Recipe Calculator" {descriptionId}>
    <div class="flex items-center gap-3">
      <img src={clayIcon} width="48" height="48" alt="" class="shrink-0" />
      <p id={descriptionId} class="text-sm leading-relaxed text-body">Save the calculator to your home screen for quick access whenever you want to mix a colour.</p>
    </div>
    {#if installPrompt}
      <Button onclick={installApp} loading={prompting} fullWidth>Install now</Button>
    {/if}
    <InstallInstructions {platform} />
    <p class="text-xs leading-relaxed text-muted">Your browser handles the final installation confirmation.</p>
</Modal>
