import type { FuCharacter, FuClass } from '../types'
import { createCharacter, createClass } from '../utils/createCharacter'

/** A fresh character with some fields replaced, for tests. */
export const character = (overrides: Partial<FuCharacter> = {}): FuCharacter => ({ ...createCharacter(), ...overrides })

/** A class with Skills given as [name, Skill Level] pairs. */
export const classWith = (name: string, ...skills: [string, number][]): FuClass => ({
  ...createClass(),
  name,
  skills: skills.map(([skill, level]) => ({ name: skill, level, notes: '' })),
})
