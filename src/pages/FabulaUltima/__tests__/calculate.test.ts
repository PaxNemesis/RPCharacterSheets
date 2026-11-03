import { describe, expect, it } from 'vitest'
import { calculate } from '../utils/calculate'
import { createItem } from '../utils/createCharacter'
import { character, classWith } from './character'

describe('calculate', () => {
  it('adds up maximum HP, MP and IP from dice, level and class benefits', () => {
    const derived = calculate(character({ classes: [classWith('Guardian', ['Fortress', 2], ['Protect', 1])] }))
    expect(derived.level).toBe(3)
    // MIG d8 × 5 + level 3 + Guardian's +5 HP; WLP d8 × 5 + 3; IP starts at 6.
    expect(derived).toMatchObject({ maxHp: 48, maxMp: 43, maxIp: 6, crisis: 24 })
  })

  it('lowers dice for status effects, but never below d6', () => {
    const base = character({ attributes: { dex: '10', ins: '8', mig: '6', wlp: '8' } })
    const derived = calculate({ ...base, statuses: { ...base.statuses, enraged: true, weak: true } })
    expect(derived.current('dex')).toBe(8)
    expect(derived.current('ins')).toBe(6)
    expect(derived.current('mig')).toBe(6)
    expect(derived.base('dex')).toBe(10)
  })

  it('uses the DEX die for Defense, or the fixed Defense of heavy armor, plus gear bonuses', () => {
    const plain = character()
    expect(calculate(plain).defense).toBe(8)
    const equipment = {
      ...plain.equipment,
      armor: { ...createItem('armor'), name: 'Bronze Plate', defense: 11, initiative: -3 },
      offHand: { ...createItem('shield'), name: 'Runic Shield', defenseBonus: 2, magicDefenseBonus: 2 },
    }
    expect(calculate({ ...plain, equipment })).toMatchObject({ defense: 13, magicDefense: 10, initiative: -3 })
  })

  it('takes martial equipment from classes, the Survivor Quirk and manual overrides', () => {
    expect(calculate(character({ classes: [classWith('Guardian', ['Fortress', 1])] })).martial).toEqual({
      armor: true,
      shields: true,
      melee: false,
      ranged: false,
    })
    const survivor = character({ quirk: { id: 'natural:Survivor', name: '', choice: 'martial', notes: '' } })
    expect(Object.values(calculate(survivor).martial)).toEqual([true, true, true, true])

    const plain = character()
    const allowed = calculate({ ...plain, modifiers: { ...plain.modifiers, martial: { ...plain.modifiers.martial, ranged: true } } })
    expect(allowed.martial.ranged).toBe(true)
    expect(allowed.martialGranted.ranged).toBe(false)
  })
})
