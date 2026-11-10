import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useOpenCharacters } from '../hooks/useOpenCharacters';
import { hero, system, type Hero } from './testSystem';

const file = (name: string, content: unknown) =>
  new File([JSON.stringify(content)], name, { type: 'application/json' });
const characterFile = (id: string, data: Hero) => file(`${id}.json`, { system: 'test', version: 2, id, data });

function setup(openIds: string[] = []) {
  const store = {
    characters: openIds.map((id) => ({ id, data: hero(id) })),
    add: vi.fn<(data?: Hero, id?: string) => void>(),
    update: vi.fn<(id: string, updater: (data: Hero) => Hero) => void>(),
    select: vi.fn<(id: string) => void>(),
  };
  const { result } = renderHook(() => useOpenCharacters(system, store));
  const open = (...files: File[]) => act(() => result.current.open(files));
  return { store, result, open };
}

describe('useOpenCharacters', () => {
  it('opens characters that aren’t open yet straight away, keeping their ids', async () => {
    const { store, result, open } = setup();
    await open(characterFile('a', hero('Ana')), characterFile('b', hero('Bo')));
    expect(store.add.mock.calls).toEqual([
      [hero('Ana'), 'a'],
      [hero('Bo'), 'b'],
    ]);
    expect(result.current.opened).toBe(2);
    expect(result.current.clashes).toEqual([]);
  });

  it('holds back a character whose id is already open, and the same id twice in one go', async () => {
    const { store, result, open } = setup(['a']);
    await open(characterFile('a', hero('Ana', 4)), characterFile('b', hero('Bo')), characterFile('b', hero('Bo', 2)));
    expect(store.add).toHaveBeenCalledTimes(1);
    expect(result.current.clashes.map((clash) => [clash.id, clash.data.level])).toEqual([
      ['a', 4],
      ['b', 2],
    ]);
  });

  it('replaces the open tabs with the file’s copies and opens the last one', async () => {
    const { store, result, open } = setup(['a']);
    await open(characterFile('a', hero('Ana', 4)));
    act(() => result.current.resolve('replace'));
    expect(store.update).toHaveBeenCalledWith('a', expect.any(Function));
    expect(store.update.mock.calls[0][1](hero('Ana'))).toEqual(hero('Ana', 4));
    expect(store.select).toHaveBeenCalledWith('a');
    expect(result.current.clashes).toEqual([]);
  });

  it('opens the file’s copies as new characters', async () => {
    const { store, result, open } = setup(['a']);
    await open(characterFile('a', hero('Ana', 4)));
    act(() => result.current.resolve('copy'));
    expect(store.add).toHaveBeenCalledWith(hero('Ana', 4));
    expect(store.update).not.toHaveBeenCalled();
  });

  it('reports each file it can’t open and still opens the rest', async () => {
    const { store, result, open } = setup();
    await open(
      file('notes.json', 'just text'),
      file('other.json', { system: 'other-game', version: 1, data: {} }),
      characterFile('a', hero('Ana')),
    );
    expect(result.current.errors).toEqual([
      'notes.json is not a character file.',
      'other.json is a other-game character, not Test.',
    ]);
    expect(store.add).toHaveBeenCalledTimes(1);
  });

  it('refuses files over 10 MB without reading them', async () => {
    const { store, result, open } = setup();
    const big = new File(['x'], 'big.json');
    Object.defineProperty(big, 'size', { value: 11 * 1024 * 1024 });
    await open(big);
    expect(result.current.errors).toEqual(['big.json is larger than 10 MB, which is too big for a character file.']);
    expect(store.add).not.toHaveBeenCalled();
  });
});
