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

## Getting started

The app is written in [TypeScript](https://www.typescriptlang.org/) (JavaScript with types) using [React](https://react.dev/) for the UI. [Vite](https://vite.dev/) runs the dev server and builds the site, and [pnpm](https://pnpm.io/) installs the libraries it depends on. All of them run on [Node.js](https://nodejs.org/).

### Prerequisites

- [Git](https://git-scm.com/)
- Node.js 24 (the version in `.nvmrc`). Install it from [nodejs.org](https://nodejs.org/), or with a version manager such as [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm), which can read `.nvmrc` (`nvm use`, `fnm use`).

### Setup

Run these in a terminal:

```sh
git clone https://github.com/PaxNemesis/RPCharacterSheets.git
cd RPCharacterSheets
corepack enable pnpm   # once; makes the pnpm command available
pnpm install           # downloads dependencies into node_modules/
```

Corepack comes with Node 24. Newer Node versions no longer include it, so there you'd run `npm install -g corepack` first.

`node_modules/` isn't committed. Run `pnpm install` again after pulling changes to `package.json` or `pnpm-lock.yaml`. If you see errors about a missing module or package, that's usually the fix.

### Running the app

```sh
pnpm dev
```

This starts a dev server and prints its address, usually http://localhost:5173 (Vite picks another port if that one is taken). Open it in a browser. It keeps running until you press Ctrl+C, and the page updates by itself when you save a file.

### Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Starts the dev server. |
| `pnpm build` | Builds the site into `dist/`, then type-checks the code. |
| `pnpm preview` | Serves the built `dist/` locally, to check the production build. |
| `pnpm lint` | Checks the code for common mistakes with oxlint. |
| `pnpm test` | Runs the unit tests once (`pnpm test:watch` reruns them as you edit). |

Make sure `pnpm build`, `pnpm lint` and `pnpm test` pass before pushing. The deploy runs the tests and the build, and stops if either fails.

### Where things are

- `src/pages/<System>/`: a game system's sheet, plus its rules data and formulas.
- `src/components/`: shared pieces, such as the field components, the character tabs and save/load (`CharacterWorkspace`) and the page layout (`RootLayout`).
- `src/routes/`: one small file per URL, pointing at a page. See [Routing](#routing).
- `src/index.css`: global styles, colours and spacing.

Code conventions (folder layout, naming, styles) are in [.github/instructions/frontend.instructions.md](.github/instructions/frontend.instructions.md).

Any editor works. [VS Code](https://code.visualstudio.com/) understands TypeScript with no setup, and its oxlint extension shows lint warnings as you type.

### Where characters are saved

Open characters autosave to the browser's local storage, so they stay in that browser on that device. Clearing the site's data deletes them. The dev server (`localhost`) and the deployed site each have their own storage, so characters made in one don't show up in the other. To keep a character or move it somewhere else, save it to a JSON file.

## Routing

Routing uses [TanStack Router](https://tanstack.com/router) with file-based routes. Each file in `src/routes` defines a route (`about.tsx` → `/about`) and points at a page component in `src/pages`; `__root.tsx` uses the shared layout in `src/components/RootLayout`.
The Vite plugin regenerates `src/routeTree.gen.ts` whenever routes change. It's committed so types work without a build, so don't edit it by hand.

## Deployment

Every push to `main` builds and deploys the site via `.github/workflows/deploy.yml`.
One-time setup: in the GitHub repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.

The site is served at `https://<user>.github.io/<repo-name>/`; the workflow sets Vite's `base` from the repo name automatically.
Deep links like `/about` work because the workflow also publishes `index.html` as `404.html`.
