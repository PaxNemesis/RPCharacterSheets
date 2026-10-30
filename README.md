# Fabula Ultima

React + TypeScript app built with Vite and pnpm, deployed to GitHub Pages.

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
