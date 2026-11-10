import { describe, expect, it } from 'vitest'
import { alphabetical } from '../alphabetical'
import { sum } from '../sum'

describe('sum', () => {
  it('adds the numbers that are filled in', () => {
    expect(sum(1, null, 2, undefined, -4)).toBe(-1)
    expect(sum(0, null)).toBe(0)
  })

  it('is null when nothing is filled in, so empty totals stay blank', () => {
    expect(sum()).toBeNull()
    expect(sum(null, undefined)).toBeNull()
  })
})

describe('alphabetical', () => {
  it('sorts A–Z ignoring case and punctuation, without changing the list passed in', () => {
    const names = ['sneak', '’Jack Marshal', 'Ambush', 'Fast Draw']
    expect(alphabetical(names)).toEqual(['Ambush', 'Fast Draw', '’Jack Marshal', 'sneak'])
    expect(names[0]).toBe('sneak')
  })
})
