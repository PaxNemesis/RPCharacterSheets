import { describe, expect, it } from 'vitest'
import { CUSTOM_WEAPONS } from '../constants/customWeapons'
import { itemFromCustomWeapon } from '../components/EquipmentSection/components/ItemSlot/utils/itemFromRulebook'
import { createItem } from '../utils/createCharacter'
import { canEquip, martialNeeds } from '../utils/martial'

const none = { armor: false, shields: false, melee: false, ranged: false }

describe('martial', () => {
  it('needs the martial kind of the item, and nothing for non-martial items', () => {
    expect(martialNeeds({ ...createItem('weapon'), martial: true, range: 'melee' })).toEqual(['melee'])
    expect(martialNeeds({ ...createItem('armor'), martial: true })).toEqual(['armor'])
    expect(martialNeeds({ ...createItem('weapon'), range: 'ranged' })).toEqual([])
  })

  it('needs every martial form of a transforming weapon, including forms not in use', () => {
    const eyre = itemFromCustomWeapon(CUSTOM_WEAPONS.find((weapon) => weapon.name === 'Eyre')!)
    expect(martialNeeds(eyre)).toEqual(['melee', 'ranged'])
    expect(canEquip(eyre, { ...none, melee: true })).toBe(false)
    expect(canEquip(eyre, { ...none, melee: true, ranged: true })).toBe(true)
  })
})
