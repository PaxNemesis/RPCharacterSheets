import type { ComponentType } from 'react'

/** Everything the workspace needs to know about one game system. */
export type SheetSystem<T> = {
  /** Stable id, written into saved files and used as the browser storage key. */
  id: string
  title: string
  /** Bump when the data shape changes, and handle the old shape in `migrate`. */
  version: number
  createCharacter: () => T
  /**
   * Blank entries for the character's lists, keyed by the list's path without indexes (such as
   * 'classes.skills'), so loaded entries can be checked and completed. A list without one uses the
   * first entry of its default list, if any.
   */
  listItems?: ListItems
  /** Upgrades data saved by an older version of this system's sheet. */
  migrate?: (data: unknown, fromVersion: number) => unknown
  getName: (data: T) => string
  /** Renders the sheet. Fields read and write the character through SheetProvider. */
  Sheet: ComponentType
}

export type ListItems = Record<string, unknown>

/** The JSON file format for a saved character. */
export type CharacterFile = {
  system: string
  version: number
  data: unknown
}

export type OpenCharacter<T> = {
  id: string
  data: T
}
