import type { FuCharacter, FuClass, FuHeroicSkill } from '../types'
import { classLevel } from './rules'

/** Source of a Heroic Skill that doesn't come from mastering a class, such as breaking a curse. */
export const OTHER_SOURCE = ':other'

const key = (name: string) => name.trim().toLowerCase()
const isMastered = (entry: FuClass) => classLevel(entry) >= 10

/** The first mastered class that doesn't have a Heroic Skill yet, for new rows. */
export function nextSource(character: FuCharacter): string {
  const taken = new Set(character.heroicSkills.map((skill) => key(skill.source ?? '')))
  const open = character.classes.find((entry) => entry.name.trim() && isMastered(entry) && !taken.has(key(entry.name)))
  return open?.name.trim() ?? ''
}

/** Mastering a class gives exactly one Heroic Skill (p. 228); flags rows and classes that don't add up. */
export function heroicIssues(character: FuCharacter): string[] {
  const classes = character.classes.filter((entry) => entry.name.trim())
  const linked = (entry: FuClass) =>
    character.heroicSkills.filter((skill) => key(skill.source ?? '') === key(entry.name)).length
  const label = (skill: FuHeroicSkill) => skill.name.trim() || 'A Heroic Skill'

  const classIssues = classes.flatMap((entry) => {
    const count = linked(entry)
    const name = entry.name.trim()
    if (isMastered(entry) && count === 0) return [`${name} is mastered but has no Heroic Skill yet.`]
    if (count > 1) return [`${name} has ${count} Heroic Skills; mastering a class gives one.`]
    return []
  })

  const skillIssues = character.heroicSkills.flatMap((skill) => {
    const source = (skill.source ?? '').trim()
    if (source === OTHER_SOURCE) return []
    if (!source) return skill.name.trim() ? [`Choose where ${label(skill)} came from.`] : []
    const entry = classes.find((candidate) => key(candidate.name) === key(source))
    if (!entry) return [`${label(skill)} is linked to ${source}, which isn't one of your classes.`]
    if (!isMastered(entry)) {
      return [`${label(skill)} is linked to ${entry.name.trim()}, which isn't mastered yet (level ${classLevel(entry)} of 10).`]
    }
    return []
  })

  return [...classIssues, ...skillIssues]
}
