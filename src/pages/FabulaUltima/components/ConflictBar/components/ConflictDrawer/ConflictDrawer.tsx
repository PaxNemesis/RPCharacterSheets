import { useEffect, useRef } from 'react';
import { Icon } from '@/components/Icon';
import type { ConflictEvent, FuCharacter, FuDerived } from '../../../../types';
import type { ClassStatus } from '../../ConflictBar.types';
import { ClassesColumn, EffectsEditor, UsesEditor, VitalsColumn } from './components';
import './ConflictDrawer.styles.css';

type ConflictDrawerProps = {
  id: string;
  character: FuCharacter;
  derived: FuDerived;
  statuses: ClassStatus[];
  /** Move focus into the drawer: it was just opened from the bar. */
  takeFocus: boolean;
  onRun: (event: ConflictEvent, label: string) => void;
  onUndo: () => void;
  /** The event undo would take back, if any. */
  undoLabel?: string;
  onPanelChange: (panel: string) => void;
};

/** The details under the bar: what the scene is at, then vitals, what is active, and each class. */
export function ConflictDrawer(props: ConflictDrawerProps) {
  const { id, character, derived, statuses, takeFocus, onRun, onUndo, undoLabel, onPanelChange } = props;
  const ref = useRef<HTMLElement>(null);
  const { active, acting, turn } = character.conflict;
  const state = !active
    ? 'Not in a conflict'
    : `Conflict · ${acting ? `your turn ${turn}` : turn > 0 ? `turn ${turn} done` : 'waiting for your first turn'}`;

  // Without scrolling: while it slides open the browser would scroll the page to bring it into view.
  useEffect(() => {
    if (takeFocus) ref.current?.focus({ preventScroll: true });
  }, [takeFocus]);

  return (
    <section id={id} ref={ref} className="conflict-drawer-container" aria-label="Conflict details" tabIndex={-1}>
      <header className="conflict-drawer-header">
        <p>{state}</p>
        <span className="conflict-drawer-actions">
          <button
            type="button"
            className="conflict-drawer-undo"
            onClick={onUndo}
            disabled={!undoLabel}
            title={undoLabel ? `Undo ${undoLabel}` : 'Nothing to undo'}
          >
            <Icon name="undo" />
            {undoLabel ? `Undo ${undoLabel}` : 'Undo'}
          </button>
          <button
            type="button"
            title={active ? undefined : 'Ends effects that last the scene and gives back once-per-scene uses'}
            onClick={() => onRun('endScene', active ? 'End conflict' : 'End scene')}
          >
            {active ? 'End conflict' : 'End scene'}
          </button>
          <button
            type="button"
            title="Recover all HP and MP and every status effect, and end the scene"
            onClick={() => onRun('rest', 'Rest')}
          >
            Rest
          </button>
        </span>
      </header>
      <div className="conflict-drawer-columns">
        <VitalsColumn character={character} derived={derived} />
        <section className="conflict-drawer-column" aria-label="Active effects and limited uses">
          <EffectsEditor classEffects={statuses.flatMap((status) => status.effects)} />
          <UsesEditor />
        </section>
        {statuses.length > 0 && <ClassesColumn statuses={statuses} onPanelChange={onPanelChange} />}
      </div>
    </section>
  );
}
