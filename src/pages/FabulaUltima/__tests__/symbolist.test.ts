import { describe, expect, it } from 'vitest';
import { calculate } from '../utils/calculate';
import { forbiddanceLoss, symbolLimits } from '../utils/symbolist';
import { character, classWith } from './character';

describe('symbolist', () => {
  it('learns two symbols per level of Symbolism, with up to SL + 1 active', () => {
    const limits = (level: number) =>
      symbolLimits(character({ classes: [classWith('Symbolist', ['Symbolism', level])] }));
    expect(limits(0)).toEqual({ learned: 0, active: 0 });
    expect(limits(1)).toEqual({ learned: 2, active: 2 });
    expect(limits(5)).toEqual({ learned: 10, active: 6 });
  });

  it('makes Forbiddance cost 5 HP and MP, 10 from level 20 and 20 from level 40', () => {
    expect([19, 20, 39, 40].map(forbiddanceLoss)).toEqual([5, 10, 10, 20]);
  });

  it('grants Ritualism with Mirage', () => {
    const sheet = character({ classes: [classWith('Symbolist', ['Mirage', 1])] });
    expect(calculate(sheet).disciplines).toContain('ritualism');
  });
});
