---
description: 'Frontend code structure conventions for React/TypeScript: component folders, file size, naming, components versus helpers, props, hooks, contexts, styles, index entry points, encapsulation and import rules.'
applyTo: '**/*.{ts,tsx}'
---

# Frontend code structure

## Scope

- These rules apply to components, pages and features alike. Pages and features use the same folder layout, entry point and encapsulation rules.
- Never edit generated code (for example API clients or GraphQL types produced by a code generator). It is overwritten on regeneration and does not follow these rules.
- When working in an existing project, follow its established conventions where they conflict with these rules, and don't restructure existing code unless that is the task.

## File size

- Keep files below ~150 lines.
- When a file grows past that, split it: components into sub-components, and helpers into separate files in `utils/`.
- If a file needs to stay longer, add a one-line comment at the top explaining why, and tell the developer.

## One component per file

- A component file contains exactly one component.
- Every other component lives in the `components/` folder of the component that uses it, or higher up if it is shared (see Encapsulation).

## Component folder layout

Every component lives in its own folder named after the component. The main component is the top-level component that encapsulates its sub-components. Code outside the folder only uses it through its `index.ts`.

```
Button/
  index.ts                 # the only entry point
  Button.tsx               # the main component
  Button.styles.scss       # styles
  Button.types.ts          # types
  __tests__/
    Button.test.tsx
  components/              # sub-components, private to Button
    index.ts               # exports the sub-components
    ButtonIcon/            # sub-component with its own files
      index.ts
      ButtonIcon.tsx
      ButtonIcon.styles.scss
    ButtonBadge.tsx        # small, self-contained sub-component
  hooks/                   # hooks specific to Button
    useButtonState.ts
  utils/                   # helpers, private to Button
    formatLabel.ts
```

- Each kind of supporting code (styles, types, utils, constants) lives either in one file named after the component (`<Component>.styles.*`, `<Component>.types.ts`, `<Component>.utils.ts`, `<Component>.constants.ts`) or in a `<kind>/` folder (`utils/`, `types/`, `hooks/`, `constants/`), never both. Start with the file. Once a folder is needed, move everything of that kind into it.
- Rules below that mention one form, such as `utils/` or `<Component>.types.ts`, apply to the other as well.
- Put tests in a `__tests__/` folder inside the component folder.

### Sub-components

- Sub-components live in `components/`. Normally each one has its own folder with its own `index.ts`.
- `components/` has an `index.ts` that exports its sub-components with explicit named exports. The owning component imports them from `./components`.
- A small, self-contained sub-component can be a single file directly in `components/` (`components/ButtonBadge.tsx`). This applies only if it needs no styles, types, hooks, utils, tests or sub-components of its own. Reusing styles from the main component does not count.
- As soon as a single-file sub-component needs any additional file, move it into its own folder with an `index.ts`.
- Sub-components follow these same rules, including file size, one component per file, and their own `components/` folder.
- `components/` contains only its `index.ts` and sub-components. Don't use it for grouping folders such as `columns/`; put related helpers in a sub-folder of `utils/` instead, for example `utils/columns/`.

## Naming

- The folder, the main component file and the component itself all have exactly the same name (`Button/Button.tsx` exports `Button`). Rename all three together.
- Use PascalCase for component folders and component files (`Button/`, `Button.tsx`).
- Exception: if a project already uses camelCase component folders (`button/Button.tsx`), keep using camelCase folders in that project. Don't mix casings within a project.
- Use camelCase for hooks, utils and other non-component files (`useButtonState.ts`, `formatLabel.ts`). `<Component>.<kind>.*` files keep the component's name.
- Hooks start with `use`.

## Components versus helpers

- A component is a function used as a JSX element (`<Foo />`) or passed to a library as a renderer (for example `cellRenderer` or `headerComponent`). Name it, and its file, in PascalCase.
- Any other function is a helper, even if it returns JSX or config containing renderers (for example a column definition factory). Name it, and its file, in camelCase.
- A file that exports a single component or helper is named after it. A `.tsx` extension does not make a file a component file.
- Small helpers used only by one component may stay in its file, but never export them from it.
- Move a helper to `utils/` if it is needed outside the component file (including tests), or if helpers start to crowd out the component itself, even when the file is under the line limit.
- Never declare a component inside a helper file. If a renderer uses hooks or is more than a single JSX expression, make it a component in `components/` and reference it from the helper.

## Exports

- Always use named exports. Never use default exports, unless a framework or tool requires them (for example route files in some frameworks).

## Props

- Name props types `<Component>Props`.
- If nothing outside the component file uses the props type, define it in the component file itself.
- Otherwise, move it to `<Component>.types.ts`. Export it from the component's `index.ts` only if it is used outside the component's folder.

## Hooks

- A hook goes in the `hooks/` folder of the component that uses it, or higher up if it is shared (see Encapsulation).

## Contexts

- Every context must have a matching hook (`use<Context>`) that consumers use instead of calling `useContext` directly.
- Create the context with `undefined` as the default value, and have the hook throw a descriptive error when it is used outside its provider.
- Export the provider and the hook, never the raw context object.
- If consumers can legitimately render outside the provider, add a separate `useOptional<Context>` hook that returns `undefined` there, and let each caller handle the fallback.
- Only give a context a real default value when several optional consumers would otherwise duplicate the same fallback. Define the default as a named constant and add a one-line comment explaining why it is used outside the provider.

```ts
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

## Styles

- Use the project's existing styling approach. Don't add a styling dependency or switch approaches (for example to CSS Modules or CSS-in-JS) unless that is the task.
- Keep styles in `<Component>.styles.*` (or a `styles/` folder), imported from the component that owns them.
- With plain CSS or SCSS, apply styles with `className`. Give the outermost element a component-specific root class: `<component>-page` for a component rendered directly by a route, or `<component>-container` otherwise. Don't use generic root or wrapper class names, and scope selectors beneath the root class so styles don't leak into other components.
- Within a main component folder, prefer reusing existing styles over duplicating them. Sub-components may use styles defined in a containing component's stylesheet, but must not depend on a sibling's stylesheet. If siblings need the same style, move it to their parent's stylesheet.
- Create a separate stylesheet for a sub-component only for styles that are specific to it.
- Stylesheets are private like everything else, so never import them from outside the main component folder.

## Spacing

- Spacing (`padding`, `margin`, `gap`) uses multiples of 8px. Use 2px or 4px only for tight spots, such as between a label and its input, an icon and its text, or table cells.
- Use the spacing tokens from the global stylesheet instead of pixel values: `--space-2xs` (2px), `--space-xs` (4px), `--space-1` (8px), `--space-2` (16px), `--space-3` (24px), `--space-4` (32px). Add a larger token to the scale if one is needed, rather than a one-off value.
- For a negative margin, use `calc(-1 * var(--space-2))`.
- The rule covers spacing only. Borders, control sizes, widths and font sizes are not spacing, and a 1px margin that overlaps borders (as in a button group) stays as it is.

## Entry point: `index.ts`

- `index.ts` is the only entry point into a component folder.
- It exports only its component and, if consumers need them, its public types.
- Never export sub-components, utils, styles or internal helpers from `index.ts`.
- These rules apply to a component's own `index.ts`. `components/index.ts` is internal and only used by the component that owns the folder.

```ts
// Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button.types';
```

## Encapsulation

- Everything inside a component folder except `index.ts` is private to that component.
- Never import a sub-component, util, hook, style or type file from outside its main component folder.
- Within the same main component folder, sibling sub-components may use each other through each sibling's `index.ts` or its single file. Don't import siblings through `components/index.ts`, since that can create circular imports.
- A sub-component's own `components/`, `hooks/` and `utils/` are private to that sub-component. Siblings may only use it through its `index.ts`.
- Shared code lives in the lowest folder that contains all of its users:
  - Used only inside one main component: the `components/`, `hooks/` or `utils/` of the lowest component that contains all its users.
  - Used by more than one main component: the project's shared `components/`, `hooks/` or `utils/`.
- Only move code up a level once it is actually used there, not because it might be reused.

```ts
// Bad: reaches into another component's internals
import { ButtonIcon } from 'components/Button/components/ButtonIcon';
import { formatLabel } from 'components/Button/utils/formatLabel';

// Good: uses the public entry point
import { Button } from 'components/Button';
```

## Imports

- Inside a component folder, use relative imports (`./Button.styles.scss`, `./components`).
- When importing from outside the current main component folder, use the project's absolute path or alias (for example `baseUrl`/`paths` in `tsconfig.json`), never `../` relative paths.
- If part of the codebase doesn't support absolute paths or aliases, use relative imports there, including `../` paths.
- In a library package that is compiled by a consuming app, don't rely on tsconfig `paths` aliases such as `@/`, since the consuming app's alias would take over. Use relative imports or the package's own `imports` field in `package.json` (for example `#/*`).
- Import other components through their `index.ts`, never through an inner file.
