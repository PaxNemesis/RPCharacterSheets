import { describe, expect, it } from 'vitest'
import type { Num, StatKey } from '../../../../../types'
import { createMeleeWeapon, createRangedWeapon } from '../../../../../utils/weaponColumns'
import { formatParts, formatRoll, meleeRolls, rangedRolls } from '../utils/attackRolls'

const stats: Partial<Record<StatKey, number>> = { poi: 4, prw: 3, str: 5 }
const stat = (key: StatKey): Num => stats[key] ?? null

describe('attack rolls', () => {
  it('adds POI, skill and mod for a ranged attack, and POW for its damage', () => {
    const { attack, damage } = rangedRolls({ ...createRangedWeapon(), skill: 2, attackMod: -1, pow: 10 }, stat)
    expect(formatRoll(attack)).toBe('+5')
    expect(formatParts(attack)).toBe('POI (4) + Skill (2) + Mod (–1)')
    expect(formatRoll(damage)).toBe('+10')
  })

  it('uses PRW for thrown weapons and marks blank values', () => {
    const { attack } = rangedRolls({ ...createRangedWeapon(), attackStat: 'prw', attackMod: -5 }, stat)
    expect(formatRoll(attack)).toBe('–2')
    expect(formatParts(attack)).toBe('PRW (3) + Skill (none) + Mod (–5)')
  })

  it('adds PRW, skill and mod for a melee attack, and POW + STR for its damage', () => {
    const { attack, damage } = meleeRolls({ ...createMeleeWeapon(), skill: 1, attackMod: -3, pow: 3 }, stat)
    expect(formatRoll(attack)).toBe('+1')
    expect(formatParts(damage)).toBe('POW (3) + STR (5)')
    expect(formatRoll(damage)).toBe('+8')
  })

  it('shows no damage roll for a weapon without POW, and +0 for a total of 0', () => {
    expect(formatRoll(meleeRolls(createMeleeWeapon(), stat).damage)).toBe('—')
    expect(formatRoll(rangedRolls({ ...createRangedWeapon(), pow: 0 }, stat).damage)).toBe('+0')
  })
})
