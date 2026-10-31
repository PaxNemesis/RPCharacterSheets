import { findCareer } from '../constants/careers'
import { findRace } from '../constants/races'

type Data = Record<string, Record<string, unknown> | undefined>

/**
 * Upgrades characters saved by older versions of the sheet.
 * Version 2 added rulebook races and careers: characters whose race or careers don't match the
 * book keep their own text, with that rule setting turned off.
 */
export function migrate(data: unknown, fromVersion: number): unknown {
  if (fromVersion >= 2 || data === null || typeof data !== 'object') return data
  const character = data as Data
  const identity = character.identity ?? {}
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
      ...character.settings,
      raceRules: race.trim() === '' || findRace(race) !== undefined,
      careerRules: careersMatch,
    },
  }
}
