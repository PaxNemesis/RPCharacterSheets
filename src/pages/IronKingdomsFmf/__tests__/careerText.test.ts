import { describe, expect, it } from 'vitest';
import { choose, grant, skillMaxima } from '../utils/careerText';

describe('careerText', () => {
  it('reads a skill and its level', () => {
    expect(grant(' Craft (gunsmithing) 1 ')).toEqual({ name: 'Craft (gunsmithing)', level: 1 });
  });

  it('throws on a grant without a level, so a typo in the data tables fails the tests', () => {
    expect(() => grant('Pistol')).toThrow('Bad skill grant: Pistol');
  });

  it('builds a choice between skills', () => {
    expect(choose(1, 'Pistol 1', 'Rifle 1')).toEqual({
      choose: 1,
      options: [
        { name: 'Pistol', level: 1 },
        { name: 'Rifle', level: 1 },
      ],
    });
  });

  it('reads maxima from several comma-separated lists', () => {
    expect(skillMaxima('Hand Weapon 2, Pistol 4', 'General Skills 4,')).toEqual({
      'Hand Weapon': 2,
      Pistol: 4,
      'General Skills': 4,
    });
  });
});
