import { describe, expect, it } from 'vitest'
import type { FuGourmet } from '../../../types'
import { delicacyPairs, freeChoices, pairKey, rollCombination } from '../utils/delicacies'

// A die that rolls the given results in turn.
const rolls = (...results: number[]) => {
  let index = 0
  return () => results[index++]
}
const cookbook = (combinations: FuGourmet['combinations']): FuGourmet => ({ ingredients: [], combinations, notes: '' })

describe('delicacies', () => {
  it('keys a pair of tastes in the cookbook order', () => {
    expect(pairKey('umami', 'bitter')).toBe('bitter+umami')
    expect(pairKey('salty', 'salty')).toBe('salty+salty')
  })

  it('adds one effect per different pair of tastes among the ingredients', () => {
    expect(delicacyPairs(['bitter', 'bitter', 'salty'])).toEqual(['bitter+bitter', 'bitter+salty'])
    expect(delicacyPairs(['sweet', 'sweet'])).toEqual(['sweet+sweet'])
    expect(delicacyPairs(['bitter', 'salty', 'sour'])).toHaveLength(3)
  })

  it('rolls again for an effect another combination already has', () => {
    const gourmet = cookbook({ 'bitter+bitter': { effect: '3', choice: '' } })
    expect(rollCombination(gourmet, 'bitter+salty', rolls(3, 3, 4)).roll).toBe(4)
  })

  it('keeps an effect with choices while one of its choices is still free', () => {
    const gourmet = cookbook({ 'bitter+bitter': { effect: '1', choice: 'dazed' } })
    expect(rollCombination(gourmet, 'bitter+salty', rolls(1)).roll).toBe(1)
    const free = freeChoices(cookbook({ ...gourmet.combinations, 'bitter+salty': { effect: '1', choice: '' } }), 'bitter+salty')
    expect(free).not.toContain('dazed')
    expect(free).toContain('shaken')
  })
})
