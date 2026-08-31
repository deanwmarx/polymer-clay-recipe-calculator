# FIMO Clay Colour Recipe Generator

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