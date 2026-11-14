import { describe, expect, it } from 'vitest';
import type { SheetSystem } from '../CharacterWorkspace.types';
import { copyCharacter } from '../utils/copyCharacter';
import { hero, system } from './testSystem';

describe('copyCharacter', () => {
  it('names the copy after the original', () => {
    expect(copyCharacter(system, hero('Dasha', 3))).toEqual({ ...hero('Dasha', 3), name: 'Dasha (copy)' });
  });

  it('leaves an unnamed character unnamed', () => {
    expect(copyCharacter(system, hero('  ')).name).toBe('  ');
  });

  it('keeps the name when the system cannot rename', () => {
    expect(copyCharacter({ ...system, setName: undefined }, hero('Dasha')).name).toBe('Dasha');
  });

  it('shares nothing with the original', () => {
    type Geared = ReturnType<typeof hero> & { gear: string[] };
    const original: Geared = { ...hero('Dasha'), gear: ['rope'] };
    const copy = copyCharacter(system as unknown as SheetSystem<Geared>, original);
    copy.gear.push('lamp');
    expect(original.gear).toEqual(['rope']);
  });
});
