# Polymer Clay Recipe Calculator

A tool that converts the FIMO True Colours mixing leporello into an interactive, human-readable colour recipe generator. Select a target colour, set your total payload weight in grams, and get a precise mixing ratio you can download as an image.

## Features

- Select any colour from the FIMO True Colours system
- Input desired total payload (grams)
- Auto-calculates raw colour ratios based on FIMO's mixing system
- Export recipe as a downloadable image

## Stack

- **Svelte** – UI framework
- **Tailwind CSS** – styling
- **html2canvas-pro** – recipe image export

## Getting started

```bash
npm install
```

## Developing

```bash
npm run dev

# or open in browser automatically
npm run dev -- --open
```

## Building

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

> You may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target deployment environment.

## Reference

Mixing ratios based on the [FIMO True Colours](https://e.staedtlercdn.com/fileadmin/user_upload/Content/Ratgeber/R25-The-FIMO-professional-colour-mixing-system/FIMO-True-Colours-Leporello.pdf?1741873957&_gl=1*1e0bgxx*_ga*MTAyNjM5Nzk2LjE3ODgxOTgwMTk.*_ga_071N0LCBP5*czE3ODgxOTgwMTkkbzEkZzAkdDE3ODgxOTgwMjAkajU5JGwwJGg5NjE3OTg2MjI.*_ga_YEC3WBN8EG*czE3ODgxOTgwMTkkbzEkZzAkdDE3ODgxOTgwMjAkajU5JGwwJGg3MDk3ODQyMDY.*_gcl_au*MTIzMDA1NzE0My4xNzg4MTk4MDIw) colour mixing system (Leporello).
## Theme and design tokens

The Tailwind v4 theme lives in `src/routes/layout.css` defines the shared theme:

- **Reference tokens:** `clay-violet`, `clay-pink`, `clay-cyan`, `clay-yellow`, and the other bright clay colours. Use these for decorative colour and family markers.
- **Semantic tokens:** `surface-canvas`, `surface`, `surface-subtle`, `ink`, `body`, `muted`, `line`, `accent`, `on-accent`, and `focus`. Use utilities such as `bg-surface`, `text-ink`, and `border-line` for interface elements. Their values adapt to the active mode.
- **Control tokens:** `rounded-control`, `rounded-panel`, `family`, `family-soft`, and the shared shadow tokens keep controls consistent. Component layout, interaction states, and spacing use Tailwind utilities; there are no custom component CSS selectors.

Appearance defaults to **System** and follows device changes while the app is open. Mobile shows one button that switches between Light and Dark, starting with the resolved system appearance; desktop also exposes the System option. Choosing Light or Dark saves an override in `clay-colour-theme`; choosing System removes it. A small script in `src/app.html` applies the mode before first paint, and `src/lib/components/layout/ThemeToggle.svelte` manages the controls and live updates. The `dark:` variant follows `data-theme`, so it also respects explicit overrides.

Palette swatch hex colours are independent of the interface theme and remain identical in both modes. Recipe image exports use the current theme.

## Planned GitHub Pages URL

The production build targets `https://deanwmarx.github.io/polymer-clay-recipe-calculator/`. Local development continues at `/`; `npm run preview` serves the built app at `/polymer-clay-recipe-calculator/`.

To serve it as part of the existing personal site, put the contents of `build/` inside that site's `polymer-clay-recipe-calculator/` directory. Preserve the `_app/` assets when publishing. If that site uses a Jekyll build, its root needs `.nojekyll` or an equivalent configuration that retains those assets.

The page is prerendered with its content and SEO metadata. Its canonical URL, Open Graph URL, structured data, and sitemap use the planned URL with a trailing slash. The sitemap is available at `/polymer-clay-recipe-calculator/sitemap.xml`. Add that sitemap URL to the personal site's **root** `robots.txt`, or submit it directly to your search console; a `robots.txt` inside this subdirectory does not control crawling for the domain.

## Installable app and offline use

`static/manifest.webmanifest` defines the app name, standalone display, launch scope and install icons. All manifest URLs are relative to its directory, so installation stays within the calculator's GitHub Pages subdirectory. The PNG icons reuse the clay logo, with a separate maskable icon and Apple touch icon.

SvelteKit automatically registers `src/service-worker.js` in production. It precaches the calculator and its assets for offline use after the initial successful online visit. Navigations try the network first and fall back to the cached calculator offline. Cache cleanup only removes this app's old versioned caches, preserving other apps on the same origin. Updates activate after windows using the previous version close.

Use `npm run build` and `npm run preview` to check the production PWA at the configured subpath. Service workers are not installed by the development server. The deployed app should use HTTPS; localhost also supports service-worker testing. Installation is available through the browser's install or Add to Home Screen controls.

Run `node --test tests/colourMixer.test.js tests/service-worker.test.js` to check mixing calculations and offline/cache-isolation behaviour.

The mobile footer's **Save app to your phone** action uses the browser's `beforeinstallprompt` event when available. Otherwise, it opens device-specific installation instructions (Safari Share → Add to Home Screen on iOS; the install/home-screen browser menu on Android). The action is hidden on desktop, when running in standalone mode, or after an accepted install. The guide uses a native modal dialog with Escape/Close support and focus return.

On mobile, a small non-modal install suggestion appears once after five seconds of visible browsing (the current testing delay; `HINT_DELAY_MS` in `src/lib/components/install/InstallApp.svelte` should become `60_000` for release). It waits while filters or a recipe sheet are open and is suppressed for installed apps. Showing it records `clay-colour-install-hint-seen` in local storage, so it does not reappear after reload or on later visits. The suggestion offers Save app and Dismiss forever, and explains that the mobile footer installation link remains available. No install suggestion appears on desktop.

## Component structure

`src/routes/+page.svelte` coordinates selection, batch weight, and the mobile sheet. Feature components live under `src/lib/components/`:

- `ui/`: `Button` owns primary, secondary, plain, ghost, link, filter, shade, and theme variants, sizes, loading states and full-width layout. `Icon` centralizes SVGs. `Disclosure` uses Svelte `slide`; `BottomSheet` owns fly transitions, drag dismissal, backdrop dismissal and focus; `Modal` is the shared centred dialog.
- `palette/`: filters, responsive palette layout, and a single swatch component used for both mobile cards and desktop tiles.
- `recipe/`: the card, ingredient table, preparation steps, download controller, empty state, and mobile launcher.
- `layout/`: header, footer, and theme controls.
- `install/`: install prompt logic and platform instructions.

Reuse those components rather than copying button styles, icons, swatches, or dialog behaviour. Add shared control variants in `ui/Button.svelte`; use semantic Tailwind tokens instead of choosing new raw colours in components. Responsive and reduced-motion checks share `src/lib/media.svelte.js`. Image capture lives in `src/lib/exportRecipe.js`; its measured width and canvas coordinates are export geometry, while the cloned card uses Tailwind styling.
