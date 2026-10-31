import type { Num } from '../types'

/** Adds the numbers that are filled in; returns null when none are, so empty totals stay blank. */
export const sum = (...values: (Num | undefined)[]): Num => {
  const present = values.filter((value): value is number => typeof value === 'number')
  return present.length > 0 ? present.reduce((total, value) => total + value, 0) : null
}
