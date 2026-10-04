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
npx tsc --noEmit
npm run build
```

## Product images and documentation

The twelve homepage demos are preserved. Their PNG previews live in `public/images/product`; titles, guide links and concept labels are centralized in `lib/product-cards.ts`. Images are captures of the website demonstrations, not claims about released application features.

The product docs include Studio, Source, the workflow model, typed functions, Git proposals, previews, runs, credentials, self-hosting, security, API/MCP, troubleshooting and capability status. Update capability status when a release is actually verified.

To recapture assets, start the site, visit it with Playwright at 1200px desktop width in light mode, scroll each `[data-product-preview]` into view, wait for its animation, then screenshot that element to its matching image path. Check narrower layouts separately. Do not include private app data or tokens in public assets.

## Product repository

Flowcordia is developed at [flowcordia/flowcordia](https://github.com/flowcordia/flowcordia).

## Attribution

The website foundation includes substantial portions of [Motion Primitives](https://github.com/ibelick/motion-primitives), used under its MIT license. The original copyright and license notice remain in this repository.

## License

See [LICENCE.md](/LICENCE.md).
