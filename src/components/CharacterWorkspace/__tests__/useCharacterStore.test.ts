import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCharacterStore } from '../hooks/useCharacterStore'
import type { StoredState } from '../utils/workspaceStorage'
import { hero, system } from './testSystem'

const storage = vi.hoisted(() => ({
  stored: null as StoredState | null,
  saveWorkspace: vi.fn<(id: string, state: StoredState) => Promise<void>>(),
}))
vi.mock('../utils/workspaceStorage', () => ({
  loadWorkspace: async () => storage.stored,
  saveWorkspace: storage.saveWorkspace,
  saveWorkspaceOnExit: vi.fn<() => void>(),
  requestPersistentStorage: vi.fn<() => void>(),
}))

const saved = (...names: string[]): StoredState => ({
  version: 2,
  characters: names.map((name) => ({ id: name.toLowerCase(), data: hero(name) })),
  activeId: names[0]?.toLowerCase() ?? '',
})

async function render() {
  const view = renderHook(() => useCharacterStore(system))
  await waitFor(() => expect(view.result.current.loaded).toBe(true))
  return view.result
}
const names = (result: Awaited<ReturnType<typeof render>>) => result.current.characters.map((c) => c.data.name)

beforeEach(() => {
  storage.stored = null
  storage.saveWorkspace.mockReset().mockResolvedValue()
})

describe('useCharacterStore', () => {
  it('starts with one blank character when nothing is saved', async () => {
    const result = await render()
    expect(names(result)).toEqual([''])
  })

  it('restores the saved characters without saving them again', async () => {
    storage.stored = saved('Ana', 'Bo')
    const result = await render()
    expect(names(result)).toEqual(['Ana', 'Bo'])
    expect(result.current.active.data.name).toBe('Ana')
    await new Promise((resolve) => setTimeout(resolve, 500))
    expect(storage.saveWorkspace).not.toHaveBeenCalled()
  })

  it('autosaves shortly after a change', async () => {
    storage.stored = saved('Ana')
    const result = await render()
    act(() => result.current.update('ana', (data) => ({ ...data, level: 5 })))
    await waitFor(() => expect(storage.saveWorkspace).toHaveBeenCalledTimes(1))
    const [id, state] = storage.saveWorkspace.mock.calls[0]
    expect(id).toBe('test')
    expect(state).toMatchObject({ version: 2, activeId: 'ana', characters: [{ id: 'ana', data: { level: 5 } }] })
    expect(state.savedAt).toEqual(expect.any(Number))
  })

  it('reports when the browser can’t store the characters', async () => {
    storage.saveWorkspace.mockRejectedValue(new Error('full'))
    const result = await render()
    act(() => result.current.add(hero('Cy')))
    await waitFor(() => expect(result.current.storageFailed).toBe(true))
  })

  it('opens a new character in a new tab', async () => {
    const result = await render()
    act(() => result.current.add(hero('Cy')))
    expect(names(result)).toEqual(['', 'Cy'])
    expect(result.current.active.data.name).toBe('Cy')
  })

  it('keeps a file’s id unless that id is already open', async () => {
    storage.stored = saved('Ana')
    const result = await render()
    act(() => result.current.add(hero('Bo'), 'from-file'))
    act(() => result.current.add(hero('Ana copy'), 'ana'))
    const ids = result.current.characters.map((c) => c.id)
    expect(ids.slice(0, 2)).toEqual(['ana', 'from-file'])
    expect(ids[2]).not.toBe('ana')
  })

  it('opens the tab before a closed active tab', async () => {
    storage.stored = saved('Ana', 'Bo', 'Cy')
    const result = await render()
    act(() => result.current.select('cy'))
    act(() => result.current.remove('cy'))
    expect(names(result)).toEqual(['Ana', 'Bo'])
    expect(result.current.active.id).toBe('bo')
    act(() => result.current.remove('ana'))
    expect(result.current.active.id).toBe('bo')
  })

  it('leaves a blank character when the last one is closed', async () => {
    storage.stored = saved('Ana')
    const result = await render()
    act(() => result.current.remove('ana'))
    expect(names(result)).toEqual([''])
    expect(result.current.active.id).not.toBe('ana')
  })
})
