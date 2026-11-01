import type { RaceData } from '../types'

// Stat profiles from the core rules, pp. 108–114. Limits are [Hero, Veteran, Epic].
export const RACES: RaceData[] = [
  {
    name: 'Human',
    archetypes: ['Gifted', 'Intellectual', 'Mighty', 'Skilled'],
    start: { phy: 5, spd: 6, str: 4, agl: 3, prw: 4, poi: 4, int: 3, per: 3 },
    limits: {
      phy: [7, 8, 8], spd: [7, 7, 7], str: [6, 7, 8], agl: [5, 6, 7], prw: [5, 6, 7],
      poi: [5, 6, 7], int: [5, 6, 7], arc: [4, 6, 8], per: [5, 6, 7],
    },
    notes: ['Exceptional Potential: +1 PHY, AGL or INT to start (not to the maximum). p. 108'],
  },
  {
    name: 'Dwarf',
    archetypes: ['Gifted', 'Intellectual', 'Mighty', 'Skilled'],
    start: { phy: 6, spd: 4, str: 5, agl: 3, prw: 4, poi: 3, int: 4, per: 3 },
    limits: {
      phy: [7, 7, 8], spd: [5, 6, 6], str: [6, 7, 8], agl: [5, 6, 7], prw: [5, 6, 7],
      poi: [4, 5, 6], int: [5, 6, 7], arc: [4, 6, 7], per: [4, 6, 7],
    },
    abilities: ['Load Bearing'],
    connections: ['Connections (dwarven clan)'],
    notes: ['Starts with Load Bearing and Connections (dwarven clan). p. 109'],
  },
  {
    name: 'Gobber',
    archetypes: ['Intellectual', 'Mighty', 'Skilled'],
    start: { phy: 4, spd: 6, str: 3, agl: 4, prw: 4, poi: 3, int: 3, per: 3 },
    limits: {
      phy: [6, 7, 7], spd: [7, 7, 7], str: [4, 5, 6], agl: [5, 6, 7], prw: [5, 6, 7],
      poi: [5, 6, 7], int: [4, 5, 6], per: [4, 4, 5],
    },
    defense: 1,
    archetypeBenefits: ['Deft'],
    notes: ['Starts with the Deft archetype benefit. +1 DEF. Cannot use great weapons or rifles. p. 110'],
  },
  {
    name: 'Iosan',
    archetypes: ['Gifted', 'Intellectual', 'Mighty', 'Skilled'],
    start: { phy: 5, spd: 6, str: 4, agl: 3, prw: 4, poi: 4, int: 4, per: 3 },
    limits: {
      phy: [7, 7, 7], spd: [7, 7, 7], str: [5, 6, 7], agl: [5, 6, 7], prw: [5, 6, 7],
      poi: [5, 6, 7], int: [6, 6, 7], arc: [4, 6, 8], per: [5, 6, 7],
    },
    notes: ['Starts with one extra ability from one of their careers. p. 111'],
  },
  {
    name: 'Nyss',
    archetypes: ['Gifted', 'Mighty', 'Skilled'],
    start: { phy: 5, spd: 6, str: 4, agl: 4, prw: 4, poi: 4, int: 3, per: 3 },
    limits: {
      phy: [7, 7, 8], spd: [7, 7, 7], str: [6, 7, 8], agl: [5, 6, 7], prw: [5, 6, 7],
      poi: [5, 6, 7], int: [5, 6, 6], arc: [4, 6, 7], per: [5, 6, 6],
    },
    notes: ['+1 on Initiative and PER rolls. +3 ARM against cold, –3 ARM against fire. p. 112'],
  },
  {
    name: 'Ogrun',
    archetypes: ['Mighty', 'Skilled'],
    start: { phy: 6, spd: 5, str: 6, agl: 3, prw: 4, poi: 3, int: 3, per: 2 },
    limits: {
      phy: [7, 8, 9], spd: [6, 6, 6], str: [8, 9, 10], agl: [5, 5, 6], prw: [5, 6, 7],
      poi: [4, 5, 6], int: [5, 5, 6], per: [4, 5, 6],
    },
    notes: ['Huge Stature: can wield a two-handed weapon in one hand at –2 to attack. p. 113'],
  },
  {
    name: 'Trollkin',
    archetypes: ['Gifted', 'Mighty', 'Skilled'],
    start: { phy: 6, spd: 5, str: 5, agl: 3, prw: 4, poi: 2, int: 3, per: 3 },
    limits: {
      phy: [8, 9, 10], spd: [6, 6, 6], str: [7, 8, 9], agl: [5, 6, 7], prw: [5, 6, 7],
      poi: [4, 5, 6], int: [4, 5, 6], arc: [4, 6, 7], per: [4, 5, 6],
    },
    archetypeBenefits: ['Tough', 'Feat: Revitalize'],
    notes: ['Starts with the Tough and Feat: Revitalize archetype benefits. p. 114'],
  },
]

export const ARCHETYPES = ['Gifted', 'Intellectual', 'Mighty', 'Skilled']

/** Starting ARC for each arcane tradition (p. 107). */
export const TRADITIONS = [
  { value: 'Focuser', arc: 2 },
  { value: 'Will Weaver', arc: 3 },
]

export const LEVEL_CAPS = { Hero: 2, Veteran: 3, Epic: 4 } as const
export const LEVEL_INDEX = { Hero: 0, Veteran: 1, Epic: 2 } as const

export const findRace = (name: string) =>
  RACES.find((race) => race.name.toLowerCase() === name.trim().toLowerCase())
