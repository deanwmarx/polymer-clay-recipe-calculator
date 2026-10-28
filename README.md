# Polymer Clay Recipe Calculator

A tool that converts the FIMO True Colours mixing leporello into an interactive, human-readable colour recipe generator. Select a target colour, set your total payload weight in grams, and get a precise mixing ratio you can download as an image.

## Features

- Select any colour from the FIMO True Colours system
- Input desired total payload (grams)
- Auto-calculates raw colour ratios based on FIMO's mixing system
- Export recipe as a downloadable image

## Stack

- **Svelte 5 / SvelteKit 3** – UI framework and static rendering
- **Vite 8** – development server and production builds
- **TypeScript 6** – JavaScript and Svelte checks (the supported major for SvelteKit 3.1 and svelte-check)
- **Tailwind CSS** – styling
- **html2canvas-pro** – recipe image export

## Getting started

Use Node.js 24 (also specified in `.nvmrc` and used by CI).

```bash
npm ci
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

The static adapter is configured in `vite.config.js`. Shared library imports use the `#lib` subpath mapping in `package.json`. `npm run check` checks both the app and the separate service-worker TypeScript project.

## Reference

Mixing ratios based on the [FIMO True Colours](https://e.staedtlercdn.com/fileadmin/user_upload/Content/Ratgeber/R25-The-FIMO-professional-colour-mixing-system/FIMO-True-Colours-Leporello.pdf?1741873957&_gl=1*1e0bgxx*_ga*MTAyNjM5Nzk2LjE3ODgxOTgwMTk.*_ga_071N0LCBP5*czE3ODgxOTgwMTkkbzEkZzAkdDE3ODgxOTgwMjAkajU5JGwwJGg5NjE3OTg2MjI.*_ga_YEC3WBN8EG*czE3ODgxOTgwMTkkbzEkZzAkdDE3ODgxOTgwMjAkajU5JGwwJGg3MDk3ODQyMDY.*_gcl_au*MTIzMDA1NzE0My4xNzg4MTk4MDIw) colour mixing system (Leporello).
## Theme and design tokens

The Tailwind v4 theme lives in `src/routes/layout.css` defines the shared theme:

- **Reference tokens:** `clay-violet`, `clay-pink`, `clay-cyan`, `clay-yellow`, and the other bright clay colours. Use these for decorative colour and family markers.
- **Semantic tokens:** `surface-canvas`, `surface`, `surface-subtle`, `ink`, `body`, `muted`, `line`, `accent`, `on-accent`, and `focus`. Use utilities such as `bg-surface`, `text-ink`, and `border-line` for interface elements. Their values adapt to the active mode.
- **Control tokens:** `rounded-control`, `rounded-panel`, `family`, `family-soft`, and the shared shadow tokens keep controls consistent. Component layout, interaction states, and spacing use Tailwind utilities; there are no custom component CSS selectors.

Appearance defaults to **System** and follows device changes while the app is open. Mobile shows one button that switches between Light and Dark, starting with the resolved system appearance; desktop also exposes the System option. Choosing Light or Dark saves an override in `clay-colour-theme`; choosing System removes it. A small script in `src/app.html` applies the mode before first paint, and `src/lib/components/layout/ThemeToggle.svelte` manages the controls and live updates. The `dark:` variant follows `data-theme`, so it also respects explicit overrides.

Palette swatch hex colours are independent of the interface theme and remain identical in both modes. Recipe image exports use the current theme.

## GitHub Pages deployment

The production build targets `https://deanwmarx.github.io/polymer-clay-recipe-calculator/`. Local development continues at `/`; `npm run preview` serves the built app at `/polymer-clay-recipe-calculator/`.

The repository must be named `polymer-clay-recipe-calculator`, with **Settings → Pages → Source** set to **GitHub Actions**. `.github/workflows/deploy.yml` checks, tests, builds and deploys the `build/` directory on pushes to `main`, or when run manually. This project site deploys independently of the portfolio repository.

The page is prerendered with its content and SEO metadata. Its canonical URL, Open Graph URL, structured data, and sitemap use the public URL with a trailing slash. The sitemap is available at `/polymer-clay-recipe-calculator/sitemap.xml`. Add that sitemap URL to the personal site's **root** `robots.txt`, or submit it directly to your search console; a `robots.txt` inside this subdirectory does not control crawling for the domain.

## Installable app and offline use

`static/manifest.webmanifest` defines the app name, standalone display, launch scope and install icons. All manifest URLs are relative to its directory, so installation stays within the calculator's GitHub Pages subdirectory. The PNG icons reuse the clay logo, with a separate maskable icon and Apple touch icon.

SvelteKit automatically registers `src/service-worker/index.js` in production. It precaches the calculator and its assets for offline use after the initial successful online visit. Navigations try the network first and fall back to the cached calculator offline. Cache cleanup only removes this app's old versioned caches, preserving other apps on the same origin. Updates activate after windows using the previous version close.

Use `npm run build` and `npm run preview` to check the production PWA at the configured subpath. Service workers are not installed by the development server. The deployed app should use HTTPS; localhost also supports service-worker testing. Installation is available through the browser's install or Add to Home Screen controls.

Run `node --test tests/colourMixer.test.js tests/service-worker.test.js` to check mixing calculations and offline/cache-isolation behaviour.

The mobile footer's **Save app to your phone** action uses the browser's `beforeinstallprompt` event when available. Otherwise, it opens device-specific installation instructions (Safari Share → Add to Home Screen on iOS; the install/home-screen browser menu on Android). The action is hidden on desktop, when running in standalone mode, or after an accepted install. The guide uses a native modal dialog with Escape/Close support and focus return.

On mobile, a small non-modal install suggestion appears once after one minute of visible browsing (`HINT_DELAY_MS` in `src/lib/components/install/InstallApp.svelte`). It waits while filters or a recipe sheet are open and is suppressed for installed apps. Showing it records `clay-colour-install-hint-seen` in local storage, so it does not reappear after reload or on later visits. The suggestion offers Save app and Dismiss forever, and explains that the mobile footer installation link remains available. No install suggestion appears on desktop.

## Component structure

`src/routes/+page.svelte` coordinates selection, batch weight, and the mobile sheet. Feature components live under `src/lib/components/`:

- `ui/`: `Button` owns primary, secondary, plain, ghost, link, filter, shade, and theme variants, sizes, loading states and full-width layout. `Icon` centralizes SVGs. `Disclosure` uses Svelte `slide`; `BottomSheet` owns fly transitions, drag dismissal, backdrop dismissal and focus; `Modal` is the shared centred dialog.
- `palette/`: filters, responsive palette layout, and a single swatch component used for both mobile cards and desktop tiles.
- `recipe/`: the card, ingredient table, preparation steps, download controller, empty state, and mobile launcher.
- `layout/`: header, footer, and theme controls.
- `install/`: install prompt logic and platform instructions.

Reuse those components rather than copying button styles, icons, swatches, or dialog behaviour. Add shared control variants in `ui/Button.svelte`; use semantic Tailwind tokens instead of choosing new raw colours in components. Responsive and reduced-motion checks share `src/lib/media.svelte.js`. Image capture lives in `src/lib/exportRecipe.js`; its measured width and canvas coordinates are export geometry, while the cloned card uses Tailwind styling.
