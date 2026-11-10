import type { ComponentType } from 'react';

/** Everything the workspace needs to know about one game system. */
export type SheetSystem<T> = {
  /** Stable id, written into saved files and used as the browser storage key. */
  id: string;
  title: string;
  /** Bump when the data shape changes, and handle the old shape in `migrate`. */
  version: number;
  createCharacter: () => T;
  /**
   * Blank entries for the character's lists, keyed by the list's path without indexes (such as
   * 'classes.skills'), so loaded entries can be checked and completed. A list without one uses the
   * first entry of its default list, if any.
   */
  listItems?: ListItems;
  /** Keeps the data consistent after every change, such as emptying a hand a two-handed weapon needs. */
  normalize?: (data: T) => T;
  /** Upgrades data saved by an older version of this system's sheet. */
  migrate?: (data: unknown, fromVersion: number) => unknown;
  getName: (data: T) => string;
  /**
   * The character as a fillable PDF, if the system has one. Load the PDF code inside it (a dynamic
   * import), so it only downloads when someone exports.
   */
  exportPdf?: (data: T) => Promise<Uint8Array>;
  /** Renders the sheet. Fields read and write the character through SheetProvider. */
  Sheet: ComponentType<SheetProps>;
};

/** What a sheet gets from the workspace: which of its panels (tabs) to show, and how to change it. */
export type SheetProps = {
  /** The panel's id; undefined or unknown shows the sheet's first panel. */
  panel?: string;
  onPanelChange: (panel: string) => void;
};

/**
 * Where the workspace is shown, such as the URL /<game>/<character>?panel=<panel>: the character and
 * panel it names, and how to change them.
 */
export type WorkspaceLocation = {
  characterId?: string;
  panel?: string;
  /** Shows this character; `replace` swaps the current history entry instead of adding one. */
  showCharacter: (id: string, options: { replace: boolean }) => void;
  showPanel: (panel: string) => void;
};

export type ListItems = Record<string, unknown>;

/**
 * The JSON file format: one character (`id` and `data`) or all open characters at once
 * (`characters`). The ids let a file that is opened again be matched with its open tab.
 */
export type CharacterFile = {
  system: string;
  version: number;
  /** When the file was saved, as an ISO date; missing in older files. */
  savedAt?: string;
  id?: string;
  data?: unknown;
  characters?: { id?: string; data: unknown }[];
};

/** A character read from a file; `id` is missing in files saved before ids were written. */
export type FileCharacter<T> = { id?: string; data: T };

export type OpenCharacter<T> = {
  id: string;
  data: T;
};
