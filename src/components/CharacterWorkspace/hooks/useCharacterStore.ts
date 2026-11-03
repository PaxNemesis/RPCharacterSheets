import { useCallback, useEffect, useRef, useState } from 'react'
import type { SheetSystem } from '../CharacterWorkspace.types'
import {
  loadWorkspace,
  requestPersistentStorage,
  saveWorkspace,
  saveWorkspaceOnExit,
  type StoredState,
} from '../utils/workspaceStorage'
import { blank, fresh, restore, type StoreState } from '../utils/workspaceState'

/** The open characters for one system, autosaved to this browser. */
export function useCharacterStore<T>(system: SheetSystem<T>) {
  const [initial] = useState(() => fresh(system))
  const [state, setState] = useState<StoreState<T>>(initial)
  const [loaded, setLoaded] = useState(false)
  const [storageFailed, setStorageFailed] = useState(false)
  const pending = useRef<StoredState | null>(null)
  // The state as loaded, which needs no saving.
  const unchanged = useRef<StoreState<T> | null>(null)

  useEffect(() => {
    let cancelled = false
    loadWorkspace(system.id)
      .catch(() => null)
      .then((stored) => {
        if (cancelled) return
        const restored = restore(system, stored) ?? initial
        unchanged.current = restored
        setState(restored)
        setLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [system, initial])

  const flush = useCallback(() => {
    const next = pending.current
    if (!next) return
    pending.current = null
    saveWorkspace(system.id, { ...next, savedAt: Date.now() })
      .then(() => {
        setStorageFailed(false)
        requestPersistentStorage()
      })
      .catch(() => {
        pending.current ??= next
        setStorageFailed(true)
      })
  }, [system.id])

  // Saving writes every open character, portraits included, so wait for a pause in typing.
  useEffect(() => {
    if (!loaded || state === unchanged.current) return
    pending.current = { version: system.version, ...state }
    const timer = setTimeout(flush, 400)
    return () => clearTimeout(timer)
  }, [state, loaded, system.version, flush])

  // Don't lose the last change when leaving the page, closing the tab or switching away on a phone.
  useEffect(() => {
    const flushOnExit = () => {
      if (!pending.current) return
      saveWorkspaceOnExit(system.id, { ...pending.current, savedAt: Date.now() })
      pending.current = null
    }
    const onVisibility = () => document.visibilityState === 'hidden' && flushOnExit()
    window.addEventListener('pagehide', flushOnExit)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('pagehide', flushOnExit)
      document.removeEventListener('visibilitychange', onVisibility)
      flush()
    }
  }, [system.id, flush])

  // A character from a file keeps the file's id, so opening the file again can find its tab.
  const add = useCallback(
    (data?: T, id?: string) => {
      setState((s) => {
        const keepId = id !== undefined && !s.characters.some((c) => c.id === id)
        const character = data === undefined ? blank(system) : { id: keepId ? id : crypto.randomUUID(), data }
        return { characters: [...s.characters, character], activeId: character.id }
      })
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

  return { characters: state.characters, active, add, update, remove, select, loaded, storageFailed }
}
