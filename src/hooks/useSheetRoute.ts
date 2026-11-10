import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { useMemo } from 'react';
import type { WorkspaceLocation } from '@/components/CharacterWorkspace';

/**
 * The character and sheet panel in the URL, /<game>/<character>?panel=<panel>, for a game page's
 * CharacterWorkspace. Used inside a route with an optional `characterId` param and a `panel` search param.
 */
export function useSheetRoute(): WorkspaceLocation {
  const { characterId } = useParams({ strict: false }) as { characterId?: string };
  const { panel } = useSearch({ strict: false }) as { panel?: string };
  const navigate = useNavigate();

  return useMemo(
    () => ({
      characterId,
      panel,
      showCharacter: (id, { replace }) =>
        void navigate({
          to: '.',
          params: { characterId: id } as never,
          search: (prev: object) => prev as never,
          replace,
        }),
      showPanel: (next) =>
        void navigate({ to: '.', search: (prev: object) => ({ ...prev, panel: next }) as never, replace: true }),
    }),
    [characterId, panel, navigate],
  );
}
