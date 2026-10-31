import { bookEnabled } from '../constants/books'
import { CAREER_ADDITIONS, CAREER_OPTIONS } from '../constants/careerOptions'
import { findCareer } from '../constants/careers'
import { baseSkillName } from '../constants/skills'
import type { CareerData, CareerOption, IkCharacter, SkillChoice, SkillGrant } from '../types'
import { compareNames } from './alphabetical'

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()
const unique = (values: string[]) => [...new Set(values)]
const without = (values: string[], removed: string[] = []) => values.filter((value) => !removed.some((r) => same(r, value)))

/** Options whose book is on and whose careers are all among the two starting careers. */
export function availableOptions(character: IkCharacter): CareerOption[] {
  const starting = character.identity.careerList.slice(0, 2).map((name) => findCareer(name ?? '')?.name)
  return CAREER_OPTIONS.filter(
    (option) => bookEnabled(character.settings, option.book) && option.careers.every((name) => starting.includes(name)),
  ).sort((a, b) => compareNames(a.name, b.name))
}

export const chosenOptions = (character: IkCharacter) =>
  availableOptions(character).filter((option) => character.identity.careerOptions?.includes(option.name))

const removeSkills = (skills: (SkillGrant | SkillChoice)[], removed: string[] = []) => {
  const kept = (grant: SkillGrant) => !removed.some((name) => same(name, grant.name) || same(name, baseSkillName(grant.name)))
  return skills.flatMap<SkillGrant | SkillChoice>((entry) => {
    if (!('choose' in entry)) return kept(entry) ? [entry] : []
    const options = entry.options.filter(kept)
    return options.length > 0 ? [{ choose: Math.min(entry.choose, options.length), options }] : []
  })
}

function applyOption(career: CareerData, option: CareerOption): CareerData {
  const { add = {}, remove = {} } = option
  const target = option.careers[0] === career.name
  const changed: CareerData = {
    ...career,
    abilities: without(career.abilities, remove.abilities),
    skills: removeSkills(career.skills, remove.skills),
    assets: without(career.assets, remove.assets),
  }
  if (!target) return changed
  return {
    ...changed,
    pairsWith: option.pairsWith ?? changed.pairsWith,
    abilities: unique([...changed.abilities, ...(add.abilities ?? [])]),
    connections: unique([...changed.connections, ...(add.connections ?? [])]),
    skills: [...changed.skills, ...(add.skills ?? [])],
    spells: option.spells ?? changed.spells,
    gold: option.gold ?? changed.gold,
    assets: [...changed.assets, ...(add.assets ?? [])],
    maxima: { ...changed.maxima, ...add.maxima },
    abilityList: unique([...changed.abilityList, ...(add.abilityList ?? []), ...(add.abilities ?? [])]),
  }
}

/** A rulebook career with the supplements' additions and the character's chosen options applied. */
export function resolveCareer(character: IkCharacter, name: string): CareerData | undefined {
  const base = findCareer(name)
  if (!base) return undefined
  const additions = CAREER_ADDITIONS.filter(
    (addition) => bookEnabled(character.settings, addition.book) && addition.careers.includes(base.name),
  )
  const extended = additions.reduce<CareerData>(
    (career, addition) => ({
      ...career,
      abilityList: unique([...career.abilityList, ...(addition.abilityList ?? [])]),
      pairsWith: career.pairsWith && addition.pairsWith ? [...career.pairsWith, ...addition.pairsWith] : career.pairsWith,
    }),
    base,
  )
  return chosenOptions(character)
    .filter((option) => option.careers.includes(base.name))
    .reduce(applyOption, extended)
}
