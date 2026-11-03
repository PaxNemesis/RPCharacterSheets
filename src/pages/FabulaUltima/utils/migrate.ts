type Data = Record<string, unknown>
type SavedClass = { level?: unknown; skills?: { level?: unknown }[] } & Data
type SavedSpell = { notes?: unknown; page?: unknown } & Data

/**
 * Version 2 works out class level from Skill Levels instead of storing it. A class whose stored
 * level was higher than its Skill Levels gets an unnamed Skill row for the difference.
 */
function classLevelsFromSkills(character: Data): Data {
  if (!Array.isArray(character.classes)) return character
  const classes = (character.classes as SavedClass[]).map(({ level, ...entry }) => {
    const skills = Array.isArray(entry.skills) ? entry.skills : []
    const skillLevels = skills.reduce((total, skill) => total + (typeof skill.level === 'number' ? skill.level : 0), 0)
    const missing = (typeof level === 'number' ? level : 0) - skillLevels
    return missing > 0 ? { ...entry, skills: [...skills, { name: '', level: missing, notes: '' }] } : { ...entry, skills }
  })
  return { ...character, classes }
}

// What "Add from rulebook" used to write into a spell's notes, e.g. "Spiritist, p. 208" or "Illusionist, LF p. 97".
const OLD_SPELL_SOURCE = /^[\w ]+, ((?:[A-Z][\w ]* )?p\. \d+)$/

/**
 * Version 4 gives spells their own page field, moved out of notes written by the old rulebook picker.
 * It only fills an empty page, so it is safe to run twice: version 3 sheets that skipped it get it too.
 */
function spellPages(character: Data): Data {
  if (!Array.isArray(character.spells)) return character
  const spells = (character.spells as SavedSpell[]).map((spell) => {
    const match = typeof spell.notes === 'string' ? OLD_SPELL_SOURCE.exec(spell.notes.trim()) : null
    const page = typeof spell.page === 'string' ? spell.page : ''
    return match && !page ? { ...spell, page: match[1], notes: '' } : { ...spell, page }
  })
  return { ...character, spells }
}

/** Version 5 lets a custom class grant any ritual discipline, not only Ritualism. */
function customDisciplines(character: Data): Data {
  if (!Array.isArray(character.classes)) return character
  const classes = (character.classes as Data[]).map((entry) => {
    if (entry.custom === null || typeof entry.custom !== 'object') return entry
    const { ritualism, ...custom } = entry.custom as Data
    const disciplines = typeof custom.disciplines === 'object' && custom.disciplines !== null ? custom.disciplines : {}
    return { ...entry, custom: { ...custom, disciplines: ritualism === true ? { ...disciplines, ritualism: true } : disciplines } }
  })
  return { ...character, classes }
}

const STEPS: [version: number, upgrade: (character: Data) => Data][] = [
  [2, classLevelsFromSkills],
  // Version 3 ran this step too, but characters loaded before it could be saved as 3 without it.
  [4, spellPages],
  [5, customDisciplines],
]

/** Upgrades characters saved by older versions of the sheet, one version at a time. */
export function migrate(data: unknown, fromVersion: number): unknown {
  if (data === null || typeof data !== 'object') return data
  return STEPS.filter(([version]) => version > fromVersion).reduce<Data>((character, [, upgrade]) => upgrade(character), data as Data)
}
