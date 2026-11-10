import { describe, expect, it } from 'vitest'
import type { RepeatTableColumn } from '@/components/RepeatTable'
import { alphabetical } from '@/utils/alphabetical'
import type { Num, StatKey } from '../types'
import { createMeleeWeapon, createRangedWeapon, meleeWeaponColumns, rangedWeaponColumns } from '../utils/weaponColumns'
import { meleePresets, rangedPresets } from '../utils/weaponPresets'
import { character } from './character'

const thrower = character({ skills: [{ name: 'Thrown Weapon', stat: 'prw', level: 2, page: '' }] })

describe('weapon presets', () => {
  it('fills a ranged row from the book, with the character’s skill level', () => {
    const row = rangedPresets(thrower).pick('javelin', { ...createRangedWeapon(), location: 'Back' })
    expect(row).toMatchObject({ name: 'Javelin', location: 'Back', attackStat: 'prw', skill: 2, pow: 3, rng: '8' })
    expect(row.notes).toBe('Thrown Weapon, p. 265. POW 3 + thrower’s STR')
  })

  it('leaves the row alone for a name that isn’t in the books', () => {
    const row = { ...createMeleeWeapon(), name: 'Homebrew' }
    expect(meleePresets(thrower).pick('Homebrew', row)).toBe(row)
  })

  it('fills a melee row, leaving the skill blank when the character lacks it', () => {
    expect(meleePresets(thrower).pick('Dagger', createMeleeWeapon())).toMatchObject({ name: 'Dagger', skill: null, attackMod: 1, pow: 1 })
  })

  it('only suggests weapons from books that are turned on, sorted by name', () => {
    const all = rangedPresets(thrower).names
    const coreOnly = rangedPresets(character({ settings: { books: { kng: false, ua: false } } })).names
    expect(coreOnly.length).toBeLessThan(all.length)
    expect(coreOnly).toContain('Javelin')
    expect(alphabetical(coreOnly)).toEqual(coreOnly)
  })
})

describe('weapon columns', () => {
  const stats: Partial<Record<StatKey, number>> = { poi: 4, prw: 5, str: 6 }
  const stat = (key: StatKey): Num => stats[key] ?? null
  const value = (columns: RepeatTableColumn[], key: string, row: object) => {
    const column = columns.find((candidate) => candidate.key === key)
    return column?.type === 'calculated' ? column.calculate?.(row as never) : undefined
  }

  it('works out RAT from POI, or PRW for thrown weapons (p. 106)', () => {
    const columns = rangedWeaponColumns(stat)
    expect(value(columns, 'rat', { ...createRangedWeapon(), skill: 2, attackMod: -1 })).toBe(5)
    expect(value(columns, 'rat', { ...createRangedWeapon(), attackStat: 'prw', skill: 2 })).toBe(7)
  })

  it('works out MAT and P+S, leaving P+S blank without a POW (pp. 106, 215)', () => {
    const columns = meleeWeaponColumns(stat)
    expect(value(columns, 'mat', { ...createMeleeWeapon(), skill: 1, attackMod: 1 })).toBe(7)
    expect(value(columns, 'ps', { ...createMeleeWeapon(), pow: 4 })).toBe(10)
    expect(value(columns, 'ps', createMeleeWeapon())).toBeNull()
  })

  it('adds a location column only when asked', () => {
    expect(rangedWeaponColumns(stat).some((column) => column.key === 'location')).toBe(false)
    expect(meleeWeaponColumns(stat, true).some((column) => column.key === 'location')).toBe(true)
  })
})
