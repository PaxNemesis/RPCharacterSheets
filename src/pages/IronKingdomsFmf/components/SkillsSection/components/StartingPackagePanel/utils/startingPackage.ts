import { abilityPage } from '../../../../../constants/abilities'
import { findRace } from '../../../../../constants/races'
import type { CareerData, IkCharacter, SkillGrant } from '../../../../../types'
import { careersOf, variantOf } from '../../../../../utils/rules'

/** The player's picks for "choose one of…" skills, keyed by `choiceKey`. */
export type PackageSelection = Record<string, string[]>

export const choiceKey = (career: CareerData, index: number) => `${career.name}:${index}`

const unique = (values: string[]) => [...new Set(values)]
const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

/** The starting careers' combined package (pp. 117–119), plus racial abilities and connections. */
export function startingPackage(character: IkCharacter, selection: PackageSelection) {
  const careers = careersOf(character).slice(0, 2)
  const race = character.settings.raceRules ? findRace(character.identity.race) : undefined
  const grantsByCareer = careers.map((career) => {
    const variant = variantOf(character, career)
    return [...career.skills, ...(variant?.skills ?? [])].flatMap((entry, index) =>
      'choose' in entry
        ? entry.options.filter((option) => selection[choiceKey(career, index)]?.includes(option.name))
        : [entry],
    )
  })

  // The same starting skill from both careers starts at level 2 (p. 117).
  const skills: SkillGrant[] = []
  for (const grant of grantsByCareer.flat()) {
    const existing = skills.find((skill) => same(skill.name, grant.name))
    if (existing) existing.level = Math.max(2, existing.level, grant.level)
    else skills.push({ ...grant })
  }

  // A career's own entries plus those of its chosen variant (a priest's faith, a sorcerer's element).
  const fromCareers = (key: 'abilities' | 'connections' | 'spells') =>
    careers.flatMap((career) => [...career[key], ...(variantOf(character, career)?.[key] ?? [])])

  return {
    careers,
    skills,
    abilities: unique([...(race?.abilities ?? []), ...fromCareers('abilities')]),
    connections: unique([...(race?.connections ?? []), ...fromCareers('connections')]),
    spells: unique(fromCareers('spells')),
    gold: careers.reduce((total, career) => total + career.gold, 0),
    assets: careers.flatMap((career) => career.assets.map((asset) => ({ name: asset, career: career.name }))),
  }
}

type Package = ReturnType<typeof startingPackage>

/** Adds the package to the character without removing anything already on the sheet. */
export function applyStartingPackage(character: IkCharacter, pack: Package): { character: IkCharacter; notes: string[] } {
  const notes: string[] = []
  const skills = [...character.skills]
  for (const grant of pack.skills) {
    const index = skills.findIndex((skill) => same(skill.name, grant.name))
    if (index >= 0) skills[index] = { ...skills[index], level: Math.max(skills[index].level ?? 0, grant.level) }
    else skills.push({ name: grant.name, stat: '', level: grant.level })
  }
  const missing = <T extends { name: string }>(rows: T[], names: string[]) =>
    names.filter((name) => !rows.some((row) => same(row.name, name)))

  let arcaneTradition = character.arcaneTradition
  if (character.identity.archetype === 'Gifted') {
    if (pack.careers.some((career) => career.name === 'Warcaster')) arcaneTradition = 'Focuser'
    else if (!arcaneTradition) arcaneTradition = 'Will Weaver'
  }
  if (character.gold !== null && pack.gold > 0) {
    notes.push(`Gold was already filled in, so the starting ${pack.gold} gc was not added.`)
  }

  return {
    notes,
    character: {
      ...character,
      skills,
      arcaneTradition,
      abilities: [
        ...character.abilities,
        ...missing(character.abilities, pack.abilities).map((name) => ({ name, description: '', page: String(abilityPage(name) ?? '') })),
      ],
      connections: [
        ...character.connections,
        ...missing(character.connections, pack.connections).map((name) => ({ name, description: '', page: '' })),
      ],
      spells: [
        ...character.spells,
        ...missing(character.spells, pack.spells).map((name) => ({ name, cost: null, rng: '', aoe: '', pow: null, up: '', off: '' })),
      ],
      gear: [
        ...character.gear,
        ...pack.assets
          .filter((asset) => !character.gear.some((row) => same(row.name, asset.name)))
          .map((asset) => ({ name: asset.name, notes: `${asset.career} starting asset`, quantity: 1 })),
      ],
      gold: character.gold ?? (pack.gold > 0 ? pack.gold : null),
    },
  }
}
