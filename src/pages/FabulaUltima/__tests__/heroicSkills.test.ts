import { describe, expect, it } from 'vitest'
import type { FuHeroicSkill } from '../types'
import { heroicIssues, nextSource, OTHER_SOURCE } from '../utils/heroicSkills'
import { character, classWith } from './character'

const mastered = (name: string) => classWith(name, ['Skill', 10])
const heroic = (name: string, source: string): FuHeroicSkill => ({ name, source, notes: '' })

describe('nextSource', () => {
  it('is the first mastered class without a Heroic Skill', () => {
    const classes = [classWith('Guardian', ['Fortress', 4]), mastered('Darkblade'), mastered('Elementalist')]
    expect(nextSource(character({ classes }))).toBe('Darkblade')
    expect(nextSource(character({ classes, heroicSkills: [heroic('Comet', 'darkblade ')] }))).toBe('Elementalist')
  })

  it('is empty when every mastered class has one', () => {
    expect(nextSource(character({ classes: [mastered('Darkblade')], heroicSkills: [heroic('Comet', 'Darkblade')] }))).toBe('')
  })
})

describe('heroicIssues', () => {
  it('is happy with one Heroic Skill per mastered class (p. 228)', () => {
    expect(heroicIssues(character({ classes: [mastered('Darkblade')], heroicSkills: [heroic('Comet', 'Darkblade')] }))).toEqual([])
  })

  it('flags a mastered class without a Heroic Skill, and one with two', () => {
    expect(heroicIssues(character({ classes: [mastered('Darkblade')] }))).toEqual(['Darkblade is mastered but has no Heroic Skill yet.'])
    const twice = character({ classes: [mastered('Darkblade')], heroicSkills: [heroic('Comet', 'Darkblade'), heroic('Adversity', 'Darkblade')] })
    expect(heroicIssues(twice)).toEqual(['Darkblade has 2 Heroic Skills; mastering a class gives one.'])
  })

  it('flags Heroic Skills linked to a class that is missing or not mastered', () => {
    const classes = [classWith('Guardian', ['Fortress', 4])]
    expect(heroicIssues(character({ classes, heroicSkills: [heroic('Comet', 'Guardian')] }))).toEqual([
      "Comet is linked to Guardian, which isn't mastered yet (level 4 of 10).",
    ])
    expect(heroicIssues(character({ heroicSkills: [heroic('Comet', 'Weaponmaster')] }))).toEqual([
      "Comet is linked to Weaponmaster, which isn't one of your classes.",
    ])
  })

  it('asks where a named Heroic Skill came from, but accepts other sources', () => {
    expect(heroicIssues(character({ heroicSkills: [heroic('Comet', '')] }))).toEqual(['Choose where Comet came from.'])
    expect(heroicIssues(character({ heroicSkills: [heroic('', '')] }))).toEqual([])
    expect(heroicIssues(character({ heroicSkills: [heroic('Comet', OTHER_SOURCE)] }))).toEqual([])
  })
})
