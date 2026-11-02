import { sum } from '@/utils/sum'
import { DICE, STATUSES } from '../constants/attributes'
import type { AttributeKey, FuCharacter, FuDerived, FuItem, SlotKey } from '../types'
import { classBenefits, classLevel, heroicBonus, quirkBonus } from './rules'
import { slotWarnings } from './slotWarnings'

const dieSize = (value: string) => (DICE.includes(Number(value)) ? Number(value) : 6)
const filled = (item: FuItem) => item.kind !== ''

/** Works out level, maximums, Defense and warnings from the core rules (pp. 94, 127, 163–164, 227). */
export function calculate(character: FuCharacter): FuDerived {
  const level = character.classes.reduce((total, entry) => total + classLevel(entry), 0)
  const base = (key: AttributeKey) => dieSize(character.attributes[key])
  const current = (key: AttributeKey) => {
    const steps = STATUSES.filter((status) => character.statuses[status.key] && status.attributes.includes(key)).length
    return Math.max(6, base(key) - steps * 2)
  }

  const benefits = classBenefits(character)
  const heroic = heroicBonus(character, level)
  const quirk = quirkBonus(character)
  const hpBonus = benefits.hp + heroic.hp + quirk.hp
  const mpBonus = benefits.mp + heroic.mp + quirk.mp
  const ipBonus = benefits.ip + heroic.ip + quirk.ip
  const martial = quirk.martial ? { armor: true, shields: true, melee: true, ranged: true } : benefits.martial
  const maxHp = base('mig') * 5 + level + hpBonus + (character.hp.other ?? 0)

  const items = (Object.keys(character.equipment) as SlotKey[]).map((slot) => character.equipment[slot]).filter(filled)
  const armor = character.equipment.armor
  const armorDefense = armor.kind === 'armor' ? armor.defense : null
  const gear = {
    defense: sum(...items.map((item) => item.defenseBonus)) ?? 0,
    magicDefense: sum(...items.map((item) => item.magicDefenseBonus)) ?? 0,
    initiative: sum(...items.map((item) => item.initiative)) ?? 0,
  }
  const { modifiers } = character
  const nonMastered = character.classes.filter((entry) => entry.name.trim() && classLevel(entry) < 10).length

  return {
    level,
    base,
    current,
    hpBonus,
    mpBonus,
    ipBonus,
    maxHp,
    maxMp: base('wlp') * 5 + level + mpBonus + (character.mp.other ?? 0),
    maxIp: 6 + ipBonus + (character.ip.other ?? 0),
    crisis: Math.floor(maxHp / 2),
    martial,
    disciplines: benefits.disciplines,
    armorDefense,
    gear,
    defense: (armorDefense ?? current('dex')) + gear.defense + (modifiers.defense ?? 0),
    magicDefense: current('ins') + gear.magicDefense + (modifiers.magicDefense ?? 0),
    initiative: gear.initiative + (modifiers.initiative ?? 0),
    tooManyClasses: nonMastered > 3,
    equipmentWarnings: slotWarnings(character.equipment, martial),
  }
}
