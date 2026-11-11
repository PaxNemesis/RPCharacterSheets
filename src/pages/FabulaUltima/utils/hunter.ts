import { TRAPS } from '../constants/hunter';
import type { ClassConflictRules, FuCharacter } from '../types';
import { skillLevel } from './rules';

const hasHeroic = (character: FuCharacter, name: string) =>
  character.heroicSkills.some((skill) => skill.name.trim().toLowerCase() === name.toLowerCase());

/** The Hunter's Skill Levels, by Skill, and which of the Hunter's Heroic Skills the character has. */
export function hunterSkills(character: FuCharacter) {
  const sl = (name: string) => skillLevel(character, 'Hunter', name);
  return {
    lockOn: sl('Lock-On'),
    setTrap: sl('Set Trap'),
    track: sl('Track'),
    vitalStrike: sl('Vital Strike'),
    wildReflexes: sl('Wild Reflexes'),
    masterTrapper: hasHeroic(character, 'Master Trapper'),
    unerringFocus: hasHeroic(character, 'Unerring Focus'),
    relentlessPursuit: hasHeroic(character, 'Relentless Pursuit'),
    fatalPrecision: hasHeroic(character, 'Fatal Precision'),
    predatorsReflexes: hasHeroic(character, "Predator's Reflexes"),
  };
}

export const findTrap = (name: string) => TRAPS.find((trap) => trap.name === name);

/** Two traps learned per Set Trap Skill Level, of that level or lower (LF p. 89). */
export const trapLimit = (character: FuCharacter) => hunterSkills(character).setTrap * 2;

/** IP to set a trap: its Skill Level, 1 less from SL 2 up with Master Trapper (LF pp. 90, 92). */
export const trapIp = (sl: number, masterTrapper: boolean) => (masterTrapper && sl >= 2 ? sl - 1 : sl);

/**
 * One trap per conflict, set at its start (LF p. 90). A trap set before it, as an ambush, takes that
 * place, so only the end of the scene clears it.
 */
export const hunterConflict: ClassConflictRules = {
  className: 'Hunter',
  on: {
    endScene: (character) => ({ ...character, hunter: { ...character.hunter, trapSet: '' } }),
  },
};
