import type { ListItems } from '@/components/CharacterWorkspace'
import { createArmor, createMechanika, createSteamjack, createStoredItem } from './createCharacter'
import { createMeleeWeapon, createRangedWeapon } from './weaponColumns'

const entry = { name: '', description: '', page: '' }

/** Blank entries for each list, so entries loaded from a file or the browser can be checked and completed. */
export const LIST_ITEMS: ListItems = {
  'identity.careerOptions': '',
  rangedWeapons: createRangedWeapon(),
  meleeWeapons: createMeleeWeapon(),
  skills: { name: '', stat: '', level: null, page: '' },
  abilities: entry,
  archetypeBenefits: entry,
  connections: entry,
  gear: { name: '', notes: '', quantity: null },
  armor: createArmor(),
  stored: createStoredItem(),
  spells: { name: '', cost: null, rng: '', aoe: '', pow: null, up: '', off: '', page: '', description: '' },
  mechanika: createMechanika(),
  'mechanika.runes': { name: '', points: null, page: '', notes: '' },
  steamjacks: createSteamjack(),
  'steamjacks.rangedWeapons': createRangedWeapon(),
  'steamjacks.meleeWeapons': createMeleeWeapon(),
  'steamjacks.catastrophic': { area: '', notes: '' },
  'steamjacks.gear': { name: '', notes: '' },
  'steamjacks.powerAttacks': { name: '', description: '' },
}
