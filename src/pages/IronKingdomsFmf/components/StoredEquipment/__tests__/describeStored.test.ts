import { describe, expect, it } from 'vitest'
import type { Num, StatKey } from '../../../types'
import { createStoredItem } from '../../../utils/createCharacter'
import { describeStored } from '../utils/describeStored'

const stats: Partial<Record<StatKey, number>> = { poi: 4, prw: 4, str: 5 }
const stat = (key: StatKey): Num => stats[key] ?? null

describe('describeStored', () => {
  it('sums up a ranged weapon with its RAT', () => {
    const rifle = { ...createStoredItem(), kind: 'ranged' as const, skill: 2, attackMod: -1, rng: '14', pow: 10, ammo: '1' }
    expect(describeStored(rifle, 'ranged', stat)).toBe('Ranged weapon · RAT 5 · RNG 14 · POW 10 · Ammo 1')
  })

  it('sums up a melee weapon with its MAT and P+S', () => {
    const sword = { ...createStoredItem(), kind: 'melee' as const, skill: 1, attackMod: 0, pow: 3 }
    expect(describeStored(sword, 'melee', stat)).toBe('Melee weapon · MAT 5 · POW 3 · P+S 8')
  })

  it('shows armor modifiers with their signs, leaving out blank ones', () => {
    const plate = { ...createStoredItem(), kind: 'armor' as const, spd: -2, def: 0, arm: 7 }
    expect(describeStored(plate, 'armor', stat)).toBe('Armor · SPD –2 · DEF 0 · ARM +7')
    expect(describeStored({ ...plate, spd: null, def: null }, 'armor', stat)).toBe('Armor · ARM +7')
  })
})
