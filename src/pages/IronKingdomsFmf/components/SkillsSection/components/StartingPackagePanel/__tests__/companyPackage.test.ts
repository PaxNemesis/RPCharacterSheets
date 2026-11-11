import { describe, expect, it } from 'vitest';
import { character } from '../../../../../__tests__/character';
import { applyStartingPackage, startingPackage } from '../utils/startingPackage';

describe('startingPackage with an adventuring company', () => {
  it('adds the company’s abilities, connections, skills and assets (pp. 151–153)', () => {
    const pack = startingPackage(
      character({ identity: { careerList: ['Soldier', 'Pistoleer'], company: 'Five Fingers Transporters' } }),
      {},
    );
    expect(pack.abilities).toEqual(expect.arrayContaining(['Language (Five Cant)', 'Cover Identity']));
    expect(pack.skills).toContainEqual({ name: 'Disguise', level: 1 });
    expect(pack.companyNotes).toEqual(['One more Language of your choice.']);
  });

  it('raises a career skill by one for “one additional occupational skill level”', () => {
    const arcanist = character({
      identity: { archetype: 'Gifted', careerList: ['Arcanist', 'Soldier'], company: 'Arcane Order' },
    });
    const pack = startingPackage(arcanist, {});
    expect(pack.skills.find((skill) => skill.name === 'Lore (Arcane)')?.level).toBe(2);
    expect(pack.abilities).toContain('Arcane Scholar');
  });

  it('lists a company ability the careers already give, so the player picks another', () => {
    const soldier = character({
      identity: { careerList: ['Soldier', 'Pistoleer'], company: 'Unorthodox Engagement Team' },
    });
    expect(startingPackage(soldier, {}).repeatedAbilities).toEqual(['Find Cover']);
  });

  it('adds a chosen asset to the gear, marked as the company’s', () => {
    const before = character({
      identity: {
        careerList: ['Knight', 'Investigator'],
        company: 'Illuminated Ones',
        companyChoice: 'Execrator pistol',
      },
    });
    const { character: after } = applyStartingPackage(before, startingPackage(before, {}));
    expect(after.gear).toContainEqual({
      name: 'Execrator pistol',
      notes: 'Illuminated Ones starting asset',
      quantity: 1,
    });
    expect(after.abilities.map((ability) => ability.name)).toContain('Iron Will');
  });
});
