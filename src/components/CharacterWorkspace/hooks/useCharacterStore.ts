import { useCallback, useEffect, useRef, useState } from 'react'
import type { OpenCharacter, SheetSystem } from '../CharacterWorkspace.types'
import { normalizeCharacter } from '../utils/characterFile'

type StoreState<T> = {
  characters: OpenCharacter<T>[]
  activeId: string
}

type StoredState = {
  version: number
  characters: { id: string; data: unknown }[]
  activeId: string
}

const storageKey = (systemId: string) => `rpcharactersheets:${systemId}`

const blank = <T,>(system: SheetSystem<T>): OpenCharacter<T> => ({
  id: crypto.randomUUID(),
  data: system.createCharacter(),
})

function loadState<T>(system: SheetSystem<T>): StoreState<T> {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey(system.id)) ?? 'null') as StoredState | null
    const characters = (stored?.characters ?? []).map((character) => ({
      id: character.id,
      data: normalizeCharacter(system, character.data, stored?.version ?? 1),
    }))
    if (stored && characters.length > 0) {
      const activeId = characters.some((c) => c.id === stored.activeId) ? stored.activeId : characters[0].id
      return { characters, activeId }
    }
  } catch {
    // Unreadable or blocked storage: start with a blank character.
  }
  const first = blank(system)
  return { characters: [first], activeId: first.id }
}

/** The open characters for one system, autosaved to this browser. */
export function useCharacterStore<T>(system: SheetSystem<T>) {
  const [state, setState] = useState(() => loadState(system))
  const [storageFailed, setStorageFailed] = useState(false)
  const pending = useRef<StoredState | null>(null)

  const flush = useCallback(() => {
    if (!pending.current) return
    try {
      localStorage.setItem(storageKey(system.id), JSON.stringify(pending.current))
      pending.current = null
      setStorageFailed(false)
    } catch {
      setStorageFailed(true)
    }
  }, [system.id])

  // Saving writes every open character, portraits included, so wait for a pause in typing.
  useEffect(() => {
    pending.current = { version: system.version, ...state }
    const timer = setTimeout(flush, 400)
    return () => clearTimeout(timer)
  }, [state, system.version, flush])

  // Don't lose the last change when leaving the page or closing the tab.
  useEffect(() => {
    window.addEventListener('pagehide', flush)
    return () => {
      window.removeEventListener('pagehide', flush)
      flush()
    }
  }, [flush])

  const add = useCallback(
    (data?: T) => {
      const character = data === undefined ? blank(system) : { id: crypto.randomUUID(), data }
      setState((s) => ({ characters: [...s.characters, character], activeId: character.id }))
    },
    [system],
  )

  const update = useCallback((id: string, updater: (data: T) => T) => {
    setState((s) => ({
      ...s,
      characters: s.characters.map((c) => (c.id === id ? { ...c, data: updater(c.data) } : c)),
    }))
  }, [])

  const remove = useCallback(
    (id: string) => {
      setState((s) => {
        const index = s.characters.findIndex((c) => c.id === id)
        const characters = s.characters.filter((c) => c.id !== id)
        if (characters.length === 0) {
          const first = blank(system)
          return { characters: [first], activeId: first.id }
        }
        const activeId = s.activeId === id ? characters[Math.max(0, index - 1)].id : s.activeId
        return { characters, activeId }
      })
    },
    [system],
  )

  const select = useCallback((id: string) => setState((s) => ({ ...s, activeId: id })), [])

  const active = state.characters.find((c) => c.id === state.activeId) ?? state.characters[0]

  return { characters: state.characters, active, add, update, remove, select, storageFailed }
}
