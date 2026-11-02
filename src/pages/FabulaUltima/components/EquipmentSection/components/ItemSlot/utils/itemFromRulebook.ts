import { compareNames } from '@/utils/alphabetical'
import { BASIC_DEFENSIVE_ITEMS, BASIC_WEAPONS } from '../../../../../constants/equipment'
import type { DefensiveItemData, FuItem, ItemKind, WeaponData } from '../../../../../types'
import { createItem } from '../../../../../utils/createCharacter'

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

/** The basic items a slot can hold, by name, for the Name field's suggestions (pp. 130–133). */
export function rulebookItems(kinds: ItemKind[]): Map<string, FuItem> {
  const weapons = kinds.includes('weapon') ? BASIC_WEAPONS.map(itemFromWeapon) : []
  const defensive = BASIC_DEFENSIVE_ITEMS.filter((item) => kinds.includes(item.kind)).map(itemFromDefensive)
  return new Map([...weapons, ...defensive].sort((a, b) => compareNames(a.name, b.name)).map((item) => [item.name, item]))
}
