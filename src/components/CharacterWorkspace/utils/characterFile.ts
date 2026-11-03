import type { CharacterFile, SheetSystem } from '../CharacterWorkspace.types'
import { mergeDefaults } from './mergeDefaults'

/** Upgrades data from an older version and fills in any missing fields. */
export function normalizeCharacter<T>(system: SheetSystem<T>, data: unknown, version: number): T {
  const upgraded = version < system.version && system.migrate ? system.migrate(data, version) : data
  return mergeDefaults(system.createCharacter(), upgraded, system.listItems)
}

/** Reads a saved file: one character (`data`) or several (`characters`), from Save all characters. */
export function parseCharacterFile<T>(system: SheetSystem<T>, text: string): T[] {
  let file: Partial<CharacterFile>
  try {
    file = JSON.parse(text) as Partial<CharacterFile>
  } catch {
    throw new Error('is not a character file')
  }
  if (file === null || typeof file !== 'object') throw new Error('is not a character file')
  const entries = Array.isArray(file.characters) ? file.characters : [file.data]
  if (entries.length === 0 || entries.some((entry) => entry === null || typeof entry !== 'object')) {
    throw new Error('is not a character file')
  }
  if (file.system !== system.id) {
    throw new Error(`is a ${file.system ?? 'unknown'} character, not ${system.title}`)
  }
  const version = typeof file.version === 'number' ? file.version : 1
  if (version > system.version) {
    throw new Error('was saved by a newer version of this sheet; reload the page and try again')
  }
  return entries.map((entry) => normalizeCharacter(system, entry, version))
}

function download(file: CharacterFile, name: string) {
  const blob = new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = name
  link.click()
  // Revoking straight away can cancel the download in some browsers.
  setTimeout(() => URL.revokeObjectURL(link.href), 1000)
}

export function downloadCharacterFile<T>(system: SheetSystem<T>, data: T) {
  const slug = system
    .getName(data)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  // The system's id tells files from different games apart, e.g. "eryon-fabula-ultima.json".
  download({ system: system.id, version: system.version, data }, `${slug || 'character'}-${system.id}.json`)
}

/** One file with every open character, so they can be backed up or moved to another device together. */
export function downloadAllCharacters<T>(system: SheetSystem<T>, characters: T[]) {
  download({ system: system.id, version: system.version, characters }, `characters-${system.id}.json`)
}
