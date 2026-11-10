import { afterEach, describe, expect, it, vi } from 'vitest'
import { rollDie } from '../rollDie'

// Makes crypto.getRandomValues return these values in turn.
const draws = (...values: number[]) =>
  vi.spyOn(crypto, 'getRandomValues').mockImplementation((array) => {
    ;(array as Uint32Array)[0] = values.shift() ?? 0
    return array
  })

describe('rollDie', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('rolls every face of a d6 and nothing else', () => {
    const seen = new Set(Array.from({ length: 600 }, () => rollDie(6)))
    expect([...seen].sort()).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('maps random values onto the faces', () => {
    draws(0, 5, 6)
    expect([rollDie(6), rollDie(6), rollDie(6)]).toEqual([1, 6, 1])
  })

  it('draws again for values that would favour some faces', () => {
    // 2^32 leaves a remainder of 4 when divided by 6, so the top 4 values are drawn again.
    const spy = draws(2 ** 32 - 1, 2 ** 32 - 4, 2 ** 32 - 5)
    expect(rollDie(6)).toBe(((2 ** 32 - 5) % 6) + 1)
    expect(spy).toHaveBeenCalledTimes(3)
  })

  it('refuses dice that cannot exist', () => {
    expect(() => rollDie(0)).toThrow(RangeError)
    expect(() => rollDie(2.5)).toThrow(RangeError)
  })
})
