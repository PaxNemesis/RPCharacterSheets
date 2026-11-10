import { describe, expect, it } from 'vitest'
import { racialDefense, skillMaximum, startingStats, statMaximum } from '../utils/rules'
import { character } from './character'

const human = (identity = {}, settings = {}) => character({ identity: { race: 'Human', ...identity }, settings })

describe('statMaximum', () => {
  it('comes from the race and experience level with race rules on (p. 108)', () => {
    expect(statMaximum(human(), 'phy')).toBe(7)
    expect(statMaximum(human({ level: 'Veteran' }), 'phy')).toBe(8)
    expect(statMaximum(human({ level: 'Epic' }), 'str')).toBe(8)
  })

  it('treats an unknown level as Hero', () => {
    expect(statMaximum(human({ level: 'Legend' }), 'phy')).toBe(7)
  })

  it('only gives ARC a maximum for Gifted characters', () => {
    expect(statMaximum(human(), 'arc')).toBeNull()
    expect(statMaximum(human({ archetype: 'Gifted' }), 'arc')).toBe(4)
  })

  it('has no maximum for a race without that stat, or an unknown race', () => {
    expect(statMaximum(character({ identity: { race: 'Ogrun', archetype: 'Gifted' } }), 'arc')).toBeNull()
    expect(statMaximum(character({ identity: { race: 'Homebrew' } }), 'phy')).toBeNull()
  })

  it('uses the typed maximum with race rules off', () => {
    const custom = human({}, { raceRules: false })
    custom.stats.phy = { value: 5, max: 9 }
    expect(statMaximum(custom, 'phy')).toBe(9)
  })

  it('adds a career variant’s stat bonus, such as a stone sorcerer’s +1 PHY (p. 146)', () => {
    const sorcerer = human({ careerList: ['Sorcerer', 'Soldier'], careerVariants: { Sorcerer: 'Stone' } })
    expect(statMaximum(sorcerer, 'phy')).toBe(8)
  })
})

describe('startingStats', () => {
  it('starts from the race’s stats (p. 107)', () => {
    expect(startingStats(character({ identity: { race: 'Dwarf' } }))).toMatchObject({ phy: 6, spd: 4, int: 4 })
    expect(startingStats(character({ identity: { race: '' } }))).toEqual({})
  })

  it('adds a human’s Exceptional Potential bonus (p. 108)', () => {
    expect(startingStats(human({ humanBonus: 'agl' })).agl).toBe(4)
  })

  it('gives a Gifted character the starting ARC of their tradition', () => {
    const gifted = { ...human({ archetype: 'Gifted' }), arcaneTradition: 'will weaver' }
    expect(startingStats(gifted).arc).toBe(3)
    expect(startingStats(human()).arc).toBeUndefined()
  })
})

describe('skillMaximum', () => {
  const soldier = (level = 'Hero') => human({ careerList: ['Soldier', 'Pistoleer'], level })

  it('takes the best maximum among the careers, capped by experience level (p. 171)', () => {
    expect(skillMaximum(soldier(), 'Rifle')).toBe(2)
    expect(skillMaximum(soldier('Veteran'), 'Pistol')).toBe(3)
    expect(skillMaximum(soldier('Epic'), 'Rifle')).toBe(4)
    expect(skillMaximum(soldier('Epic'), 'Pistol')).toBe(4)
  })

  it('uses a career’s General Skills maximum for general skills', () => {
    expect(skillMaximum(soldier('Epic'), 'Climbing')).toBe(4)
  })

  it('matches a specialty by its full name or by the base skill', () => {
    expect(skillMaximum(soldier('Epic'), 'Craft (gunsmithing)')).toBe(4)
    expect(skillMaximum(human({ careerList: ['Alchemist', ''], level: 'Epic' }), 'craft (alchemy)')).toBe(4)
  })

  it('is blank for a skill no career offers, or with career rules off', () => {
    expect(skillMaximum(soldier(), 'Alchemy')).toBeNull()
    expect(skillMaximum(human({ careerList: ['Soldier', ''] }, { careerRules: false }), 'Rifle')).toBeNull()
  })
})

describe('racialDefense', () => {
  it('is the race’s DEF bonus with race rules on', () => {
    expect(racialDefense(character({ identity: { race: 'Gobber' } }))).toBe(1)
    expect(racialDefense(character({ identity: { race: 'Gobber' }, settings: { raceRules: false } }))).toBeNull()
    expect(racialDefense(human())).toBeNull()
  })
})
