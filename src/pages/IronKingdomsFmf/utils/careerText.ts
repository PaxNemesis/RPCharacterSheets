import type { SkillChoice, SkillGrant } from '../types';

/** "Craft (gunsmithing) 1" → { name: 'Craft (gunsmithing)', level: 1 } */
export const grant = (text: string): SkillGrant => {
  const match = /^(.*\S)\s+(\d)$/.exec(text.trim());
  if (!match) throw new Error(`Bad skill grant: ${text}`);
  return { name: match[1], level: Number(match[2]) };
};

/** A starting skill the player picks: `choose(1, 'Pistol 1', 'Rifle 1')`. */
export const choose = (count: number, ...options: string[]): SkillChoice => ({
  choose: count,
  options: options.map(grant),
});

/** "Hand Weapon 2, Craft (gunsmithing) 4" → { 'Hand Weapon': 2, 'Craft (gunsmithing)': 4 } */
export const skillMaxima = (...lists: string[]): Record<string, number> =>
  Object.fromEntries(
    lists
      .flatMap((list) => list.split(','))
      .filter((item) => item.trim())
      .map((item) => {
        const { name, level } = grant(item);
        return [name, level];
      }),
  );
