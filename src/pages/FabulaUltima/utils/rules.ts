import { DISCIPLINES } from '../constants/attributes'
import { bookEnabled } from '../constants/books'
import { findClass } from '../constants/classes'
import { HEROIC_SKILLS } from '../constants/heroicSkills'
import { findQuirk } from '../constants/quirks'
import type { Discipline, FuCharacter, FuClass, MartialKey } from '../types'

const DISCIPLINE_KEYS = DISCIPLINES.map((discipline) => discipline.key)

/** Each class level gives one Skill Level, so a class's level is the total of its Skill Levels (p. 228). */
export const classLevel = (entry: FuClass) => entry.skills.reduce((total, skill) => total + (skill.level ?? 0), 0)

/** Free benefits only count once the character has a level in the class. */
const hasClass = (entry: FuClass) => classLevel(entry) >= 1

/** Totals of the free benefits of every class, from the rulebook or typed in for custom classes. */
export function classBenefits(character: FuCharacter) {
  const totals = { hp: 0, mp: 0, ip: 0 }
  const martial: Record<MartialKey, boolean> = { armor: false, shields: false, melee: false, ranged: false }
  const disciplines = new Set<Discipline>()

  for (const entry of character.classes.filter(hasClass)) {
    const data = findClass(character.settings, entry.name)
    const benefits = data?.benefits
    if (benefits) {
      totals.hp += (benefits.hp ?? 0) + (benefits.hpOrMp && entry.benefitChoice === 'hp' ? 5 : 0)
      totals.mp += (benefits.mp ?? 0) + (benefits.hpOrMp && entry.benefitChoice === 'mp' ? 5 : 0)
      totals.ip += benefits.ip ?? 0
      benefits.martial?.forEach((key) => (martial[key] = true))
      if (benefits.ritualism) disciplines.add('ritualism')
    } else {
      totals.hp += entry.custom.hp ?? 0
      totals.mp += entry.custom.mp ?? 0
      totals.ip += entry.custom.ip ?? 0
      for (const key of Object.keys(martial) as MartialKey[]) martial[key] ||= entry.custom.martial[key]
      if (entry.custom.ritualism) disciplines.add('ritualism')
    }
    // Skills such as Ritual Elementalism unlock their own discipline.
    for (const skill of entry.skills) {
      const match = /^ritual\s+(\w+)$/i.exec(skill.name.trim())
      const key = match?.[1].toLowerCase() as Discipline | undefined
      if (key && DISCIPLINE_KEYS.includes(key) && (skill.level ?? 0) >= 1) disciplines.add(key)
    }
  }

  return { ...totals, martial, disciplines: DISCIPLINE_KEYS.filter((key) => disciplines.has(key)) }
}

/** Extra HP, MP and IP from Heroic Skills; Extra HP and MP double at level 40 (pp. 235–236). */
export function heroicBonus(character: FuCharacter, level: number) {
  const totals = { hp: 0, mp: 0, ip: 0 }
  const scale = level >= 40 ? 2 : 1
  for (const { name } of character.heroicSkills) {
    const data = HEROIC_SKILLS.find(
      (skill) => skill.name.toLowerCase() === name.trim().toLowerCase() && bookEnabled(character.settings, skill.book),
    )
    totals.hp += (data?.bonus?.hp ?? 0) * scale
    totals.mp += (data?.bonus?.mp ?? 0) * scale
    totals.ip += data?.bonus?.ip ?? 0
  }
  return totals
}

/** The character's rulebook Quirk, if Quirks and its book are turned on. */
export const quirkOf = (character: FuCharacter) => {
  const quirk = findQuirk(character.quirk?.id ?? '')
  return character.settings.quirks && quirk && bookEnabled(character.settings, quirk.book) ? quirk : undefined
}

/** Permanent bonuses from the Quirk: Survivor's +5 HP and MP, and its chosen option (NF/TF p. 127). */
export function quirkBonus(character: FuCharacter) {
  const quirk = quirkOf(character)
  const choice = quirk?.survivor ? character.quirk.choice : ''
  return {
    hp: quirk?.bonus?.hp ?? 0,
    mp: quirk?.bonus?.mp ?? 0,
    ip: choice === 'ip' ? 2 : 0,
    martial: choice === 'martial',
  }
}

/** Problems with one class: level range, Skill maximums and the HP or MP choice. */
export function classIssues(character: FuCharacter, entry: FuClass): string[] {
  const data = findClass(character.settings, entry.name)
  const level = classLevel(entry)
  const overMax = data
    ? entry.skills.filter((skill) => {
        const max = data.skills.find((s) => s.name.toLowerCase() === skill.name.trim().toLowerCase())?.max
        return max !== undefined && (skill.level ?? 0) > max
      })
    : []

  return [
    level > 10 && 'A class can be at most level 10.',
    overMax.length > 0 && `Above the maximum Skill Level: ${overMax.map((skill) => skill.name).join(', ')}.`,
    data?.benefits.hpOrMp && !entry.benefitChoice && 'Choose whether the free benefit raises HP or MP.',
  ].filter((issue): issue is string => Boolean(issue))
}
