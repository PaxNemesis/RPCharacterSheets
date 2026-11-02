type Data = Record<string, unknown>
type SavedClass = { level?: unknown; skills?: { level?: unknown }[] } & Data

/**
 * Upgrades characters saved by older versions of the sheet.
 * Version 2 works out class level from Skill Levels instead of storing it. A class whose stored
 * level was higher than its Skill Levels gets an unnamed Skill row for the difference.
 */
export function migrate(data: unknown, fromVersion: number): unknown {
  if (fromVersion >= 2 || data === null || typeof data !== 'object') return data
  const character = data as Data
  if (!Array.isArray(character.classes)) return data

  const classes = (character.classes as SavedClass[]).map(({ level, ...entry }) => {
    const skills = Array.isArray(entry.skills) ? entry.skills : []
    const skillLevels = skills.reduce((total, skill) => total + (typeof skill.level === 'number' ? skill.level : 0), 0)
    const missing = (typeof level === 'number' ? level : 0) - skillLevels
    return missing > 0 ? { ...entry, skills: [...skills, { name: '', level: missing, notes: '' }] } : { ...entry, skills }
  })
  return { ...character, classes }
}
