import type { Taste } from '../types'

/** Ingredient tastes, in d6 order; a 6 lets the player choose (NF p. 150). */
export const TASTES: { key: Taste; label: string }[] = [
  { key: 'bitter', label: 'Bitter' },
  { key: 'salty', label: 'Salty' },
  { key: 'sour', label: 'Sour' },
  { key: 'sweet', label: 'Sweet' },
  { key: 'umami', label: 'Umami' },
]

/** The 15 taste pairs of the cookbook, a taste paired with itself included, e.g. "bitter+salty". */
export const TASTE_PAIRS: { key: string; label: string }[] = TASTES.flatMap((first, index) =>
  TASTES.slice(index).map((second) => ({ key: `${first.key}+${second.key}`, label: `${first.label} + ${second.label}` })),
)

const STATUSES = ['dazed', 'enraged', 'poisoned', 'shaken', 'slow', 'weak']
const HINDERING = ['dazed', 'shaken', 'slow', 'weak']
const TYPES = ['air', 'bolt', 'earth', 'fire', 'ice', 'poison']
const ATTRIBUTES = ['Dexterity', 'Insight', 'Might', 'Willpower']

/**
 * The d12 delicacy effects, by roll (NF p. 152), as short labels in our own words, with the
 * choice each one asks for.
 */
export const DELICACY_EFFECTS: { roll: number; label: string; choices?: string[] }[] = [
  { roll: 1, label: 'Recover from a status effect', choices: STATUSES },
  { roll: 2, label: 'Suffer a status effect', choices: HINDERING },
  { roll: 3, label: 'Recover HP' },
  { roll: 4, label: 'Recover MP' },
  { roll: 5, label: 'Take damage', choices: TYPES },
  { roll: 6, label: 'Extra damage from a type', choices: TYPES },
  { roll: 7, label: "Can't Guard next turn" },
  { roll: 8, label: "Can't cast spells next turn" },
  { roll: 9, label: "Can't use Skills next turn" },
  { roll: 10, label: 'Resistance to a type', choices: TYPES },
  { roll: 11, label: 'Attribute one die size higher', choices: ATTRIBUTES },
  { roll: 12, label: 'Damage dealt becomes a type', choices: TYPES },
]
