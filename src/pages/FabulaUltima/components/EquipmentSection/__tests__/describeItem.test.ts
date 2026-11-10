import { describe, expect, it } from 'vitest'
import { createItem } from '../../../utils/createCharacter'
import { describeItem } from '../utils/describeItem'

describe('describeItem', () => {
  it('describes a weapon’s category, hands, range, accuracy and damage', () => {
    const sword = { ...createItem('weapon'), category: 'Sword', hands: 'one' as const, range: 'melee' as const, accuracyBonus: 1, damage: 6 }
    expect(describeItem(sword)).toBe('Sword, one-handed melee · 【DEX + MIG】 +1 · HR + 6 physical')
  })

  it('states armor’s scores in full, like the rulebook', () => {
    expect(describeItem({ ...createItem('armor'), defense: 11 })).toBe('Defense 11 · M. Defense INS')
    expect(describeItem({ ...createItem('armor'), defenseBonus: 1, magicDefenseBonus: 2 })).toBe('Defense DEX +1 · M. Defense INS +2')
  })

  it('lists the bonuses of other items, with signs, and marks martial ones', () => {
    const shield = { ...createItem('shield'), defenseBonus: 2, initiative: -1, martial: true }
    expect(describeItem(shield)).toBe('Defense +2 · Initiative −1 · Martial')
    expect(describeItem(createItem('accessory'))).toBe('')
  })
})
