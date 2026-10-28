<script>
  /** @typedef {'primary' | 'secondary' | 'plain' | 'ghost' | 'link' | 'filter' | 'shade' | 'theme'} Variant */
  /** @typedef {'default' | 'compact' | 'icon' | 'bare' | 'shade'} Size */
  /** @type {import('svelte/elements').HTMLButtonAttributes & {
   * variant?: Variant, size?: Size, align?: 'center' | 'start' | 'between',
   * radius?: 'control' | 'panel', loading?: boolean, fullWidth?: boolean, display?: 'inline' | 'block',
   * children?: import('svelte').Snippet, element?: HTMLButtonElement
   * }} */
  let {
    variant = 'primary', size = 'default', align = 'center', radius = 'control',
    fullWidth = false, display = 'inline', loading = false, disabled = false, type = 'button', class: className = '',
    children, element = $bindable(), ...rest
  } = $props();

  const variants = {
    primary: 'bg-accent text-on-accent hover:bg-accent-hover font-bold',
    secondary: 'border border-line bg-surface-subtle text-body hover:border-accent font-semibold',
    plain: 'font-medium',
    ghost: 'text-muted hover:text-ink font-medium',
    link: 'text-accent-text underline underline-offset-4 hover:text-ink font-medium',
    filter: 'group border border-line bg-surface text-body font-semibold hover:border-family aria-pressed:border-family aria-pressed:bg-family-soft aria-pressed:ring-1 aria-pressed:ring-inset aria-pressed:ring-family aria-pressed:text-ink',
    shade: 'border border-transparent text-body text-left hover:bg-surface aria-pressed:border-accent aria-pressed:bg-surface aria-pressed:text-accent-text aria-pressed:font-bold',
    theme: 'text-muted hover:text-ink aria-pressed:bg-surface-raised aria-pressed:text-accent-text aria-pressed:shadow-sm',
  };
  const sizes = {
    default: 'min-h-11 px-4 py-3 text-sm',
    compact: 'min-h-11 px-3 py-2 text-sm',
    icon: 'size-11 shrink-0 p-2.5',
    bare: 'min-h-11 p-0 text-sm',
    shade: 'min-h-12 p-2.5 text-sm',
  };
  const alignments = { center: 'justify-center', start: 'justify-start', between: 'justify-between' };
  const radii = { control: 'rounded-control', panel: 'rounded-panel' };
</script>

<button bind:this={element} {...rest} {type} disabled={disabled || loading} aria-busy={loading || undefined}
  class={`${fullWidth || display === 'block' ? 'flex' : 'inline-flex'} ${fullWidth ? 'w-full' : ''} items-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${alignments[align]} ${radii[radius]} ${className}`}>
  {@render children?.()}
</button>
