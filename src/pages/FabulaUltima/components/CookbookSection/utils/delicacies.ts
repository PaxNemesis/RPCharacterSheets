import { DELICACY_EFFECTS, TASTES } from '../../../constants/gourmet'
import type { FuGourmet, Taste } from '../../../types'
import { rollDie } from '@/utils/rollDie'

export type Combination = { effect: string; choice: string }

export const effectOf = (roll: string | undefined) => DELICACY_EFFECTS.find((effect) => String(effect.roll) === roll)

/** "bitter+salty": the cookbook key for two tastes, in the cookbook's taste order. */
export const pairKey = (a: Taste, b: Taste) => {
  const order = TASTES.map((taste) => taste.key)
  return order.indexOf(a) <= order.indexOf(b) ? `${a}+${b}` : `${b}+${a}`
}

/** Every different pair of tastes among the ingredients adds one effect (NF p. 151). */
export function delicacyPairs(tastes: Taste[]): string[] {
  const keys = tastes.flatMap((first, index) => tastes.slice(index + 1).map((second) => pairKey(first, second)))
  return [...new Set(keys)]
}

/** What makes two combinations "the same effect": the d12 result, plus the choice when it has one. */
const identity = ({ effect, choice }: Combination) => `${effect}:${effectOf(effect)?.choices ? choice : ''}`

/**
 * Rolls a d12 for an undiscovered pair. No two combinations may have identical effects: a result
 * without a choice that is already used, or one whose choices are all used, is rolled again (NF p. 151).
 * The player then picks the choice, from those still unused.
 */
export function rollCombination(gourmet: FuGourmet, key: string, roll = rollDie): Combination & { roll: number } {
  const others = Object.entries(gourmet.combinations)
    .filter(([other, combination]) => other !== key && combination?.effect)
    .map(([, combination]) => combination)
  const used = new Set(others.map(identity))
  const possible = DELICACY_EFFECTS.filter((effect) =>
    effect.choices
      ? effect.choices.some((choice) => !used.has(`${effect.roll}:${choice}`))
      : !used.has(`${effect.roll}:`),
  )
  let result = 0
  do result = roll(12)
  while (possible.length > 0 && !possible.some((effect) => effect.roll === result))
  return { roll: result, effect: String(result), choice: '' }
}

/** The choices for a combination's effect that no other combination uses yet. */
export function freeChoices(gourmet: FuGourmet, key: string): string[] {
  const combination = gourmet.combinations[key]
  const choices = effectOf(combination?.effect)?.choices ?? []
  const taken = Object.entries(gourmet.combinations)
    .filter(([other, entry]) => other !== key && entry?.effect === combination?.effect)
    .map(([, entry]) => entry.choice)
  return choices.filter((choice) => !taken.includes(choice))
}
