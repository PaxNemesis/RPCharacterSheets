import { describe, expect, it } from 'vitest';
import { CAREERS } from '../constants/careers';
import { CAREER_OPTIONS } from '../constants/careerOptions';
import { findSpell, SPELLS, spellFields, spellNames } from '../constants/spells';
import { character } from './character';

const settings = (books = { kng: true, ua: true }) => character({ settings: { books } }).settings;

describe('spell data', () => {
  it('has the spells of all three books, each once per book', () => {
    expect(SPELLS.filter((spell) => spell.book === 'core')).toHaveLength(160);
    const keys = SPELLS.map((spell) => `${spell.book}:${spell.name}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('knows every starting spell of the careers and career options', () => {
    const starting = [
      ...CAREERS.flatMap((career) => [...career.spells, ...(career.variants ?? []).flatMap((v) => v.spells ?? [])]),
      ...CAREER_OPTIONS.flatMap((option) => option.spells ?? []),
    ];
    expect(starting.filter((name) => !findSpell(name, settings()))).toEqual([]);
  });
});

describe('findSpell', () => {
  it('finds a spell whatever the case, only in books that are on', () => {
    expect(findSpell('arcane bolt', settings())?.page).toBe(236);
    expect(findSpell('Bone Shaker', settings())?.book).toBe('ua');
    expect(findSpell('Bone Shaker', settings({ kng: true, ua: false }))).toBeUndefined();
    expect(spellNames(settings({ kng: false, ua: false }))).not.toContain('Bone Shaker');
  });

  it('uses the other supplement for a spell printed in both', () => {
    expect(findSpell('Cloak of Fear', settings())?.book).toBe('kng');
    expect(findSpell('Cloak of Fear', settings({ kng: false, ua: true }))?.book).toBe('ua');
  });
});

describe('spellFields', () => {
  it('turns the printed numbers into sheet fields (p. 236)', () => {
    expect(spellFields(findSpell('Arcane Bolt', settings())!)).toEqual({
      name: 'Arcane Bolt',
      cost: 2,
      rng: '12',
      aoe: '—',
      pow: 11,
      up: 'No',
      off: 'Yes',
      page: '236',
    });
  });

  it('keeps 1 of a “1+” cost and marks a supplement’s page', () => {
    expect(spellFields(findSpell('Locomotion', settings())!).cost).toBe(1);
    expect(spellFields(findSpell('Bone Shaker', settings())!).page).toBe('UA 69');
  });
});
