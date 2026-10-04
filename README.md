# Flowcordia Site

The public website and documentation for Flowcordia, an open-source Git-native workflow platform where visual builders and developers collaborate on the same reviewed workflow.

This repository preserves the visual and motion system of Motion Primitives while replacing the public product content with Flowcordia’s real workflow model.

## Development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run lint
npm run check:docs
npx tsc --noEmit
npm run build
```

## Product images and documentation

The homepage keeps seven substantial demos and uses two concept illustrations for Policy and Workflow views. Three isolated interaction studies remain in the tour archive, not the homepage. Assets live in `public/images/product`; titles and guide links are centralized in `lib/product-cards.ts`. Concept illustrations are not screenshots of released features.

Two illustrations were generated with the built-in image generation tool and optimized to WebP with Sharp. To re-optimize source PNGs named `policy-illustration.png` and `workflow-views-illustration.png`, run `node scripts/optimize-product-images.cjs SOURCE_DIRECTORY`.

Runtime documentation linked from the app is defined in `lib/app-doc-guides.ts`. Re-audit a current app checkout with `node scripts/audit-app-docs.cjs PATH_TO_APP_CHECKOUT` and update `scripts/app-doc-links.json` from its output. `npm run check:docs` verifies the recorded destinations and section anchors. Audit again when app links change; the inventory is not a guarantee about future releases.

The product docs include Studio, Source, the workflow model, typed functions, Git proposals, previews, runs, credentials, self-hosting, security, API/MCP, troubleshooting and capability status. Update capability status when a release is actually verified.

To recapture assets, start the site, visit it with Playwright at 1200px desktop width in light mode, scroll each `[data-product-preview]` into view, wait for its animation, then screenshot that element to its matching image path. Check narrower layouts separately. Do not include private app data or tokens in public assets.

## Product repository

Flowcordia is developed at [flowcordia/flowcordia](https://github.com/flowcordia/flowcordia).

## Attribution

The website foundation includes substantial portions of [Motion Primitives](https://github.com/ibelick/motion-primitives), used under its MIT license. The original copyright and license notice remain in this repository.

## License

See [LICENCE.md](/LICENCE.md).
