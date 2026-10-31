# RPCharacterSheets

Fillable character sheets for tabletop roleplaying games, with automatic totals, several characters open in tabs, and JSON save/load. React + TypeScript app built with Vite and pnpm, deployed to GitHub Pages.

Supported systems: Iron Kingdoms: Full Metal Fantasy. Fabula Ultima is planned.

## Adding a game system

Each system is a page in `src/pages/<System>/` that renders the shared `CharacterWorkspace` with a `SheetSystem` definition: an id, a data `version`, `createCharacter`, `getName` and a `Sheet` component. The sheet is built from the shared field components (`TextField`, `NumberField`, `RepeatTable`, `CheckTrack`, `ImageField`, …), which read and write the character by path through `SheetProvider`. Calculated values are worked out from the data on every render and never saved.

Saved files look like `{ "system": "<id>", "version": 1, "data": { … } }`. When the data shape changes, bump `version` and upgrade old data in the system's `migrate` function; missing fields are filled from `createCharacter` automatically.

## Development

```sh
corepack enable pnpm   # once, if pnpm isn't installed
pnpm install
pnpm dev               # http://localhost:5173
```

Other scripts: `pnpm build`, `pnpm preview`, `pnpm lint`.


## Routing

Routing uses [TanStack Router](https://tanstack.com/router) with file-based routes. Each file in `src/routes` defines a route (`about.tsx` → `/about`) and points at a page component in `src/pages`; `__root.tsx` uses the shared layout in `src/components/RootLayout`.
The Vite plugin regenerates `src/routeTree.gen.ts` whenever routes change. It's committed so types work without a build, so don't edit it by hand.

## Deployment

Every push to `main` builds and deploys the site via `.github/workflows/deploy.yml`.
One-time setup: in the GitHub repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.

The site is served at `https://<user>.github.io/<repo-name>/`; the workflow sets Vite's `base` from the repo name automatically.
Deep links like `/about` work because the workflow also publishes `index.html` as `404.html`.
