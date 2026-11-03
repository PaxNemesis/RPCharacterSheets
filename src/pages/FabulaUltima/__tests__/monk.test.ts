import { describe, expect, it } from 'vitest'
import { calculate } from '../utils/calculate'
import { activeClarity, soulBeadLimit, soulRenewal } from '../utils/monk'
import { character, classWith } from './character'

const limitWith = (wlp: string, shaken = false) => {
  const sheet = character({ attributes: { dex: '8', ins: '8', mig: '8', wlp } })
  return soulBeadLimit(calculate({ ...sheet, statuses: { ...sheet.statuses, shaken } }))
}

describe('monk', () => {
  it('limits Soul Beads to half the current Willpower die, from 3 to 6', () => {
    expect([limitWith('6'), limitWith('8'), limitWith('10'), limitWith('12')]).toEqual([3, 4, 5, 6])
    expect(limitWith('10', true)).toBe(4)
  })

  it('restores 10 HP or MP per bead with Soul Renewal, 12 from level 20 and 15 from level 40', () => {
    expect([soulRenewal(19), soulRenewal(20), soulRenewal(39), soulRenewal(40)]).toEqual([10, 12, 12, 15])
  })

  it('powers one Clarity benefit per pair of Resolve Beads, up to the Clarity Skill Level', () => {
    const monk = (clarity: number, resolve: number) =>
      activeClarity(character({ classes: [classWith('Monk', ['Clarity', clarity])], monk: { core: 0, resolve, clarity: [] } }))
    expect([monk(2, 3), monk(2, 4), monk(2, 6), monk(1, 6), monk(0, 6)]).toEqual([1, 2, 2, 1, 0])
  })
})
