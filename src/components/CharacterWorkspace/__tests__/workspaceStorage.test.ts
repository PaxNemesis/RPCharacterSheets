import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadWorkspace, saveWorkspace, saveWorkspaceOnExit, type StoredState } from '../utils/workspaceStorage'

// IndexedDB as an in-memory map that can be made to fail, as it does in some private windows.
const idb = vi.hoisted(() => ({ data: new Map<string, unknown>(), failing: false }))
vi.mock('../utils/indexedDb', () => ({
  idbGet: async (key: string) => {
    if (idb.failing) throw new Error('blocked')
    return idb.data.get(key)
  },
  idbSet: async (key: string, value: unknown) => {
    if (idb.failing) throw new Error('blocked')
    idb.data.set(key, value)
  },
}))

const KEY = 'rpcharactersheets:test'
const save = (savedAt?: number, name = 'Ana'): StoredState => ({
  version: 1,
  savedAt,
  characters: [{ id: 'a', data: { name } }],
  activeId: 'a',
})
const local = () => JSON.parse(localStorage.getItem(KEY) ?? 'null') as StoredState | null

beforeEach(() => {
  idb.data.clear()
  idb.failing = false
})

describe('loadWorkspace', () => {
  it('loads from IndexedDB', async () => {
    idb.data.set(KEY, save(100))
    expect(await loadWorkspace('test')).toEqual(save(100))
  })

  it('is null when nothing is saved', async () => {
    expect(await loadWorkspace('test')).toBeNull()
  })

  it('prefers a newer localStorage copy, written while the page closed, and moves it into IndexedDB', async () => {
    idb.data.set(KEY, save(100, 'Old'))
    localStorage.setItem(KEY, JSON.stringify(save(200, 'New')))
    expect((await loadWorkspace('test'))?.savedAt).toBe(200)
    expect(idb.data.get(KEY)).toEqual(save(200, 'New'))
    expect(local()).toBeNull()
  })

  it('moves a save from before IndexedDB, which has no save time, into IndexedDB', async () => {
    localStorage.setItem(KEY, JSON.stringify(save()))
    expect(await loadWorkspace('test')).toEqual(save())
    expect(idb.data.get(KEY)).toEqual(save())
  })

  it('clears the localStorage copy left by closing the page once IndexedDB has the same save', async () => {
    idb.data.set(KEY, save(200))
    localStorage.setItem(KEY, JSON.stringify(save(200)))
    expect(await loadWorkspace('test')).toEqual(save(200))
    expect(local()).toBeNull()
  })

  it('ignores an older localStorage copy', async () => {
    idb.data.set(KEY, save(200, 'New'))
    localStorage.setItem(KEY, JSON.stringify(save(100, 'Old')))
    expect((await loadWorkspace('test'))?.savedAt).toBe(200)
  })

  it('falls back to localStorage when IndexedDB is blocked', async () => {
    idb.failing = true
    localStorage.setItem(KEY, JSON.stringify(save(100)))
    expect(await loadWorkspace('test')).toEqual(save(100))
  })

  it('ignores a localStorage copy that isn’t JSON', async () => {
    localStorage.setItem(KEY, '{broken')
    idb.data.set(KEY, save(100))
    expect(await loadWorkspace('test')).toEqual(save(100))
  })
})

describe('saveWorkspace', () => {
  it('saves to IndexedDB and drops an older localStorage copy', async () => {
    localStorage.setItem(KEY, JSON.stringify(save(100)))
    await saveWorkspace('test', save(200))
    expect(idb.data.get(KEY)).toEqual(save(200))
    expect(local()).toBeNull()
  })

  it('keeps a newer localStorage copy', async () => {
    localStorage.setItem(KEY, JSON.stringify(save(300)))
    await saveWorkspace('test', save(200))
    expect(local()?.savedAt).toBe(300)
  })

  it('saves to localStorage when IndexedDB is blocked', async () => {
    idb.failing = true
    await saveWorkspace('test', save(200))
    expect(local()).toEqual(save(200))
  })
})

describe('saveWorkspaceOnExit', () => {
  it('writes to localStorage straight away, in case the IndexedDB write doesn’t finish', () => {
    idb.failing = true
    saveWorkspaceOnExit('test', save(200))
    expect(local()).toEqual(save(200))
  })
})
