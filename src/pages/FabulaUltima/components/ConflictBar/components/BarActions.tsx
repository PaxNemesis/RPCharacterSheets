import { Icon } from '@/components/Icon';
import type { ConflictEvent, FuConflict } from '../../../types';

type BarActionsProps = {
  conflict: FuConflict;
  onRun: (event: ConflictEvent, label: string) => void;
  onUndo: () => void;
  /** The event undo would take back, if any. */
  undoLabel?: string;
};

/** Undo, and the next step: rest or start a conflict, then end and start your turns. */
export function BarActions({ conflict, onRun, onUndo, undoLabel }: BarActionsProps) {
  const button = (event: ConflictEvent, label: string, title?: string) => (
    <button type="button" className="conflict-bar-primary" title={title} onClick={() => onRun(event, label)}>
      {label}
    </button>
  );

  return (
    <div className="conflict-bar-actions">
      <button
        type="button"
        className="conflict-bar-icon"
        onClick={onUndo}
        disabled={!undoLabel}
        aria-label={undoLabel ? `Undo ${undoLabel}` : 'Undo'}
        title={undoLabel ? `Undo ${undoLabel}` : 'Nothing to undo'}
      >
        <Icon name="undo" />
      </button>
      {!conflict.active && (
        <>
          <button
            type="button"
            title="Recover all HP and MP and every status effect, and end the scene"
            onClick={() => onRun('rest', 'Rest')}
          >
            Rest
          </button>
          {button('startConflict', 'Start conflict')}
        </>
      )}
      {conflict.active &&
        (conflict.acting
          ? button('endTurn', 'End turn', 'Effects lasting until your next turn stay on until you start it')
          : button('startTurn', 'Start turn', 'Your turn comes up'))}
    </div>
  );
}
