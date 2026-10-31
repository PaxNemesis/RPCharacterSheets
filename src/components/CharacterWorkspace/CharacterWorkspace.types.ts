import type { ComponentType } from 'react'

/** Everything the workspace needs to know about one game system. */
export type SheetSystem<T> = {
  /** Stable id, written into saved files and used as the browser storage key. */
  id: string
  title: string
  /** Bump when the data shape changes, and handle the old shape in `migrate`. */
  version: number
  createCharacter: () => T
  /** Upgrades data saved by an older version of this system's sheet. */
  migrate?: (data: unknown, fromVersion: number) => unknown
  getName: (data: T) => string
  /** Renders the sheet. Fields read and write the character through SheetProvider. */
  Sheet: ComponentType
}

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
