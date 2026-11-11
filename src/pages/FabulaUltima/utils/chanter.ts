import type { ClassConflictRules, FuCharacter, FuDerived } from '../types';
import { skillLevel } from './rules';

/** The Chanter's Skill Levels, by Skill. */
export function chanterSkills(character: FuCharacter) {
  const sl = (name: string) => skillLevel(character, 'Chanter', name);
  return {
    magichant: sl('Magichant'),
    resonance: sl('Resonance'),
    soundBarrier: sl('Sound Barrier'),
    vibrato: sl('Vibrato'),
  };
}

/** One key and one tone with the first level of Magichant, then a key or a tone per level (HF p. 137). */
export function learnedLimit(character: FuCharacter) {
  const { magichant } = chanterSkills(character);
  return magichant > 0 ? magichant + 1 : 0;
}

/**
 * The recovery of a Calm verse (10 + twice the current Willpower die) and the damage of a Frantic one
 * (twice the die), both +10 from level 20 and +20 from level 40 (HF p. 139). Other tones have no amount.
 */
export function toneAmount(tone: string, derived: FuDerived) {
  const twice = derived.current('wlp') * 2;
  const bonus = derived.level >= 40 ? 20 : derived.level >= 20 ? 10 : 0;
  if (tone === 'Calm') return 10 + twice + bonus;
  if (tone === 'Frantic') return twice + bonus;
  return undefined;
}

const withSung = (character: FuCharacter, sung: boolean): FuCharacter =>
  character.chanter.sung === sung ? character : { ...character, chanter: { ...character.chanter, sung } };

/** One verse per turn (HF p. 137): singing again is allowed from the start of your next turn. */
export const chanterConflict: ClassConflictRules = {
  className: 'Chanter',
  on: {
    startTurn: (character) => withSung(character, false),
    endScene: (character) => withSung(character, false),
  },
};
