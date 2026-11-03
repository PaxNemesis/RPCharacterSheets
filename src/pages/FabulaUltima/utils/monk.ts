import type { FuCharacter, FuDerived } from '../types'
import { skillLevel } from './rules'

/** Half the current Willpower die, from 3 to 6 (LF p. 101). */
export const soulBeadLimit = (derived: FuDerived) => Math.min(6, Math.max(3, Math.floor(derived.current('wlp') / 2)))

/** HP or MP each Bead restores with Soul Renewal: 10, then 12 from level 20 and 15 from level 40 (LF p. 102). */
export const soulRenewal = (level: number) => (level >= 40 ? 15 : level >= 20 ? 12 : 10)

/** The Monk's Skill Levels, by Skill. */
export function monkSkills(character: FuCharacter) {
  const sl = (name: string) => skillLevel(character, 'Monk', name)
  return {
    clarity: sl('Clarity'),
    resonantClarity: sl('Resonant Clarity'),
    soulRenewal: sl('Soul Renewal'),
    spiritShot: sl('Spirit Shot'),
    spiritualFortress: sl('Spiritual Fortress'),
  }
}

/** How many Clarity benefits are active: one per pair of Resolve Beads, at most Clarity's SL. */
export const activeClarity = (character: FuCharacter) =>
  Math.min(monkSkills(character).clarity, Math.floor(character.monk.resolve / 2))
