# Fesq — fesq.in

Official site for Fesq — fesq.in. Built with Astro, deployed to GitHub Pages.

## Local development

```sh
bun install
bun run dev
```

Open http://localhost:4321.

## Build

```sh
bun run build
```

Output lands in `dist/`.

## Deploy

Push to `main` triggers the GitHub Actions workflow that builds and deploys to GitHub Pages.

## How to add a product

Add a new markdown file to `src/content/products/`:

```markdown
---
title: Product name
tagline: One-line summary for cards.
order: 7
status: live
---

Body text describing the product.
```

`status` is `live` or `in-progress` (shown as an "In development" badge). Optional `externalUrl` makes the product card link out instead of to a detail page.

Journal (blog) lives in the fesq-blog repo — https://blog.fesq.in.
