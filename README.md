# Flowcordia Site

The public website and documentation foundation for Flowcordia.

Flowcordia is a Git-native workflow platform where visual builders and developers collaborate on the same reviewed workflow.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality gates

```bash
npm run lint
npm run typecheck
npm run build
```

## Structure

- `app/` — marketing pages, documentation routes, metadata, and global styles
- `components/` — original Flowcordia UI, motion, diagrams, and site chrome
- `public/` — static public assets

The first release deliberately avoids template-specific abstractions. Product demonstrations are implemented as accessible interface components so they can evolve alongside the real application.
