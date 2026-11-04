import { DANCE_MP, DANCE_MP_AFTER_OTHER, DANCES, FOLLOW_MY_LEAD_MP } from '../constants/dancer'
import type { FuCharacter, FuDancer, FuDerived } from '../types'
import { skillLevel } from './rules'

export const findDance = (name: string) => DANCES.find((dance) => dance.name === name)

/** The Dancer's Skill Levels, by Skill. */
export function dancerSkills(character: FuCharacter) {
  const sl = (name: string) => skillLevel(character, 'Dancer', name)
  return {
    dance: sl('Dance'),
    followMyLead: sl('Follow My Lead'),
    freneticFootwork: sl('Frenetic Footwork'),
    quickChange: sl('Quick-Change'),
    wardancer: sl('Wardancer'),
  }
}

/**
 * MP to perform a dance: 10, or 5 after a different dance on your previous turn, plus 10 to share
 * a dance that lasts until your next turn with Follow My Lead (HF p. 143).
 */
export function danceCost(dancer: FuDancer, name: string, shared = false) {
  const base = dancer.previous && dancer.previous !== name ? DANCE_MP_AFTER_OTHER : DANCE_MP
  return base + (shared && findDance(name)?.duration === 'turn' ? FOLLOW_MY_LEAD_MP : 0)
}

/** Dances can't be performed with martial armor equipped (HF p. 143). */
export const canDance = (character: FuCharacter) => !character.equipment.armor.martial

/** The numbers for dances that depend on your Dexterity die and level (HF p. 144–145). */
export function danceAmount(name: string, derived: FuDerived) {
  const dex = derived.current('dex')
  if (name === 'Maenad Dance') return `${dex} MP loss`
  if (name === 'Unicorn Dance') return `${dex + (derived.level >= 40 ? 10 : derived.level >= 20 ? 5 : 0)} HP each`
  return undefined
}
