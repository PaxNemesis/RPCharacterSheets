import { useEffect, useRef } from 'react';
import type { OpenCharacter, WorkspaceLocation } from '../CharacterWorkspace.types';

type Store<T> = {
  loaded: boolean;
  characters: OpenCharacter<T>[];
  active: OpenCharacter<T>;
  select: (id: string) => void;
};

/**
 * Keeps the open character and the location in step. When the location has just changed (a link, a
 * reload, the back button) and names an open character, that character is selected. Otherwise the
 * location follows the store: picking, adding, opening or closing a character adds a history entry,
 * and a location naming no open character is replaced.
 */
export function useLocationSync<T>(
  location: WorkspaceLocation | undefined,
  { loaded, characters, active, select }: Store<T>,
) {
  const seen = useRef<string | undefined>(undefined);
  const first = useRef(true);
  const characterId = location?.characterId;
  const showCharacter = location?.showCharacter;

  useEffect(() => {
    if (!loaded || !showCharacter) return;
    const changed = first.current || characterId !== seen.current;
    first.current = false;
    seen.current = characterId;
    if (characterId === active.id) return;
    const known = characterId !== undefined && characters.some((character) => character.id === characterId);
    if (changed && known) select(characterId);
    else showCharacter(active.id, { replace: !known });
  }, [loaded, characterId, active.id, characters, select, showCharacter]);
}
