import type { CharacterFile, FileCharacter, OpenCharacter, SheetSystem } from '../CharacterWorkspace.types'
import { mergeDefaults } from './mergeDefaults'

/** Upgrades data from an older version and fills in any missing fields. */
export function normalizeCharacter<T>(system: SheetSystem<T>, data: unknown, version: number): T {
  const upgraded = version < system.version && system.migrate ? system.migrate(data, version) : data
  return mergeDefaults(system.createCharacter(), upgraded, system.listItems)
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

// Ids are UUIDs written by the sheet; anything else is ignored, so the character just opens as new.
const fileId = (value: unknown) => (typeof value === 'string' && /^[\w-]{1,64}$/.test(value) ? value : undefined)

/**
 * Reads a saved file: one character (`data`) or several (`characters`), from Save all characters.
 * Entries of `characters` are `{ id, data }`, or plain character data in files saved before ids.
 */
export function parseCharacterFile<T>(system: SheetSystem<T>, text: string): { savedAt?: string; characters: FileCharacter<T>[] } {
  let file: Partial<CharacterFile>
  try {
    file = JSON.parse(text) as Partial<CharacterFile>
  } catch {
    throw new Error('is not a character file')
  }
  if (!isObject(file)) throw new Error('is not a character file')
  const characters: { id?: string; data: unknown }[] = Array.isArray(file.characters)
    ? (file.characters as unknown[]).map((entry) =>
        isObject(entry) && isObject(entry.data) && Object.keys(entry).every((key) => key === 'id' || key === 'data')
          ? { id: fileId(entry.id), data: entry.data }
          : { data: entry },
      )
    : [{ id: fileId(file.id), data: file.data }]
  if (characters.length === 0 || characters.some((character) => !isObject(character.data))) {
    throw new Error('is not a character file')
  }
  if (file.system !== system.id) {
    throw new Error(`is a ${file.system ?? 'unknown'} character, not ${system.title}`)
  }
  const version = typeof file.version === 'number' ? file.version : 1
  if (version > system.version) {
    throw new Error('was saved by a newer version of this sheet; reload the page and try again')
  }
  return {
    savedAt: typeof file.savedAt === 'string' ? file.savedAt : undefined,
    characters: characters.map(({ id, data }) => ({ id, data: normalizeCharacter(system, data, version) })),
  }
}

// Local date and time to the minute, without characters file systems reject: "2026-11-03-1542".
function timestamp(date = new Date()) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}`
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

export function downloadCharacterFile<T>(system: SheetSystem<T>, { id, data }: OpenCharacter<T>) {
  const slug = system
    .getName(data)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  // The system's id tells files from different games apart and the time tells saves apart,
  // e.g. "eryon-fabula-ultima-2026-11-03-1542.json".
  const file = { system: system.id, version: system.version, savedAt: new Date().toISOString(), id, data }
  download(file, `${slug || 'character'}-${system.id}-${timestamp()}.json`)
}

/** One file with every open character, so they can be backed up or moved to another device together. */
export function downloadAllCharacters<T>(system: SheetSystem<T>, characters: OpenCharacter<T>[]) {
  const file = { system: system.id, version: system.version, savedAt: new Date().toISOString(), characters }
  download(file, `characters-${system.id}-${timestamp()}.json`)
}
