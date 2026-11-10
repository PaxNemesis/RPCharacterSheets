import { describe, expect, it } from 'vitest'
import { character } from '../../../../../__tests__/character'
import { CAREER_OPTIONS } from '../../../../../constants/careerOptions'
import { describeOption } from '../utils/describeOption'
import { applyStartingPackage, startingPackage } from '../utils/startingPackage'

const soldierPistoleer = (race = 'Human') =>
  character({ identity: { race, careerList: ['Soldier', 'Pistoleer'] }, skills: [] })

describe('startingPackage', () => {
  it('adds both starting careers’ skills, gold and assets (pp. 117–119)', () => {
    const pack = startingPackage(soldierPistoleer(), {})
    expect(pack.careers.map((career) => career.name)).toEqual(['Soldier', 'Pistoleer'])
    expect(pack.gold).toBe(150)
    expect(pack.assets).toContainEqual({ name: 'Ammo bandolier', career: 'Pistoleer' })
    expect(pack.abilities).toEqual(expect.arrayContaining(['Find Cover', 'Sentry', 'Fast Draw', 'Gunfighter']))
  })

  it('starts a skill both careers give at level 2 (p. 117)', () => {
    const { skills } = startingPackage(soldierPistoleer(), {})
    expect(skills.find((skill) => skill.name === 'Detection')?.level).toBe(2)
    expect(skills.find((skill) => skill.name === 'Driving')?.level).toBe(1)
  })

  it('includes only the picked options of a “choose” skill', () => {
    const { skills } = startingPackage(soldierPistoleer(), { 'Soldier:0': ['Rifle', 'Pistol'] })
    expect(skills.find((skill) => skill.name === 'Rifle')?.level).toBe(1)
    expect(skills.find((skill) => skill.name === 'Pistol')?.level).toBe(2)
    expect(skills.some((skill) => skill.name === 'Crossbow')).toBe(false)
  })

  it('adds the race’s abilities, connections and archetype benefits', () => {
    const dwarf = startingPackage(soldierPistoleer('Dwarf'), {})
    expect(dwarf.abilities[0]).toBe('Load Bearing')
    expect(dwarf.connections).toEqual(['Connections (dwarven clan)'])
    expect(startingPackage(soldierPistoleer('Trollkin'), {}).archetypeBenefits).toEqual(['Tough', 'Feat: Revitalize'])
  })

  it('adds a career variant’s spells', () => {
    const sorcerer = character({ identity: { careerList: ['Sorcerer', 'Soldier'], careerVariants: { Sorcerer: 'Ice' } } })
    expect(startingPackage(sorcerer, {}).spells).toEqual(['Blizzard', 'Chiller', 'Ice Bolt'])
  })
})

describe('applyStartingPackage', () => {
  it('raises skills already on the sheet to the starting level, never lowering them', () => {
    const withDetection = (level: number) => ({ ...soldierPistoleer(), skills: [{ name: 'detection', stat: 'per' as const, level, page: '' }] })
    const detection = (level: number) => {
      const before = withDetection(level)
      const { character: after } = applyStartingPackage(before, startingPackage(before, {}))
      return after.skills.filter((skill) => skill.name.toLowerCase() === 'detection')
    }
    // Both careers give Detection, so it starts at 2.
    expect(detection(1)).toEqual([{ name: 'detection', stat: 'per', level: 2, page: '' }])
    expect(detection(3)).toEqual([{ name: 'detection', stat: 'per', level: 3, page: '' }])
  })

  it('adds starting skills that aren’t on the sheet yet', () => {
    const before = soldierPistoleer()
    const { character: after } = applyStartingPackage(before, startingPackage(before, {}))
    expect(after.skills.find((skill) => skill.name === 'Detection')?.level).toBe(2)
    expect(after.skills.find((skill) => skill.name === 'Driving')?.level).toBe(1)
  })

  it('can be applied twice without adding anything again', () => {
    const before = soldierPistoleer()
    const once = applyStartingPackage(before, startingPackage(before, {})).character
    const twice = applyStartingPackage(once, startingPackage(once, {})).character
    expect(twice.abilities).toHaveLength(once.abilities.length)
    expect(twice.gear).toHaveLength(once.gear.length)
    expect(twice.skills).toEqual(once.skills)
  })

  it('fills in starting gold only when gold is blank, and says so otherwise', () => {
    const before = soldierPistoleer()
    expect(applyStartingPackage(before, startingPackage(before, {})).character.gold).toBe(150)
    const rich = { ...before, gold: 10 }
    const result = applyStartingPackage(rich, startingPackage(rich, {}))
    expect(result.character.gold).toBe(10)
    expect(result.notes).toEqual(['Gold was already filled in, so the starting 150 gc was not added.'])
  })

  it('picks the arcane tradition for a Gifted character', () => {
    const tradition = (careerList: string[], arcaneTradition = '') => {
      const gifted = { ...character({ identity: { archetype: 'Gifted', careerList } }), arcaneTradition }
      return applyStartingPackage(gifted, startingPackage(gifted, {})).character.arcaneTradition
    }
    expect(tradition(['Warcaster', 'Soldier'])).toBe('Focuser')
    expect(tradition(['Gun Mage', 'Soldier'])).toBe('Will Weaver')
    expect(tradition(['Gun Mage', 'Soldier'], 'Focuser')).toBe('Focuser')
  })
})

describe('describeOption', () => {
  const option = (name: string) => CAREER_OPTIONS.find((candidate) => candidate.name === name)!

  it('sums up what an option adds and removes', () => {
    const text = describeOption(option('Stormguard'))
    expect(text).toContain('Adds Set Defense, Specialization (Voltaic Halberd), Voltaic halberd.')
    expect(text).toContain('Removes Blaster, Defensive Line, Specialization, Storm glaive.')
  })

  it('mentions spells, the other starting career and the book’s note', () => {
    const text = describeOption(option('Cygnaran Warcaster'))
    expect(text).toContain('Starting spells: Arcane Bolt, Blur.')
    expect(text).toMatch(/Other starting career: Arcane Mechanik, Arcanist, /)
    expect(text).toMatch(/Uses its own spell list\.$/)
  })
})
