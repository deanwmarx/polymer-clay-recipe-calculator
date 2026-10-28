<script>
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import { asset } from '$app/paths';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="manifest" href={asset('manifest.webmanifest')} />
	<link rel="apple-touch-icon" sizes="180x180" href={asset('icons/apple-touch-icon.png')} />
	<meta name="theme-color" content="#7534df" />
	<meta name="apple-mobile-web-app-title" content="Clay Recipes" />
</svelte:head>
{@render children()}
