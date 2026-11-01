import { findCareer } from '../constants/careers'
import { findRune } from '../constants/mechanika'
import { findRace } from '../constants/races'
import { capacitorValues } from './mechanika'

type Data = Record<string, unknown>
type Section = Record<string, unknown> | undefined

/** Upgrades characters saved by older versions of the sheet, one version at a time. */
export function migrate(data: unknown, fromVersion: number): unknown {
  if (data === null || typeof data !== 'object') return data
  let character = data as Data
  if (fromVersion < 2) character = toVersion2(character)
  if (fromVersion < 3) character = toVersion3(character)
  return character
}

/**
 * Version 2 added rulebook races and careers: characters whose race or careers don't match the
 * book keep their own text, with that rule setting turned off.
 */
function toVersion2(character: Data): Data {
  const identity = (character.identity as Section) ?? {}
  const race = typeof identity.race === 'string' ? identity.race : ''
  const careerText = typeof identity.careers === 'string' ? identity.careers : ''
  const careerNames = careerText.split(/,|\/|&| and /).map((name) => name.trim()).filter(Boolean)
  const careersMatch = careerNames.every((name) => findCareer(name))

  return {
    ...character,
    identity: {
      ...identity,
      careerList: careersMatch ? [...careerNames, '', ''].slice(0, Math.max(2, careerNames.length)) : ['', ''],
    },
    settings: {
      ...(character.settings as Section),
      raceRules: race.trim() === '' || findRace(race) !== undefined,
      careerRules: careersMatch,
    },
  }
}

type OldMechanika = { name?: string; runePlate?: string; capacitor?: string; charges?: number | null; notes?: string }
const text = (value: unknown) => (typeof value === 'string' ? value : '')

/**
 * Version 3 split a mechanika device into housing, capacitor and runes. The old housing, capacitor
 * and comma-separated rune plate carry over, with rulebook values filled in where the names match.
 */
function toVersion3(character: Data): Data {
  const devices = Array.isArray(character.mechanika) ? (character.mechanika as OldMechanika[]) : []
  const mechanika = devices.map((old) => {
    const runes = text(old.runePlate)
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => {
        const rune = findRune(name)
        return { name, points: rune?.points ?? null, page: rune ? String(rune.page) : '', notes: '' }
      })
    const charges = typeof old.charges === 'number' ? `Charges: ${old.charges}` : ''
    return {
      name: '',
      type: '',
      housing: text(old.name),
      capacitor: text(old.capacitor),
      power: null,
      lifespan: '',
      ...capacitorValues(text(old.capacitor)),
      runes,
      notes: [charges, text(old.notes)].filter(Boolean).join('\n\n'),
    }
  })
  return { ...character, mechanika }
}
