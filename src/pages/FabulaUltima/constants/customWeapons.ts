import type { CustomWeaponData, CustomWeaponForm, SupplementId } from '../types'

type FormRow = [
  martial: boolean,
  category: string,
  range: CustomWeaponForm['range'],
  accuracy: CustomWeaponForm['accuracy'],
  accuracyBonus: number,
  damage: number,
  damageType: string,
  customizations: string,
  /** A Quality's own bonus to both Defense and Magic Defense, on top of the boosts. */
  extraBoost?: number,
]
type WeaponRow = [name: string, page: number, quality: boolean, ...forms: FormRow[]]

const BOOST = 2

const boost = (has: boolean, extra = 0) => (has ? BOOST : 0) + extra || undefined

const form = ([martial, category, range, accuracy, accuracyBonus, damage, damageType, customizations, extra]: FormRow): CustomWeaponForm => ({
  martial,
  category,
  range,
  accuracy,
  accuracyBonus,
  damage,
  damageType,
  customizations,
  // The boosts add a flat +2 (HF p. 107); "magic defense boost" also contains "defense boost".
  defenseBonus: boost(/(^|, )defense boost/.test(customizations), extra),
  magicDefenseBonus: boost(customizations.includes('magic defense boost'), extra),
})

const weapons = (book: SupplementId, rows: WeaponRow[]): CustomWeaponData[] =>
  rows.map(([name, page, quality, ...forms]) => ({ name, book, page, quality, forms: forms.map(form) }))

const dm: CustomWeaponForm['accuracy'] = ['dex', 'mig']
const di: CustomWeaponForm['accuracy'] = ['dex', 'ins']

/** Sample custom weapons and their rare evolutions (HF pp. 109–113, NF pp. 115–119, TF pp. 115–119). */
export const CUSTOM_WEAPONS: CustomWeaponData[] = [
  ...weapons('high', [
    ['Dancing Knives', 109, false, [true, 'Dagger', 'melee', dm, 0, 5, 'physical', 'quick, transforming'], [true, 'Flail', 'ranged', dm, 2, 10, 'physical', 'accurate, powerful, transforming']],
    ['Blazing Chains', 109, true, [true, 'Dagger', 'melee', dm, 0, 9, 'fire', 'quick, transforming'], [true, 'Flail', 'ranged', dm, 2, 14, 'fire', 'accurate, powerful, transforming']],
    ['Grimoire of Force', 110, false, [true, 'Arcane', 'ranged', di, 0, 5, 'physical', 'magic defense boost, quick']],
    ['Grimoire of Wind', 110, true, [true, 'Arcane', 'ranged', di, 1, 9, 'air', 'magic defense boost, quick']],
    ["Hoplite's Axe", 110, false, [false, 'Spear', 'melee', dm, 2, 5, 'physical', 'accurate, defense boost, transforming'], [true, 'Heavy', 'melee', dm, 0, 14, 'bolt', 'elemental, powerful, transforming']],
    ['Dragonspine', 111, true, [true, 'Spear', 'melee', dm, 2, 9, 'physical', 'accurate, defense boost, transforming'], [true, 'Heavy', 'melee', dm, 0, 18, 'physical', 'elemental, powerful, transforming']],
    // The book lists both greatswords as ranged and both crossbows as melee.
    ['Guardian Claymore', 111, false, [true, 'Sword', 'ranged', dm, 0, 10, 'physical', 'defense boost, magic defense boost, powerful']],
    ['Queenswarden', 111, true, [true, 'Sword', 'ranged', dm, 1, 14, 'light', 'defense boost, magic defense boost, powerful', 1]],
    ['Somber Memory', 112, false, [true, 'Bow', 'melee', di, 2, 10, 'physical', 'accurate, magic defense boost, powerful']],
    ['Angelslayer', 112, true, [true, 'Bow', 'melee', di, 2, 14, 'dark', 'accurate, magic defense boost, powerful']],
    ['Cannon Gauntlets', 112, false, [true, 'Brawling', 'melee', dm, 0, 5, 'physical', 'quick, transforming'], [true, 'Firearm', 'melee', dm, 0, 10, 'bolt', 'defense boost, powerful, transforming']],
    ['Groundsplitters', 113, true, [true, 'Brawling', 'melee', dm, 0, 5, 'earth', 'accurate, defense boost, transforming'], [true, 'Firearm', 'melee', dm, 0, 10, 'earth', 'defense boost, powerful, transforming']],
    ['Giant Shuriken', 113, false, [true, 'Thrown', 'ranged', di, 2, 10, 'physical', 'accurate, defense boost, powerful']],
    ['Pale Presence', 113, true, [true, 'Thrown', 'ranged', di, 2, 14, 'ice', 'accurate, defense boost, powerful']],
  ]),
  ...weapons('natural', [
    ['Stake Driver', 115, false, [true, 'Spear', 'melee', di, 2, 10, 'physical', 'accurate, defense boost, powerful']],
    ['Autoscrapper', 115, true, [true, 'Spear', 'melee', di, 2, 14, 'earth', 'accurate, defense boost, powerful']],
    ['Brass Key', 116, false, [false, 'Arcane', 'ranged', di, 2, 7, 'bolt', 'accurate, defense boost, elemental']],
    ['Oxidized Key', 116, true, [false, 'Arcane', 'ranged', di, 2, 7, 'bolt', 'accurate, defense boost, elemental']],
    ['Rosenschwert', 116, false, [true, 'Sword', 'melee', di, 2, 10, 'physical', 'accurate, magic defense boost, powerful']],
    ['Crescent Scissors', 117, true, [true, 'Sword', 'melee', di, 2, 10, 'light', 'accurate, magic defense boost, powerful']],
    ['Eyre', 117, false, [true, 'Dagger', 'melee', di, 0, 5, 'physical', 'defense boost, magic defense boost, transforming'], [true, 'Firearm', 'ranged', di, 2, 10, 'physical', 'accurate, powerful, transforming']],
    ['Earnshaw', 117, true, [true, 'Dagger', 'melee', di, 0, 9, 'dark', 'defense boost, magic defense boost, transforming'], [true, 'Firearm', 'ranged', di, 2, 14, 'dark', 'accurate, powerful, transforming']],
    ['Gastraphetes', 118, false, [true, 'Bow', 'ranged', dm, 2, 10, 'physical', 'accurate, defense boost, powerful']],
    ['Helepolis', 118, true, [true, 'Bow', 'ranged', dm, 2, 14, 'fire', 'accurate, defense boost, powerful']],
    ['Copper Rattles', 118, false, [false, 'Brawling', 'melee', dm, 0, 5, 'physical', 'quick, transforming'], [true, 'Flail', 'melee', dm, 0, 12, 'ice', 'elemental, powerful, transforming']],
    ['Water Toll', 119, true, [true, 'Brawling', 'melee', dm, 0, 9, 'physical', 'quick, transforming'], [true, 'Flail', 'melee', dm, 0, 16, 'ice', 'elemental, powerful, transforming']],
    ['Shovelpick', 119, false, [true, 'Heavy', 'melee', dm, 2, 12, 'physical', 'accurate, defense boost, powerful']],
    ['Vanguard Spade', 119, true, [true, 'Heavy', 'melee', dm, 2, 16, 'physical', 'accurate, defense boost, powerful']],
  ]),
  ...weapons('techno', [
    ['Gladius Shield', 115, false, [true, 'Sword', 'melee', dm, 2, 10, 'physical', 'accurate, defense boost, powerful']],
    ['Blazing Aegis', 115, true, [true, 'Sword', 'melee', dm, 2, 14, 'fire', 'accurate, defense boost, powerful']],
    ['Wallbreakers', 116, false, [true, 'Brawling', 'melee', dm, 2, 10, 'physical', 'accurate, defense boost, powerful']],
    ['Megaton Boots', 116, true, [true, 'Brawling', 'melee', dm, 2, 10, 'earth', 'accurate, defense boost, powerful']],
    ['Combustion Spinner', 116, false, [true, 'Flail', 'melee', di, 0, 7, 'fire', 'elemental, quick']],
    ['Infernal Twister', 117, true, [true, 'Flail', 'melee', di, 1, 11, 'fire', 'elemental, quick']],
    ['Ectorifle', 117, false, [false, 'Firearm', 'ranged', di, 2, 10, 'physical', 'accurate, powerful, transforming'], [true, 'Arcane', 'ranged', di, 2, 7, 'light', 'accurate, elemental, transforming']],
    ['Asclepius', 117, true, [true, 'Firearm', 'ranged', di, 2, 14, 'physical', 'accurate, powerful, transforming'], [true, 'Arcane', 'ranged', di, 2, 11, 'light', 'accurate, elemental, transforming']],
    ['Gearwrench', 118, false, [true, 'Heavy', 'melee', dm, 0, 12, 'physical', 'defense boost, magic defense boost, powerful']],
    ['Fixer Grip', 118, true, [true, 'Heavy', 'melee', dm, 0, 16, 'physical', 'defense boost, magic defense boost, powerful']],
    ['Blastpike', 118, false, [true, 'Firearm', 'melee', dm, 2, 10, 'physical', 'accurate, defense boost, powerful']],
    ['Thundermaw', 119, true, [true, 'Firearm', 'melee', dm, 2, 10, 'bolt', 'accurate, defense boost, powerful']],
    ['Overnight Caliber', 119, false, [true, 'Brawling', 'melee', dm, 0, 5, 'physical', 'defense boost, magic defense boost, transforming'], [true, 'Firearm', 'ranged', dm, 2, 10, 'physical', 'accurate, powerful, transforming']],
    ['Cold Case', 119, true, [true, 'Brawling', 'melee', dm, 0, 9, 'ice', 'defense boost, magic defense boost, transforming'], [true, 'Firearm', 'ranged', dm, 2, 14, 'ice', 'accurate, powerful, transforming']],
  ]),
]
