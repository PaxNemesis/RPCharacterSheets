import { describe, expect, it } from 'vitest';
import type { IkMechanika } from '../types';
import { capacitorValues, mechanikaProblems, pickRune, runeNames, runePoints } from '../utils/mechanika';

const device = (overrides: Partial<IkMechanika>): IkMechanika => ({
  name: '',
  type: 'armor',
  housing: '',
  capacitor: '',
  power: null,
  lifespan: '',
  runes: [],
  notes: '',
  ...overrides,
});

const rune = (name: string, points: number) => ({ name, points, page: '', notes: '' });

describe('mechanika', () => {
  it('lists only runes for the device type', () => {
    expect(runeNames('armor')).toContain('Aegis');
    expect(runeNames('armor')).not.toContain('Blast');
  });

  it('fills a rune from the book and keeps notes the user wrote', () => {
    expect(pickRune('Blast', { notes: '' })).toMatchObject({ points: 2, page: '285', notes: 'Firearms only' });
    expect(pickRune('Blast', { notes: 'Mine' })).toMatchObject({ notes: 'Mine' });
    expect(pickRune('Homebrew', { notes: '' })).toEqual({ notes: '' });
  });

  it('finds capacitors with a price after the name', () => {
    expect(capacitorValues('Storm chamber (200gc)')).toEqual({
      capacitor: 'Storm Chamber',
      power: 5,
      lifespan: '1 year',
    });
  });

  it('reports too many points, too little power and runes of the wrong type', () => {
    const runes = [rune('Fleet', 3), rune('Spell Ward', 3)];
    expect(runePoints(runes)).toBe(6);
    expect(mechanikaProblems(device({ power: 4, runes }))).toEqual([
      expect.stringMatching(/^The runes need 6 rune points; a runeplate holds at most 5/),
      expect.stringMatching(/^The runes need 6 power but the capacitor gives 4/),
    ]);
    expect(mechanikaProblems(device({ runes: [rune('Blast', 2)] }))).toEqual([
      expect.stringMatching(/^Not armor runes: Blast\./),
    ]);
    expect(mechanikaProblems(device({ power: 3, runes: [rune('Aegis', 1)] }))).toEqual([]);
  });
});
