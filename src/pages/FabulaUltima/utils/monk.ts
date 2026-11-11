import type { ClassConflictRules, FuCharacter, FuDerived } from '../types';
import { skillLevel } from './rules';

/** Half the current Willpower die, from 3 to 6 (LF p. 101). */
export const soulBeadLimit = (derived: FuDerived) => Math.min(6, Math.max(3, Math.floor(derived.current('wlp') / 2)));

/** HP or MP each Bead restores with Soul Renewal: 10, then 12 from level 20 and 15 from level 40 (LF p. 102). */
export const soulRenewal = (level: number) => (level >= 40 ? 15 : level >= 20 ? 12 : 10);

/** The Monk's Skill Levels, by Skill. */
export function monkSkills(character: FuCharacter) {
  const sl = (name: string) => skillLevel(character, 'Monk', name);
  return {
    clarity: sl('Clarity'),
    resonantClarity: sl('Resonant Clarity'),
    soulRenewal: sl('Soul Renewal'),
    spiritShot: sl('Spirit Shot'),
    spiritualFortress: sl('Spiritual Fortress'),
  };
}

/** How many Clarity benefits are active: one per pair of Resolve Beads, at most Clarity's SL. */
export const activeClarity = (character: FuCharacter) =>
  Math.min(monkSkills(character).clarity, Math.floor(character.monk.resolve / 2));

/**
 * Soul Beads only exist during a conflict, starting with a full set of Core Beads (LF p. 101). The book
 * gives 2 Resolve Beads per turn once Core Beads are released without saying when, so the sheet turns
 * one Core Bead into 2 Resolve Beads at the start of each of your turns, unless Resolve Beads are full.
 */
export const monkConflict: ClassConflictRules = {
  className: 'Monk',
  on: {
    startConflict: (character, derived) => ({
      ...character,
      monk: { ...character.monk, core: soulBeadLimit(derived), resolve: 0 },
    }),
    startTurn: (character, derived) => {
      const { core, resolve } = character.monk;
      const limit = soulBeadLimit(derived);
      if (core < 1 || resolve >= limit) return character;
      return { ...character, monk: { ...character.monk, core: core - 1, resolve: Math.min(limit, resolve + 2) } };
    },
    endScene: (character) => ({ ...character, monk: { ...character.monk, core: 0, resolve: 0 } }),
  },
};
