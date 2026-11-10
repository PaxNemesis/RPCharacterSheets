import { describe, expect, it } from 'vitest';
import { classBenefits, classIssues, classLevel, heroicBonus } from '../utils/rules';
import { character, classWith } from './character';

describe('rules', () => {
  it("adds up a class's Skill Levels to its level", () => {
    const entry = classWith('Guardian', ['Fortress', 3], ['Protect', 1]);
    expect(classLevel(entry)).toBe(4);
    expect(classLevel({ ...entry, skills: [{ name: '', level: null, notes: '' }] })).toBe(0);
  });

  it('grants free benefits and ritual disciplines from rulebook classes', () => {
    const benefits = classBenefits(character({ classes: [classWith('Elementalist', ['Ritual Elementalism', 1])] }));
    expect(benefits.mp).toBe(5);
    expect(benefits.disciplines).toEqual(expect.arrayContaining(['elementalism', 'ritualism']));
    expect(benefits.disciplineSources.elementalism).toEqual(['Elementalist']);
  });

  it('only counts classes with at least one level', () => {
    expect(classBenefits(character({ classes: [classWith('Guardian', ['Fortress', 0])] })).hp).toBe(0);
  });

  it('takes a custom class’s benefits as typed, and its disciplines from ticks or a "Ritual" Skill', () => {
    const custom = classWith('Hedge Witch', ['Ritual Spiritism', 1]);
    const hedgeWitch = { ...custom, custom: { ...custom.custom, ip: 2, disciplines: { illusionism: true } } };
    const benefits = classBenefits(character({ classes: [hedgeWitch] }));
    expect(benefits.ip).toBe(2);
    expect(benefits.disciplines).toEqual(expect.arrayContaining(['illusionism', 'spiritism']));
  });

  it('reports a duplicate class, Skills above their maximum and a missing HP or MP choice', () => {
    const guardian = classWith('Guardian', ['Bodyguard', 2]);
    const sheet = character({ classes: [guardian, classWith('guardian ', ['Fortress', 1])] });
    expect(classIssues(sheet, guardian)).toEqual([
      'You already have this class; a character can only take each class once.',
      'Above the maximum Skill Level: Bodyguard.',
    ]);
    const dancer = classWith('Dancer', ['Dance', 1]);
    expect(classIssues(character({ classes: [dancer] }), dancer)).toEqual([
      'Choose whether the free benefit raises HP or MP.',
    ]);
  });

  it("checks a custom class's Skills against the maximum typed in", () => {
    const custom = classWith('Pirate', ['Plunder', 3]);
    const pirate = { ...custom, skills: [{ ...custom.skills[0], max: 2 }] };
    expect(classIssues(character({ classes: [pirate] }), pirate)).toEqual(['Above the maximum Skill Level: Plunder.']);
  });

  it('adds Extra HP and MP from Heroic Skills, doubled from level 40, and Extra IP as it is', () => {
    const sheet = character({
      heroicSkills: ['Extra HP', 'Extra MP', 'Extra IP'].map((name) => ({ name, source: ':other', notes: '' })),
    });
    expect(heroicBonus(sheet, 10)).toEqual({ hp: 10, mp: 10, ip: 4 });
    expect(heroicBonus(sheet, 40)).toEqual({ hp: 20, mp: 20, ip: 4 });
  });
});
