import { SLOTS } from '../constants/slots'
import type { FuCharacter, MartialKey } from '../types'
import { MARTIAL_NAMES, martialNeeds } from './martial'

/** Martial items the character's classes don't allow, and a two-handed weapon with a full off-hand. */
export function slotWarnings(equipment: FuCharacter['equipment'], martial: Record<MartialKey, boolean>): string[] {
  const warnings = SLOTS.flatMap(({ key, label }) => {
    const item = equipment[key]
    const missing = martialNeeds(item).filter((need) => !martial[need])
    if (missing.length === 0) return []
    const names = missing.map((need) => MARTIAL_NAMES[need]).join(' or ')
    return [`${item.name.trim() || label} is martial, but neither your classes nor your Quirk let you equip ${names}.`]
  })
  const { mainHand, offHand } = equipment
  if (mainHand.kind === 'weapon' && mainHand.hands === 'two' && offHand.kind !== '') {
    warnings.push('A two-handed weapon uses both hands, so the off-hand must be empty.')
  }
  return warnings
}
