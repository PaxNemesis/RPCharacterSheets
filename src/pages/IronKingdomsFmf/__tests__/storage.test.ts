import { describe, expect, it } from 'vitest'
import type { IkArmor, IkMeleeWeapon } from '../types'
import { calculate } from '../utils/calculate'
import { createArmor, createStoredItem } from '../utils/createCharacter'
import { equip, storedKind, toStored } from '../utils/storage'
import { createMeleeWeapon, createRangedWeapon } from '../utils/weaponColumns'
import { character, statsWith } from './character'

const armor = (name: string, arm: number): IkArmor => ({ ...createArmor(), name, def: -1, arm })
const sword: IkMeleeWeapon = { ...createMeleeWeapon(), name: 'Sword', skill: 2, attackMod: 0, pow: 3, notes: 'p. 259' }

describe('stored equipment', () => {
  it('keeps every value of a weapon or armor it stores, and only the fields its kind uses', () => {
    const stored = toStored('melee', sword)
    expect(stored).toMatchObject({ kind: 'melee', name: 'Sword', skill: 2, attackMod: 0, pow: 3, notes: 'p. 259', spd: null })
    expect(Object.keys(stored).sort()).toEqual(Object.keys(createStoredItem()).sort())
  })

  it('equips a stored item to the end of its list, as the row the list uses', () => {
    const rifle = { ...createRangedWeapon(), name: 'Rifle', pow: 10, rng: '14' }
    const next = equip(character({ stored: [toStored('melee', sword), toStored('ranged', rifle)] }), 1)
    expect(next.rangedWeapons).toEqual([rifle])
    expect(next.stored.map((item) => item.name)).toEqual(['Sword'])
  })

  it('swaps a stored item for an equipped one, which takes its place in storage', () => {
    const leather = armor('Leather', 2)
    const plate = armor('Plate', 7)
    const next = equip(character({ armor: [leather], stored: [toStored('armor', plate)] }), 0, 0)
    expect(next.armor).toEqual([plate])
    expect(next.stored).toEqual([toStored('armor', leather)])
  })

  it('adds the item instead when the swap target is gone, and ignores entries of unknown kind', () => {
    const plate = toStored('armor', armor('Plate', 7))
    expect(equip(character({ stored: [plate] }), 0, 3).armor).toHaveLength(1)
    const odd = { ...plate, kind: 'toString' } as unknown as typeof plate
    const sheet = character({ stored: [odd] })
    expect(storedKind(odd)).toBeUndefined()
    expect(equip(sheet, 0)).toBe(sheet)
  })

  it('leaves stored armor out of DEF, ARM and SPD', () => {
    const stats = statsWith({ phy: 5, spd: 6, agl: 3, per: 3 })
    const wearing = calculate(character({ stats, armor: [armor('Plate', 7)] }))
    const stored = calculate(character({ stats, stored: [toStored('armor', armor('Plate', 7))] }))
    expect(wearing.armor).toBe(12)
    expect(stored.armor).toBe(5)
    expect(stored.defense).toBe(12)
  })
})
