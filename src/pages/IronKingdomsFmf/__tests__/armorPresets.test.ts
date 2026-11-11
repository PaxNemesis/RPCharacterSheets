import { describe, expect, it } from 'vitest';
import { ARMOR } from '../constants/armor';
import { armorPresets } from '../utils/armorPresets';
import { character } from './character';

const settings = (books = { kng: true, ua: true }) => character({ settings: { books } }).settings;
const blank = { name: '', spd: null, def: null, arm: null, notes: '' };

describe('armor data', () => {
  it('has the armor of the core rules and Kings, Nations, and Gods, each once', () => {
    expect(ARMOR.filter((armor) => armor.book === 'core')).toHaveLength(12);
    expect(new Set(ARMOR.map((armor) => armor.name)).size).toBe(ARMOR.length);
  });
});

describe('armorPresets', () => {
  it('fills in a picked armor’s modifiers and page (p. 252)', () => {
    expect(armorPresets(settings()).pick('full plate', blank)).toEqual({
      name: 'Full Plate',
      spd: -1,
      def: -3,
      arm: 8,
      notes: 'p. 252',
    });
  });

  it('keeps notes already written, and marks a supplement’s page', () => {
    expect(armorPresets(settings()).pick('Exemplar Plate', { ...blank, notes: 'Blessed' }).notes).toBe('Blessed');
    expect(armorPresets(settings()).pick('Exemplar Plate', blank).notes).toBe('KNG 364');
  });

  it('offers only armor from the books in use, and leaves other names alone', () => {
    expect(armorPresets(settings({ kng: false, ua: true })).names).not.toContain('Exemplar Plate');
    expect(armorPresets(settings()).pick('Homemade Plate', { ...blank, name: 'Homemade Plate' })).toEqual({
      ...blank,
      name: 'Homemade Plate',
    });
  });
});
