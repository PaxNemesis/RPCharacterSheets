import { useState } from 'react';
import { useSheet } from '@/components/SheetProvider';
import type { ConflictEvent, FuCharacter } from '../../../types';
import { runConflictEvent } from '../../../utils/conflict';
import { normalizeCharacter } from '../../../utils/equip';

type Step = { label: string; before: FuCharacter; after: FuCharacter };

const MAX_STEPS = 20;

/**
 * Runs conflict events and undoes them, newest first. Only while the character is still exactly as an
 * event left it: after any other change, undoing would throw that change away, so undo is off.
 * The steps are kept while the page is open, not saved.
 */
export function useConflictUndo(character: FuCharacter) {
  const { set } = useSheet();
  const [steps, setSteps] = useState<Step[]>([]);
  const last = steps.at(-1);
  const undoable = last?.after === character ? last : undefined;

  const run = (event: ConflictEvent, label: string) => {
    // Normalized as the sheet stores it, so `after` is the very object the sheet ends up with.
    const after = normalizeCharacter(runConflictEvent(character, event));
    if (after === character) return;
    setSteps((current) => [...(undoable ? current : []), { label, before: character, after }].slice(-MAX_STEPS));
    set('', after);
  };

  const undo = () => {
    if (!undoable) return;
    setSteps((current) => current.slice(0, -1));
    set('', undoable.before);
  };

  return { run, undo, undoLabel: undoable?.label };
}
