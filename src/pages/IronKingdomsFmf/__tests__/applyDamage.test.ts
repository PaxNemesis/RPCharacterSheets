import { describe, expect, it } from 'vitest'
import { applyDamage } from '../utils/applyDamage'

const SIZES = [4, 3, 3, 2, 2, 2]
const EMPTY = [0, 0, 0, 0, 0, 0]

describe('applyDamage', () => {
  it('marks damage in the branch that was hit', () => {
    expect(applyDamage(EMPTY, SIZES, 1, 2)).toEqual([0, 2, 0, 0, 0, 0])
  })

  it('continues clockwise once a branch is full', () => {
    expect(applyDamage(EMPTY, SIZES, 0, 6)).toEqual([4, 2, 0, 0, 0, 0])
  })

  it('wraps from the last branch to the first', () => {
    expect(applyDamage(EMPTY, SIZES, 5, 3)).toEqual([1, 0, 0, 0, 0, 2])
  })

  it('skips full branches and stops when the spiral is full', () => {
    expect(applyDamage([4, 0, 0, 0, 0, 0], SIZES, 0, 2)).toEqual([4, 2, 0, 0, 0, 0])
    expect(applyDamage(EMPTY, SIZES, 2, 100)).toEqual(SIZES)
  })

  it('caps marks left over from a larger branch, such as after PHY was lowered', () => {
    expect(applyDamage([6, 0, 0, 0, 0, 0], SIZES, 1, 0)).toEqual([4, 0, 0, 0, 0, 0])
  })

  it('does not change the marks passed in', () => {
    const marked = [...EMPTY]
    applyDamage(marked, SIZES, 0, 3)
    expect(marked).toEqual(EMPTY)
  })
})
