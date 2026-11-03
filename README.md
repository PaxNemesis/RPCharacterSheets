# RPCharacterSheets

Fillable character sheets for tabletop roleplaying games, with automatic totals, several characters open in tabs, browser autosave, and saving to and opening from files. React + TypeScript app built with Vite and pnpm, deployed to GitHub Pages.

Supported systems:

- **Iron Kingdoms: Full Metal Fantasy**: core rules, plus Kings, Nations, and Gods and Urban Adventure.
- **Fabula Ultima**: core rules, the High, Natural, Techno and Low Fantasy Atlases, and the Necromancer and Ace of Cards bonus classes.

Rules data is limited to names, numbers and page references; the sheets point to the rulebooks for rules text.

## Adding a game system

Each system is a page in `src/pages/<System>/` that renders the shared `CharacterWorkspace` with a `SheetSystem` definition: an id, a data `version`, `createCharacter`, `getName`, a `Sheet` component, and optionally `migrate`, `listItems` (blank entries for the character's lists) and `normalize` (keeps the data consistent after every change). The sheet is built from the shared field components (`TextField`, `NumberField`, `RepeatTable`, `CheckTrack`, `ImageField`, …), which read and write the character by path through `SheetProvider`. Calculated values are worked out from the data on every render and never saved.

Saved files look like `{ "system": "<id>", "version": 1, "savedAt": "…", "id": "…", "data": { … } }`, or with `"characters": [{ "id": "…", "data": { … } }, …]` when all open characters are saved at once. The `id` lets the sheet notice when an opened character is already open in a tab, and ask whether to replace it, open a copy, or skip it.

When the data shape changes, bump `version` and upgrade old data in the system's `migrate` function. On load, missing fields are filled from `createCharacter`, values of the wrong type are replaced by the default, and list entries are checked against `listItems`, so a damaged or hand-edited file can't break the sheet. See [AGENTS.md](AGENTS.md) for the full checklist.

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
