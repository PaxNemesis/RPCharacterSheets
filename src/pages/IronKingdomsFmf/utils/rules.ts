import { findRace, LEVEL_CAPS, LEVEL_INDEX, TRADITIONS } from '../constants/races'
import { baseSkillName, GENERAL_SKILLS } from '../constants/skills'
import { STAT_KEYS } from '../constants/stats'
import type { CareerData, IkCharacter, Num, StatKey } from '../types'
import { resolveCareer } from './careerOptions'

type Level = keyof typeof LEVEL_CAPS

const levelOf = (character: IkCharacter): Level =>
  character.identity.level in LEVEL_CAPS ? (character.identity.level as Level) : 'Hero'

/** The character's rulebook careers with their chosen options, when career rules are on. */
export const careersOf = (character: IkCharacter): CareerData[] =>
  character.settings.careerRules
    ? character.identity.careerList.map((name) => resolveCareer(character, name ?? '')).filter((career) => career !== undefined)
    : []

export const variantOf = (character: IkCharacter, career: CareerData) =>
  career.variants?.find((variant) => variant.label === character.identity.careerVariants?.[career.name])

/** Permanent stat bonuses from career variants, such as a stone sorcerer's +1 PHY (p. 146). */
const careerStatBonus = (character: IkCharacter, key: StatKey) =>
  careersOf(character).reduce((total, career) => total + (variantOf(character, career)?.stats?.[key] ?? 0), 0)

const isGifted = (character: IkCharacter) => character.identity.archetype.trim().toLowerCase() === 'gifted'

/** The stat's maximum: from the race and experience level with race rules on, otherwise as typed. */
export function statMaximum(character: IkCharacter, key: StatKey): Num {
  if (!character.settings.raceRules) return character.stats[key]?.max ?? null
  const race = findRace(character.identity.race)
  const limits = race?.limits[key]
  if (!limits || (key === 'arc' && !isGifted(character))) return null
  return limits[LEVEL_INDEX[levelOf(character)]] + careerStatBonus(character, key)
}

/** Starting stats for the race, before advancement points (p. 107). */
export function startingStats(character: IkCharacter): Partial<Record<StatKey, number>> {
  const race = findRace(character.identity.race)
  if (!race) return {}
  const stats: Partial<Record<StatKey, number>> = {}
  for (const key of STAT_KEYS) {
    const start = race.start[key]
    if (start !== undefined) stats[key] = start + careerStatBonus(character, key)
  }
  const bonus = character.identity.humanBonus
  if (race.name === 'Human' && bonus && stats[bonus] !== undefined) stats[bonus] += 1
  const tradition = TRADITIONS.find((t) => t.value.toLowerCase() === character.arcaneTradition.trim().toLowerCase())
  if (isGifted(character) && race.limits.arc && tradition) stats.arc = tradition.arc
  return stats
}

const lookup = (maxima: Record<string, number>, name: string) => {
  const key = Object.keys(maxima).find((skill) => skill.toLowerCase() === name.toLowerCase())
  return key === undefined ? undefined : maxima[key]
}

/**
 * Highest level a skill can reach: the best maximum among the character's careers (general
 * skills use each career's "General Skills" entry), capped at 2/3/4 for Hero/Veteran/Epic (p. 171).
 * Returns null when none of the careers offer the skill.
 */
export function skillMaximum(character: IkCharacter, name: string): Num {
  const base = baseSkillName(name)
  const isGeneral = GENERAL_SKILLS.some((skill) => skill.toLowerCase() === base.toLowerCase())
  const best = careersOf(character).reduce<number | undefined>((current, career) => {
    const max =
      lookup(career.maxima, name) ??
      lookup(career.maxima, base) ??
      (isGeneral ? lookup(career.maxima, 'General Skills') : undefined)
    return max === undefined ? current : Math.max(current ?? 0, max)
  }, undefined)
  return best === undefined ? null : Math.min(best, LEVEL_CAPS[levelOf(character)])
}

export const racialDefense = (character: IkCharacter): Num =>
  character.settings.raceRules ? (findRace(character.identity.race)?.defense ?? null) : null
