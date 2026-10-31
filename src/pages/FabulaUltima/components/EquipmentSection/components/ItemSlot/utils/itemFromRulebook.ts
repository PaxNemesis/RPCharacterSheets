import type { DefensiveItemData, FuItem, WeaponData } from '../../../../../types'
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
