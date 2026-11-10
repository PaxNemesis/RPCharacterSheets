import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { OpenCharacter } from '../CharacterWorkspace.types';
import { useLocationSync } from '../hooks/useLocationSync';
import { hero, type Hero } from './testSystem';

const characters: OpenCharacter<Hero>[] = [
  { id: 'alice', data: hero('Alice') },
  { id: 'bob', data: hero('Bob') },
];

type Props = { characterId?: string; activeId: string; loaded?: boolean };

/** Renders the hook with a location naming `characterId` and a store whose active character is `activeId`. */
function setup(initial: Props) {
  const select = vi.fn<(id: string) => void>();
  const showCharacter = vi.fn<(id: string, options: { replace: boolean }) => void>();
  const view = renderHook(
    ({ characterId, activeId, loaded = true }: Props) =>
      useLocationSync(
        { characterId, showCharacter, showPanel: () => {} },
        { loaded, characters, active: characters.find((c) => c.id === activeId)!, select },
      ),
    { initialProps: initial },
  );
  return { ...view, select, showCharacter };
}

describe('useLocationSync', () => {
  it('opens the character named in the URL', () => {
    const { select, showCharacter } = setup({ characterId: 'bob', activeId: 'alice' });
    expect(select).toHaveBeenCalledWith('bob');
    expect(showCharacter).not.toHaveBeenCalled();
  });

  it('replaces a URL without a character, or with one that isn’t open, by the open character', () => {
    expect(setup({ activeId: 'alice' }).showCharacter).toHaveBeenCalledWith('alice', { replace: true });
    const unknown = setup({ characterId: 'carol', activeId: 'alice' });
    expect(unknown.showCharacter).toHaveBeenCalledWith('alice', { replace: true });
    expect(unknown.select).not.toHaveBeenCalled();
  });

  it('adds a history entry when the store switches character, and follows the URL back', () => {
    const { rerender, select, showCharacter } = setup({ characterId: 'alice', activeId: 'alice' });
    expect(showCharacter).not.toHaveBeenCalled();

    // Picking Bob's tab changes the store first; the URL follows.
    rerender({ characterId: 'alice', activeId: 'bob' });
    expect(showCharacter).toHaveBeenCalledWith('bob', { replace: false });

    // The back button changes the URL first; the store follows.
    rerender({ characterId: 'bob', activeId: 'bob' });
    rerender({ characterId: 'alice', activeId: 'bob' });
    expect(select).toHaveBeenCalledWith('alice');
  });

  it('waits until the characters are loaded', () => {
    const { rerender, select, showCharacter } = setup({ characterId: 'bob', activeId: 'alice', loaded: false });
    expect(select).not.toHaveBeenCalled();
    expect(showCharacter).not.toHaveBeenCalled();
    rerender({ characterId: 'bob', activeId: 'alice', loaded: true });
    expect(select).toHaveBeenCalledWith('bob');
  });
});
