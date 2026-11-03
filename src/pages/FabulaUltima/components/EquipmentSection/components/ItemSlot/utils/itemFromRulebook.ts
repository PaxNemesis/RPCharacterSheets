import { compareNames } from '@/utils/alphabetical'
import { bookEnabled, bookRef } from '../../../../../constants/books'
import { CUSTOM_WEAPONS } from '../../../../../constants/customWeapons'
import { BASIC_DEFENSIVE_ITEMS, BASIC_WEAPONS } from '../../../../../constants/equipment'
import type { CustomWeaponData, DefensiveItemData, FuItem, FuSettings, ItemKind, WeaponData } from '../../../../../types'
import { createItem } from '../../../../../utils/createCharacter'
import { defaultFormLabel } from '../../../utils/forms'

export const itemFromWeapon = (weapon: WeaponData): FuItem => ({
  ...createItem('weapon'),
  name: weapon.name,
  martial: weapon.martial,
  category: weapon.category,
  hands: weapon.hands,
  range: weapon.range,
  accuracyA: weapon.accuracy[0],
  accuracyB: weapon.accuracy[1],
  accuracyBonus: weapon.accuracyBonus ?? null,
  damage: weapon.damage,
})

export const itemFromDefensive = (item: DefensiveItemData): FuItem => ({
  ...createItem(item.kind),
  name: item.name,
  martial: item.martial,
  defense: item.defense ?? null,
  defenseBonus: item.defenseBonus ?? null,
  magicDefenseBonus: item.magicDefenseBonus ?? null,
  initiative: item.initiative ?? null,
})

/** A custom weapon in its first form, with each form's stats; a Quality is only referred to by page. */
export function itemFromCustomWeapon(weapon: CustomWeaponData): FuItem {
  const ref = bookRef(weapon.book, weapon.page)
  const forms = weapon.forms.map(({ accuracy, customizations, ...stats }, index) => {
    const { kind: _kind, name: _name, ...item } = {
      ...createItem('weapon'),
      ...stats,
      hands: 'two' as const,
      accuracyA: accuracy[0],
      accuracyB: accuracy[1],
      accuracyBonus: stats.accuracyBonus || null,
      defenseBonus: stats.defenseBonus ?? null,
      magicDefenseBonus: stats.magicDefenseBonus ?? null,
      quality: `${weapon.quality ? `Quality: see ${ref}` : `No Quality (${ref})`}. Customizations: ${customizations}.`,
    }
    return { label: defaultFormLabel(index), ...item }
  })
  const { label: _label, ...first } = forms[0]
  return { kind: 'weapon', name: weapon.name, ...first, ...(forms.length > 1 ? { forms, form: 0 } : {}) }
}

/**
 * The rulebook items a slot can hold, for the Name field's suggestions: basic items (pp. 130–133) by
 * name, and the enabled Atlases' custom weapons with their book and page, e.g. "Eyre (NF p. 117)".
 */
export function rulebookItems(kinds: ItemKind[], settings: FuSettings): Map<string, FuItem> {
  const weapons = kinds.includes('weapon') ? BASIC_WEAPONS.map((weapon) => [weapon.name, itemFromWeapon(weapon)] as const) : []
  const custom = kinds.includes('weapon')
    ? CUSTOM_WEAPONS.filter((weapon) => bookEnabled(settings, weapon.book)).map(
        (weapon) => [`${weapon.name} (${bookRef(weapon.book, weapon.page)})`, itemFromCustomWeapon(weapon)] as const,
      )
    : []
  const defensive = BASIC_DEFENSIVE_ITEMS.filter((item) => kinds.includes(item.kind)).map(
    (item) => [item.name, itemFromDefensive(item)] as const,
  )
  return new Map([...weapons, ...custom, ...defensive].sort(([a], [b]) => compareNames(a, b)))
}
