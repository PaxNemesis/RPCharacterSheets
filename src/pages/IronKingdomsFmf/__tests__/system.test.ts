import { describe, expect, it } from 'vitest';
import { listItemProblems } from '@/test/listItemProblems';
import { createCharacter } from '../utils/createCharacter';
import { ironKingdomsFmf } from '../utils/ironKingdomsFmf';
import { LIST_ITEMS } from '../utils/listItems';
import { migrate } from '../utils/migrate';

describe('Iron Kingdoms system', () => {
  it('has a blank entry for each list that matches the character’s lists', () => {
    expect(listItemProblems(createCharacter(), LIST_ITEMS)).toEqual([]);
  });

  it('survives saving to JSON unchanged', () => {
    const character = createCharacter();
    expect(JSON.parse(JSON.stringify(character))).toEqual(character);
  });

  it('migrates every older version, and the current one not at all', () => {
    const character = createCharacter();
    expect(migrate(character, ironKingdomsFmf.version)).toEqual(character);
    for (let version = 1; version < ironKingdomsFmf.version; version++) {
      expect(() => migrate({}, version)).not.toThrow();
    }
  });
});
