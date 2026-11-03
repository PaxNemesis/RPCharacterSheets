import { describe, expect, it } from 'vitest'
import { migrate } from '../utils/migrate'

describe('migrate', () => {
  it('splits an old mechanika device into housing, capacitor and runes', () => {
    const old = { mechanika: [{ name: 'Armor', runePlate: 'Aegis, Homebrew', capacitor: 'Storm Chamber', charges: 2, notes: 'Shiny' }] }
    const [device] = (migrate(old, 1) as { mechanika: Record<string, unknown>[] }).mechanika
    expect(device).toMatchObject({ housing: 'Armor', capacitor: 'Storm Chamber', power: 5, notes: 'Charges: 2\n\nShiny' })
    expect(device.runes).toEqual([
      { name: 'Aegis', points: 1, page: '284', notes: '' },
      { name: 'Homebrew', points: null, page: '', notes: '' },
    ])
  })

  it('keeps careers that are not in the book as text with career rules off', () => {
    const migrated = migrate({ identity: { careers: 'Soldier and Dreamer' } }, 1) as Record<string, Record<string, unknown>>
    expect(migrated.settings.careerRules).toBe(false)
    expect(migrated.identity.careerList).toEqual(['', ''])
  })

  it('leaves current data and non-objects alone', () => {
    const current = { mechanika: [] }
    expect(migrate(current, 3)).toBe(current)
    expect(migrate(null, 1)).toBeNull()
  })
})
