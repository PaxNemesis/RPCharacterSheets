import type { SheetSystem } from '../CharacterWorkspace.types';

export type Hero = { name: string; level: number; title: string };

/** A small game system for tests: version 2 renamed `rank` to `title`. */
export const system: SheetSystem<Hero> = {
  id: 'test',
  title: 'Test',
  version: 2,
  createCharacter: () => ({ name: '', level: 1, title: '' }),
  migrate: (data, from) => (from < 2 ? { ...(data as object), title: (data as { rank?: string }).rank ?? '' } : data),
  getName: (hero) => hero.name,
  Sheet: () => null,
};

export const hero = (name: string, level = 1): Hero => ({ name, level, title: '' });
