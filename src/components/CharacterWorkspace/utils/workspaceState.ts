import type { OpenCharacter, SheetSystem } from '../CharacterWorkspace.types'
import { normalizeCharacter } from './characterFile'
import type { StoredState } from './workspaceStorage'

export type StoreState<T> = {
  characters: OpenCharacter<T>[]
  activeId: string
}

export const blank = <T,>(system: SheetSystem<T>): OpenCharacter<T> => ({
  id: crypto.randomUUID(),
  data: system.createCharacter(),
})

export const fresh = <T,>(system: SheetSystem<T>): StoreState<T> => {
  const first = blank(system)
  return { characters: [first], activeId: first.id }
}

/** The saved characters, upgraded to the current version; null when there are none. */
export function restore<T>(system: SheetSystem<T>, stored: StoredState | null): StoreState<T> | null {
  try {
    const characters = (stored?.characters ?? []).map((character) => ({
      id: character.id,
      data: normalizeCharacter(system, character.data, stored?.version ?? 1),
    }))
    if (!stored || characters.length === 0) return null
    const activeId = characters.some((c) => c.id === stored.activeId) ? stored.activeId : characters[0].id
    return { characters, activeId }
  } catch {
    // Unreadable save: start with a blank character.
    return null
  }
}
