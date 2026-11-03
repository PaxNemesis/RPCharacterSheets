import { describe, expect, it } from 'vitest'
import { CUSTOM_WEAPONS } from '../../../constants/customWeapons'
import { BASIC_DEFENSIVE_ITEMS, BASIC_WEAPONS } from '../../../constants/equipment'
import { RARE_ITEMS } from '../../../constants/rareItems'
import { RARE_WEAPONS } from '../../../constants/rareWeapons'
import { SLOTS } from '../../../constants/slots'
import { createCharacter } from '../../../utils/createCharacter'
import { presetNotes, rulebookItems } from '../components/ItemSlot/utils/itemFromRulebook'

const { settings } = createCharacter()
const allItems = [...BASIC_DEFENSIVE_ITEMS, ...RARE_ITEMS]
const kindCount = (kind: string) => allItems.filter((item) => item.kind === kind).length

describe('rulebook items', () => {
  // Suggestions are keyed by label, so two items with the same label would quietly lose one.
  it('gives every item in a slot its own suggestion', () => {
    const weapons = BASIC_WEAPONS.length + RARE_WEAPONS.length + CUSTOM_WEAPONS.length
    const expected = { mainHand: weapons + kindCount('shield'), offHand: weapons + kindCount('shield'), armor: kindCount('armor'), accessory: kindCount('accessory') }
    for (const slot of SLOTS) expect(rulebookItems(slot.kinds, settings).size).toBe(expected[slot.key])
  })

  it('leaves out the items of books that are turned off', () => {
    const natural = CUSTOM_WEAPONS.filter((weapon) => weapon.book === 'natural').length
    const withoutNatural = { ...settings, books: { ...settings.books, natural: false } }
    const accessories = RARE_ITEMS.filter((item) => item.kind === 'accessory' && item.book === 'natural').length
    expect(rulebookItems(['weapon'], settings).size - rulebookItems(['weapon'], withoutNatural).size).toBe(natural)
    expect(rulebookItems(['accessory'], settings).size - rulebookItems(['accessory'], withoutNatural).size).toBe(accessories)
  })

  it('labels weapons with their Category, martial and page, and fills in flat bonuses', () => {
    const weapons = rulebookItems(['weapon'], settings)
    expect(weapons.get('Halberd (spear, martial, p. 277)')).toMatchObject({ defenseBonus: 1, martial: true, quality: 'Quality: see p. 277.' })
    expect(weapons.get('Rafflesia Staff (arcane, martial, p. 270)')?.martial).toBe(true)
    expect(weapons.get('Broadaxe (heavy, martial)')?.quality).toBe('')
    const queenswarden = weapons.get('Queenswarden (sword, martial, HF p. 111)')
    expect(queenswarden).toMatchObject({ defenseBonus: 3, magicDefenseBonus: 3 })
  })

  it('gives transforming custom weapons all their forms, with +2 per defense boost', () => {
    const eyre = rulebookItems(['weapon'], settings).get('Eyre (dagger/firearm, martial, NF p. 117)')
    expect(eyre?.forms?.map((form) => [form.category, form.defenseBonus, form.magicDefenseBonus])).toEqual([
      ['Dagger', 2, 2],
      ['Firearm', null, null],
    ])
    expect(CUSTOM_WEAPONS.every((weapon) => weapon.forms.length >= 1 && weapon.forms.length <= 2)).toBe(true)
  })

  it('knows the notes presets write, including each form’s, so a player’s own notes are kept', () => {
    const notes = presetNotes(rulebookItems(['weapon', 'shield'], settings))
    expect(notes.has('Quality: see p. 277.')).toBe(true)
    expect(notes.has('No Quality (NF p. 117). Customizations: accurate, powerful, transforming.')).toBe(true)
    expect(notes.has('My lucky sword')).toBe(false)
  })
})
