import type { DefensiveItemData, WeaponData } from '../types'

type WeaponRow = [string, string, number, boolean, 'one' | 'two', 'melee' | 'ranged', WeaponData['accuracy'], number, number?]

const weapon = ([name, category, page, martial, hands, range, accuracy, damage, accuracyBonus]: WeaponRow): WeaponData => ({
  name,
  category,
  page,
  martial,
  hands,
  range,
  accuracy,
  damage,
  accuracyBonus,
})

/** Basic weapons (pp. 130–131). */
export const BASIC_WEAPONS: WeaponData[] = (
  [
    ['Staff', 'Arcane', 130, false, 'two', 'melee', ['wlp', 'wlp'], 6],
    ['Tome', 'Arcane', 130, false, 'two', 'melee', ['ins', 'ins'], 6],
    ['Crossbow', 'Bow', 130, false, 'two', 'ranged', ['dex', 'ins'], 8],
    ['Shortbow', 'Bow', 130, false, 'two', 'ranged', ['dex', 'dex'], 8],
    ['Unarmed Strike', 'Brawling', 130, false, 'one', 'melee', ['dex', 'mig'], 0],
    ['Improvised (Melee)', 'Brawling', 130, false, 'one', 'melee', ['dex', 'mig'], 2],
    ['Iron Knuckle', 'Brawling', 130, false, 'one', 'melee', ['dex', 'mig'], 6],
    ['Steel Dagger', 'Dagger', 130, false, 'one', 'melee', ['dex', 'ins'], 4, 1],
    ['Pistol', 'Firearm', 130, true, 'one', 'ranged', ['dex', 'ins'], 8],
    ['Chain Whip', 'Flail', 130, false, 'two', 'melee', ['dex', 'dex'], 8],
    ['Iron Hammer', 'Heavy', 131, false, 'one', 'melee', ['mig', 'mig'], 6],
    ['Broadaxe', 'Heavy', 131, true, 'one', 'melee', ['mig', 'mig'], 10],
    ['Waraxe', 'Heavy', 131, true, 'two', 'melee', ['mig', 'mig'], 14],
    ['Light Spear', 'Spear', 131, true, 'one', 'melee', ['dex', 'mig'], 8],
    ['Heavy Spear', 'Spear', 131, true, 'two', 'melee', ['dex', 'mig'], 12],
    ['Bronze Sword', 'Sword', 131, true, 'one', 'melee', ['dex', 'mig'], 6, 1],
    ['Greatsword', 'Sword', 131, true, 'two', 'melee', ['dex', 'mig'], 10, 1],
    ['Katana', 'Sword', 131, true, 'two', 'melee', ['dex', 'ins'], 10, 1],
    ['Rapier', 'Sword', 131, true, 'one', 'melee', ['dex', 'ins'], 6, 1],
    ['Improvised (Ranged)', 'Thrown', 131, false, 'one', 'ranged', ['dex', 'mig'], 2],
    ['Shuriken', 'Thrown', 131, false, 'one', 'ranged', ['dex', 'ins'], 4],
  ] satisfies WeaponRow[]
).map(weapon)

/** Basic armor and shields (pp. 132–133). */
export const BASIC_DEFENSIVE_ITEMS: DefensiveItemData[] = [
  { name: 'Silk Shirt', kind: 'armor', page: 132, martial: false, magicDefenseBonus: 2, initiative: -1 },
  { name: 'Travel Garb', kind: 'armor', page: 132, martial: false, defenseBonus: 1, magicDefenseBonus: 1, initiative: -1 },
  { name: 'Combat Tunic', kind: 'armor', page: 132, martial: false, defenseBonus: 1, magicDefenseBonus: 1 },
  { name: 'Sage Robe', kind: 'armor', page: 132, martial: false, defenseBonus: 1, magicDefenseBonus: 2, initiative: -2 },
  { name: 'Brigandine', kind: 'armor', page: 132, martial: true, defense: 10, initiative: -2 },
  { name: 'Bronze Plate', kind: 'armor', page: 132, martial: true, defense: 11, initiative: -3 },
  { name: 'Runic Plate', kind: 'armor', page: 132, martial: true, defense: 11, magicDefenseBonus: 1, initiative: -3 },
  { name: 'Steel Plate', kind: 'armor', page: 132, martial: true, defense: 12, initiative: -4 },
  { name: 'Bronze Shield', kind: 'shield', page: 133, martial: false, defenseBonus: 2 },
  { name: 'Runic Shield', kind: 'shield', page: 133, martial: true, defenseBonus: 2, magicDefenseBonus: 2 },
]
