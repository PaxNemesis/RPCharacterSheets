import { describe, expect, it } from 'vitest'
import { fresh, restore } from '../utils/workspaceState'
import { hero, system } from './testSystem'

describe('restore', () => {
  it('is null when nothing is saved, so the sheet starts with a blank character', () => {
    expect(restore(system, null)).toBeNull()
    expect(restore(system, { version: 2, characters: [], activeId: '' })).toBeNull()
  })

  it('restores the saved characters and the open tab', () => {
    const stored = { version: 2, characters: [{ id: 'a', data: hero('Ana') }, { id: 'b', data: hero('Bo') }], activeId: 'b' }
    expect(restore(system, stored)).toEqual({ characters: stored.characters, activeId: 'b' })
  })

  it('upgrades characters saved by an older version and fills in missing fields', () => {
    const stored = { version: 1, characters: [{ id: 'a', data: { name: 'Ana', rank: 'Knight' } }], activeId: 'a' }
    expect(restore(system, stored)?.characters[0].data).toEqual({ name: 'Ana', level: 1, title: 'Knight', rank: 'Knight' })
  })

  it('opens the first tab when the saved open tab is gone', () => {
    const stored = { version: 2, characters: [{ id: 'a', data: hero('Ana') }], activeId: 'missing' }
    expect(restore(system, stored)?.activeId).toBe('a')
  })

  it('is null for a save it can’t read', () => {
    expect(restore(system, { version: 2, characters: 'broken', activeId: '' } as never)).toBeNull()
  })
})

describe('fresh', () => {
  it('starts with one blank character, open', () => {
    const state = fresh(system)
    expect(state.characters).toHaveLength(1)
    expect(state.characters[0].data).toEqual(system.createCharacter())
    expect(state.activeId).toBe(state.characters[0].id)
  })
})
