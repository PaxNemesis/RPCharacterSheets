import { CAPACITORS, findCapacitor, findRune, MAX_RUNE_POINTS, MECHANIKA_TYPES, RUNES } from '../constants/mechanika'
import type { IkMechanika, IkRune, MechanikaType } from '../types'
import { compareNames } from '@/utils/alphabetical'

type Row = Record<string, unknown>

const typeLabel = (type: MechanikaType) => MECHANIKA_TYPES.find((option) => option.value === type)?.label.toLowerCase() ?? type

export const capacitorNames = CAPACITORS.map((capacitor) => capacitor.name).sort(compareNames)

/** Rune names for the device's type, or every rune when no type is picked. */
export const runeNames = (type: IkMechanika['type']) =>
  RUNES.filter((rune) => !type || type === 'other' || rune.types.includes(type))
    .map((rune) => rune.name)
    .sort(compareNames)

/** Fills a rune row from the rulebook when its name is picked. */
export function pickRune(name: string, row: Row): Row {
  const rune = findRune(name)
  return rune ? { ...row, points: rune.points, page: String(rune.page), notes: (row.notes as string) || (rune.note ?? '') } : row
}

/** The capacitor's rulebook values, to fill in when its name is picked. */
export function capacitorValues(name: string): Partial<IkMechanika> | undefined {
  const capacitor = findCapacitor(name)
  return capacitor && { capacitor: capacitor.name, power: capacitor.power, lifespan: capacitor.lifespan }
}

export const runePoints = (runes: IkRune[] = []) => runes.reduce((total, rune) => total + (rune.points ?? 0), 0)

/** Rule problems with the device: too many rune points, too little power, or runes of the wrong type. */
export function mechanikaProblems(device: IkMechanika): string[] {
  const runes = device.runes ?? []
  const points = runePoints(runes)
  const problems: string[] = []
  if (points > MAX_RUNE_POINTS) problems.push(`The runes need ${points} rune points; a runeplate holds at most ${MAX_RUNE_POINTS} (p. 284).`)
  if (device.power !== null && device.power !== undefined && points > device.power) {
    problems.push(`The runes need ${points} power but the capacitor gives ${device.power}, so the device doesn’t work (p. 282).`)
  }
  const type = device.type
  if (type && type !== 'other') {
    const wrong = runes.filter((rune) => {
      const data = findRune(rune.name ?? '')
      return data && !data.types.includes(type)
    })
    if (wrong.length > 0) {
      problems.push(`Not ${typeLabel(type)} runes: ${wrong.map((rune) => rune.name).join(', ')}. All runes on a plate must be one type (p. 284).`)
    }
  }
  return problems
}
