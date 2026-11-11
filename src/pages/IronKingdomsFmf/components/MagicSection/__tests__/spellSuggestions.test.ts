import { describe, expect, it } from 'vitest';
import { character } from '../../../__tests__/character';
import { CAREER_OPTIONS } from '../../../constants/careerOptions';
import { CAREERS } from '../../../constants/careers';
import { CAREER_SPELL_LISTS, OPTION_SPELL_LISTS } from '../../../constants/spellLists';
import { SPELLS } from '../../../constants/spells';
import { careerSpells, spellSuggestions } from '../utils/spellSuggestions';

const known = new Set(SPELLS.map((spell) => spell.name));

describe('spell lists', () => {
  it('name only spells the sheet has', () => {
    const listed = [
      ...Object.values(CAREER_SPELL_LISTS).flat(),
      ...Object.values(OPTION_SPELL_LISTS).flatMap((change) => [...(change.list ?? []), ...(change.extra ?? [])]),
    ];
    expect(listed.filter((name) => !known.has(name))).toEqual([]);
  });

  it('belong to careers, career versions and options that exist', () => {
    const versions = CAREERS.flatMap((career) => [
      career.name,
      ...(career.variants ?? []).map((v) => `${career.name}: ${v.label}`),
    ]);
    expect(Object.keys(CAREER_SPELL_LISTS).filter((key) => !versions.includes(key))).toEqual([]);
    const options = CAREER_OPTIONS.map((option) => option.name);
    expect(Object.keys(OPTION_SPELL_LISTS).filter((key) => !options.includes(key))).toEqual([]);
  });

  it('include every career’s starting spells', () => {
    const missing = CAREERS.flatMap((career) =>
      (career.variants ?? [{ label: '', spells: [] }]).flatMap((variant) => {
        const list = CAREER_SPELL_LISTS[variant.label ? `${career.name}: ${variant.label}` : career.name] ?? [];
        return [...career.spells, ...(variant.spells ?? [])].filter((name) => !list.includes(name));
      }),
    );
    expect(missing).toEqual([]);
  });
});

describe('careerSpells', () => {
  it('joins the careers’ lists', () => {
    const spells = careerSpells(character({ identity: { careerList: ['Arcanist', 'Gun Mage'] } }));
    expect(spells).toEqual(expect.arrayContaining(['Arcane Bolt', 'Rune Shot: Brutal']));
    expect(spells).not.toContain('Convection');
  });

  it('follows a priest’s faith, offering both until one is chosen', () => {
    const priest = (faith = '') =>
      careerSpells(character({ identity: { careerList: ['Priest', 'Soldier'], careerVariants: { Priest: faith } } }));
    expect(priest('Menite')).toContain('Flames of Wrath');
    expect(priest('Menite')).not.toContain('Heal');
    expect(priest()).toEqual(expect.arrayContaining(['Flames of Wrath', 'Heal']));
  });

  it('uses a chosen kingdom option’s list instead of the career’s, or adds to it', () => {
    const warcaster = (careerOptions: string[]) =>
      careerSpells(character({ identity: { careerList: ['Warcaster', 'Soldier'], careerOptions } }));
    expect(warcaster([])).toContain('Transference');
    expect(warcaster(['Cygnaran Warcaster'])).toContain('Blur');
    expect(warcaster(['Cygnaran Warcaster'])).not.toContain('Transference');
    const tempest = careerSpells(
      character({ identity: { careerList: ['Gun Mage', 'Soldier'], careerOptions: ['Arcane Tempest Gun Mage'] } }),
    );
    expect(tempest).toEqual(expect.arrayContaining(['Rune Shot: Brutal', 'Rune Shot: Disruption']));
  });

  it('is undefined without a spellcasting career', () => {
    expect(careerSpells(character({ identity: { careerList: ['Soldier', 'Pistoleer'] } }))).toBeUndefined();
  });
});

describe('spellSuggestions', () => {
  it('leaves out spells the character already knows, whatever the case', () => {
    const arcanist = character({
      identity: { careerList: ['Arcanist', 'Soldier'] },
      spells: [
        { name: 'arcane bolt', cost: null, rng: '', aoe: '', pow: null, up: '', off: '', page: '', description: '' },
      ],
    });
    expect(spellSuggestions(arcanist)).not.toContain('Arcane Bolt');
    expect(spellSuggestions(arcanist)).toContain('Arcane Strike');
  });

  it('offers every spell from the books in use when no career has a list', () => {
    const fighter = character({
      identity: { careerList: ['Soldier', 'Pistoleer'] },
      settings: { books: { kng: true, ua: false } },
    });
    expect(spellSuggestions(fighter)).toContain('Arcane Bolt');
    expect(spellSuggestions(fighter)).not.toContain('Bone Shaker');
  });
});
