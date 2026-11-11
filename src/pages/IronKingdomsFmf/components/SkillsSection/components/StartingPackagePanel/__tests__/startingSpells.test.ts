import { describe, expect, it } from 'vitest';
import { character } from '../../../../../__tests__/character';
import { applyStartingPackage, startingPackage } from '../utils/startingPackage';

describe('starting spells', () => {
  it('are added with their numbers filled in', () => {
    const arcanist = character({ identity: { archetype: 'Gifted', careerList: ['Arcanist', 'Soldier'] } });
    const { character: after } = applyStartingPackage(arcanist, startingPackage(arcanist, {}));
    expect(after.spells.find((spell) => spell.name === 'Arcane Bolt')).toMatchObject({ cost: 2, pow: 11, page: '236' });
  });
});
