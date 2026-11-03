import { describe, expect, it } from 'vitest'
import type { SheetSystem } from '../CharacterWorkspace.types'
import { parseCharacterFile } from '../utils/characterFile'

type Hero = { name: string; level: number; title: string }

const system: SheetSystem<Hero> = {
  id: 'test',
  title: 'Test',
  version: 2,
  createCharacter: () => ({ name: '', level: 1, title: '' }),
  // Version 2 renamed `rank` to `title`.
  migrate: (data, from) => (from < 2 ? { ...(data as object), title: (data as { rank?: string }).rank ?? '' } : data),
  getName: (hero) => hero.name,
  Sheet: () => null,
}
const read = (file: unknown) => parseCharacterFile(system, JSON.stringify(file))
const hero = { name: 'Ana', level: 3, title: 'Knight' }

describe('parseCharacterFile', () => {
  it('reads one character with its id and save time', () => {
    const file = read({ system: 'test', version: 2, savedAt: '2026-11-03T18:00:00.000Z', id: 'abc-123', data: hero })
    expect(file).toEqual({ savedAt: '2026-11-03T18:00:00.000Z', characters: [{ id: 'abc-123', data: hero }] })
  })

  it('reads all characters from a combined file, with or without ids', () => {
    const withIds = read({ system: 'test', version: 2, characters: [{ id: 'a', data: hero }, { id: 'b', data: { ...hero, name: 'Bo' } }] })
    expect(withIds.characters.map((c) => [c.id, c.data.name])).toEqual([['a', 'Ana'], ['b', 'Bo']])
    const older = read({ system: 'test', version: 2, characters: [hero] })
    expect(older.characters).toEqual([{ data: hero }])
  })

  it('upgrades older files and ignores ids the sheet would not have written', () => {
    const file = read({ system: 'test', version: 1, id: 'not an id!', data: { name: 'Ana', rank: 'Squire' } })
    expect(file.characters[0]).toEqual({ id: undefined, data: { name: 'Ana', level: 1, title: 'Squire', rank: 'Squire' } })
  })

  it('refuses other games, newer versions and files that are not characters', () => {
    expect(() => read({ system: 'other', version: 1, data: hero })).toThrow('is a other character, not Test')
    expect(() => read({ system: 'test', version: 3, data: hero })).toThrow('newer version')
    expect(() => read({ system: 'test', version: 2 })).toThrow('is not a character file')
    expect(() => read({ system: 'test', version: 2, characters: [] })).toThrow('is not a character file')
    expect(() => parseCharacterFile(system, 'not json')).toThrow('is not a character file')
  })
})
