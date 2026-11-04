import { SYMBOLS } from '../constants/symbolist'
import type { FuCharacter } from '../types'
import { skillLevel } from './rules'

export const findSymbol = (name: string) => SYMBOLS.find((symbol) => symbol.name === name)

/** The Symbolist's Skill Levels, by Skill. */
export function symbolistSkills(character: FuCharacter) {
  const sl = (name: string) => skillLevel(character, 'Symbolist', name)
  return {
    magicSymbols: sl('Magic Symbols'),
    personalTouch: sl('Personal Touch'),
    symbolicConnection: sl('Symbolic Connection'),
    symbolism: sl('Symbolism'),
  }
}

/** Two symbols learned per level of Symbolism, and up to SL + 1 active at once (HF p. 147). */
export function symbolLimits(character: FuCharacter) {
  const { symbolism } = symbolistSkills(character)
  return { learned: symbolism * 2, active: symbolism > 0 ? symbolism + 1 : 0 }
}

/** HP and MP lost by a bearer of the Symbol of Forbiddance: 5, then 10 from level 20 and 20 from level 40 (HF p. 150). */
export const forbiddanceLoss = (level: number) => (level >= 40 ? 20 : level >= 20 ? 10 : 5)
