# festum.github.io

Personal portfolio website, migrated to React + TypeScript and managed with Bun.

## Stack

- React 18
- TypeScript
- Vite (dev server)
- Bun build pipeline for deploy output
- Pico CSS + Tailwind utilities/transitions
- Effects: `react-scroll`, `countup.js`, `react-intersection-observer`

## Structure

```text
.
├── CNAME
├── dev.html
├── index.html                 # deploy entry (generated)
├── package.json
├── bun.lock
├── tailwind.config.cjs
├── scripts/
│   └── publish-static.mjs
├── assets/                    # deploy assets (generated)
├── public/
│   └── assets/                # source static resources
└── src/
    ├── App.tsx
    ├── main.tsx              # dev entry
    ├── main.file.tsx         # file/http deploy bundle entry
    ├── tailwind.input.css
    ├── theme.css             # dev styling imports
    └── file-overrides.css    # deploy dark-mode/override styles
```

## Local development

```bash
bun install
bun run dev
```

Open `http://127.0.0.1:5173/dev.html`.

## Build

```bash
bun run build
```

Build steps:
- compile Tailwind utilities to `dist/tailwind.css`
- bundle React app to `dist/app.js` (IIFE)
- publish generated `index.html` + slim `assets/` to repo root

## Deploy

This repository is served as static files directly from `main`, so run `bun run build` before pushing.

## Static access

- `file:///.../index.html` works.
- `http://...` static hosting (including GitHub Pages) works.

## Maintenance

- Keep source media/font/vendor files in `public/assets`.
- Keep app logic in `src`.
- Keep behavioral effects in React libraries, not legacy jQuery plugins.

