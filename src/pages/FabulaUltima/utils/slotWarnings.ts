import { SLOTS } from '../constants/slots'
import type { FuCharacter, FuItem, MartialKey } from '../types'

const martialKind = (item: FuItem): MartialKey | undefined => {
  if (item.kind === 'armor') return 'armor'
  if (item.kind === 'shield') return 'shields'
  if (item.kind === 'weapon' && item.range) return item.range
  return undefined
}

const MARTIAL_NAMES: Record<MartialKey, string> = {
  armor: 'martial armor',
  shields: 'martial shields',
  melee: 'martial melee weapons',
  ranged: 'martial ranged weapons',
}

/** Martial items the character's classes don't allow, and a two-handed weapon with a full off-hand. */
export function slotWarnings(equipment: FuCharacter['equipment'], martial: Record<MartialKey, boolean>): string[] {
  const warnings = SLOTS.flatMap(({ key, label }) => {
    const item = equipment[key]
    const kind = martialKind(item)
    if (!item.martial || !kind || martial[kind]) return []
    return [`${item.name.trim() || label} is martial, but none of your classes let you equip ${MARTIAL_NAMES[kind]}.`]
  })
  const { mainHand, offHand } = equipment
  if (mainHand.kind === 'weapon' && mainHand.hands === 'two' && offHand.kind !== '') {
    warnings.push('A two-handed weapon uses both hands, so the off-hand must be empty.')
  }
  return warnings
}
