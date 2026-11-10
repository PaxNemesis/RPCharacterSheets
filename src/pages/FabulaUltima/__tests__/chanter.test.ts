import { describe, expect, it } from 'vitest';
import { calculate } from '../utils/calculate';
import { learnedLimit, toneAmount } from '../utils/chanter';
import { character, classWith } from './character';

const chanter = (wlp: string, ...skills: [string, number][]) =>
  character({ attributes: { dex: '8', ins: '8', mig: '8', wlp }, classes: [classWith('Chanter', ...skills)] });

describe('chanter', () => {
  it('learns a key and a tone with the first level of Magichant, then one more per level', () => {
    expect([0, 1, 4].map((level) => learnedLimit(chanter('8', ['Magichant', level])))).toEqual([0, 2, 5]);
  });

  it('works out Calm recovery and Frantic damage from the current Willpower die and level', () => {
    const at = (level: number, shaken = false) => {
      const sheet = chanter('10', ['Magichant', level]);
      return calculate({ ...sheet, statuses: { ...sheet.statuses, shaken } });
    };
    expect([at(5), at(20), at(40)].map((derived) => toneAmount('Calm', derived))).toEqual([30, 40, 50]);
    expect([at(5), at(20), at(40)].map((derived) => toneAmount('Frantic', derived))).toEqual([20, 30, 40]);
    expect(toneAmount('Frantic', at(5, true))).toBe(16);
    expect(toneAmount('Haunting', at(5))).toBeUndefined();
  });

  it("grants Ritualism with Siren's Song", () => {
    expect(calculate(chanter('8', ["Siren's Song", 1])).disciplines).toContain('ritualism');
  });
});
