import { describe, expect, it } from 'vitest';
import { ABILITIES } from '../constants/abilities';
import { CAREERS } from '../constants/careers';
import { COMPANIES } from '../constants/companies';
import { baseSkillName, knownSkillStat } from '../constants/skills';
import type { CompanyGrant } from '../types';
import { choiceOptions, companyGrants, companyIssues } from '../utils/company';
import { skillMaximum } from '../utils/rules';
import { character } from './character';

const member = (company: string, identity = {}) =>
  character({ identity: { company, careerList: ['Soldier', 'Pistoleer'], ...identity } });

const grantsOf = (company: (typeof COMPANIES)[number]): CompanyGrant[] => [
  company.member ?? {},
  company.split?.yes ?? {},
  company.split?.no ?? {},
  company.leader ?? {},
  { abilities: company.choice?.abilities, extraLevels: company.choice?.extraLevels },
];

describe('adventuring company data', () => {
  it('has the 21 companies of the three books, each once', () => {
    expect(COMPANIES).toHaveLength(21);
    expect(new Set(COMPANIES.map((company) => company.name)).size).toBe(21);
  });

  it('names only careers the sheet knows', () => {
    const careers = CAREERS.map((career) => career.name);
    for (const company of COMPANIES) {
      const named = [...(company.careers ?? []), company.split?.when].filter(
        (name): name is string => name !== undefined && name !== 'Gifted',
      );
      for (const name of named) expect(careers, `${company.name}: ${name}`).toContain(name);
    }
  });

  it('grants only abilities and skills from the books', () => {
    const abilities = ABILITIES.map((ability) => ability.name);
    for (const company of COMPANIES) {
      for (const grant of grantsOf(company)) {
        for (const name of grant.abilities ?? []) {
          expect(abilities, `${company.name}: ${name}`).toContain(baseSkillName(name));
        }
        for (const name of [...(grant.extraLevels ?? []), ...(grant.skills ?? []).map((skill) => skill.name)]) {
          expect(knownSkillStat(name), `${company.name}: ${name}`).toBeDefined();
        }
      }
    }
  });
});

describe('companyGrants', () => {
  it('gives every member the company’s abilities', () => {
    expect(companyGrants(member('Pirates of the Broken Coast')).flatMap((grant) => grant.abilities ?? [])).toEqual([
      'Hit the Deck!',
    ]);
  });

  it('adds the leader’s Natural Leader only when the character leads', () => {
    const abilities = (leader: boolean) =>
      companyGrants(member('Pirates of the Broken Coast', { companyLeader: leader })).flatMap(
        (grant) => grant.abilities ?? [],
      );
    expect(abilities(true)).toEqual(['Hit the Deck!', 'Natural Leader']);
    expect(abilities(false)).not.toContain('Natural Leader');
  });

  it('splits Gifted from non-Gifted members (p. 151)', () => {
    const abilities = (archetype: string) =>
      companyGrants(member('Arcane Order', { archetype })).flatMap((grant) => grant.abilities ?? []);
    expect(abilities('Gifted')).toEqual(['Arcane Scholar']);
    expect(abilities('Mighty')).toEqual(['Shield Guard']);
  });

  it('turns the pick into an ability or an extra skill level', () => {
    const spy = (pick: string) => companyGrants(member('Spy Ring', { companyChoice: pick }));
    expect(spy('Language').flatMap((grant) => grant.abilities ?? [])).toEqual(['Language']);
    expect(spy('Sneak +1').flatMap((grant) => grant.extraLevels ?? [])).toEqual(['Sneak']);
    expect(choiceOptions(COMPANIES.find((company) => company.name === 'Spy Ring')!)).toContain('Sneak +1');
  });

  it('gives nothing without a company, or for a name that isn’t one', () => {
    expect(companyGrants(member(''))).toEqual([]);
    expect(companyGrants(member('Not a company'))).toEqual([]);
  });
});

describe('companyIssues', () => {
  it('flags careers the company doesn’t take, but not an open benefit choice', () => {
    expect(companyIssues(member('Spy Ring'))).toEqual(['None of this character’s careers can join Spy Ring.']);
    const unchecked = {
      ...member('Spy Ring', { companyChoice: 'Language' }),
      settings: { ...member('').settings, companyCareers: false },
    };
    expect(companyIssues(unchecked)).toEqual([]);
    expect(companyIssues(member('Spy Ring', { careerList: ['Spy', 'Thief'], companyChoice: 'Language' }))).toEqual([]);
  });
});

describe('skillMaximum with a company', () => {
  it('treats the Arcane Order’s Lore (Arcane) as a career skill up to the level cap', () => {
    const noCareers = { careerList: ['', ''] };
    expect(skillMaximum(member('', noCareers), 'Lore (Arcane)')).toBeNull();
    expect(skillMaximum(member('Arcane Order', noCareers), 'Lore (Arcane)')).toBe(2);
    expect(skillMaximum(member('Arcane Order', { ...noCareers, level: 'Epic' }), 'Lore (Arcane)')).toBe(4);
  });
});
