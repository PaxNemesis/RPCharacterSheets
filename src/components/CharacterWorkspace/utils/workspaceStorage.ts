import { idbGet, idbSet } from './indexedDb'

/** One system's open characters as saved in the browser. */
export type StoredState = {
  version: number
  /** When it was saved, to pick the newer of two copies; missing in saves from before IndexedDB. */
  savedAt?: number
  characters: { id: string; data: unknown }[]
  activeId: string
}

const storageKey = (systemId: string) => `rpcharactersheets:${systemId}`

function readLocal(key: string): StoredState | null {
  try {
    return JSON.parse(localStorage.getItem(key) ?? 'null') as StoredState | null
  } catch {
    return null
  }
}

/** Drops the localStorage copy once IndexedDB has the same or a newer save. */
function removeLocal(key: string, savedAt = 0) {
  const local = readLocal(key)
  if (!local || (local.savedAt ?? 0) > savedAt) return
  try {
    localStorage.removeItem(key)
  } catch {
    // Blocked storage: nothing to remove.
  }
}

/**
 * Loads from IndexedDB. A localStorage copy wins when it is newer: either a save from before the
 * move to IndexedDB, or the last change written while the page closed. It is moved into IndexedDB.
 */
export async function loadWorkspace(systemId: string): Promise<StoredState | null> {
  const key = storageKey(systemId)
  const local = readLocal(key)
  let saved: StoredState | undefined
  try {
    saved = await idbGet<StoredState>(key)
  } catch {
    return local
  }
  if (local && (!saved || (local.savedAt ?? 0) >= (saved.savedAt ?? 0))) {
    try {
      await idbSet(key, local)
      removeLocal(key, local.savedAt)
    } catch {
      // Keep the localStorage copy; the next save tries IndexedDB again.
    }
    return local
  }
  return saved ?? null
}

/** Saves to IndexedDB, or to localStorage where IndexedDB is unavailable. Rejects when neither works. */
export async function saveWorkspace(systemId: string, state: StoredState): Promise<void> {
  const key = storageKey(systemId)
  try {
    await idbSet(key, state)
    removeLocal(key, state.savedAt)
  } catch {
    localStorage.setItem(key, JSON.stringify(state))
  }
}

/** While the page closes an IndexedDB write may not finish, so also keep a localStorage copy if it fits. */
export function saveWorkspaceOnExit(systemId: string, state: StoredState) {
  try {
    localStorage.setItem(storageKey(systemId), JSON.stringify(state))
  } catch {
    // Too big for localStorage, which is the reason for IndexedDB: rely on the write below.
  }
  saveWorkspace(systemId, state).catch(() => undefined)
}

let persistenceRequested = false

/** Asks the browser not to clear the site's storage on its own. Firefox asks the user; others decide silently. */
export function requestPersistentStorage() {
  if (persistenceRequested || !navigator.storage?.persist) return
  persistenceRequested = true
  navigator.storage
    .persisted()
    .then((persisted) => persisted || navigator.storage.persist())
    .catch(() => undefined)
}
