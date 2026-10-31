import type { CharacterFile, SheetSystem } from '../CharacterWorkspace.types'
import { mergeDefaults } from './mergeDefaults'

/** Upgrades data from an older version and fills in any missing fields. */
export function normalizeCharacter<T>(system: SheetSystem<T>, data: unknown, version: number): T {
  const upgraded = version < system.version && system.migrate ? system.migrate(data, version) : data
  return mergeDefaults(system.createCharacter(), upgraded)
}

export function parseCharacterFile<T>(system: SheetSystem<T>, text: string): T {
  let file: Partial<CharacterFile>
  try {
    file = JSON.parse(text) as Partial<CharacterFile>
  } catch {
    throw new Error('is not a valid JSON file')
  }
  if (file === null || typeof file !== 'object' || typeof file.data !== 'object') {
    throw new Error('is not a character file')
  }
  if (file.system !== system.id) {
    throw new Error(`is a ${file.system ?? 'unknown'} character, not ${system.title}`)
  }
  const version = typeof file.version === 'number' ? file.version : 1
  if (version > system.version) {
    throw new Error('was saved by a newer version of this sheet; reload the page and try again')
  }
  return normalizeCharacter(system, file.data, version)
}

export function downloadCharacterFile<T>(system: SheetSystem<T>, data: T) {
  const file: CharacterFile = { system: system.id, version: system.version, data }
  const blob = new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' })
  const slug = system
    .getName(data)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${slug || 'character'}.json`
  link.click()
  // Revoking straight away can cancel the download in some browsers.
  setTimeout(() => URL.revokeObjectURL(link.href), 1000)
}
