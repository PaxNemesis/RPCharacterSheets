import { useId, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { Icon } from '@/components/Icon';
import { useFuCharacter } from '../../hooks/useFuCharacter';
import { BarChips, BarRow, ConflictDrawer } from './components';
import { useConflictUndo } from './hooks/useConflictUndo';
import { useDrawerOpen } from './hooks/useDrawerOpen';
import { useElementHeight } from './hooks/useElementHeight';
import { barChips } from './utils/barChips';
import { classStatuses } from './utils/classStatuses';
import './ConflictBar.styles.css';

type ConflictBarProps = {
  onPanelChange: (panel: string) => void;
};

/**
 * A drawer attached to the bottom of the sheet on every tab. Closed, it shows the turn, HP and MP and
 * what is happening; open, the details slide out under it. It belongs to the open character, so each
 * character keeps its own conflict.
 */
export function ConflictBar({ onPanelChange }: ConflictBarProps) {
  const { character, derived } = useFuCharacter();
  const [open, setOpen] = useDrawerOpen();
  const [takeFocus, setTakeFocus] = useState(false);
  const { run, undo, undoLabel, recentLabel } = useConflictUndo(character);
  const detailsId = useId();
  // The page keeps room for the closed bar only; opening the drawer grows it over the page instead.
  const [faceRef, faceHeight] = useElementHeight<HTMLDivElement>();
  const statuses = classStatuses(character, derived);
  const chips = barChips(character, statuses);

  const show = (next: boolean) => {
    setTakeFocus(next);
    setOpen(next);
  };
  // Clicking the bar anywhere but its buttons opens or closes the drawer too.
  const onFaceClick = (event: MouseEvent) => {
    if (!(event.target as Element).closest('button, a, input, select, textarea')) show(!open);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && open) show(false);
  };
  const showPanel = (panel: string) => {
    onPanelChange(panel);
    show(false);
  };

  return (
    <div
      className={open ? 'conflict-bar-container conflict-bar-open' : 'conflict-bar-container'}
      style={{ height: faceHeight }}
      onKeyDown={onKeyDown}
    >
      <div className="conflict-bar-sheet">
        <button
          type="button"
          className="conflict-bar-pull"
          aria-expanded={open}
          aria-controls={detailsId}
          aria-label={open ? 'Hide conflict details' : 'Show conflict details'}
          title={open ? 'Hide details' : 'Show details'}
          onClick={() => show(!open)}
        >
          <Icon name="expand_less" />
        </button>
        <div ref={faceRef} className="conflict-bar-face" onClick={onFaceClick}>
          <BarRow character={character} derived={derived} onRun={run} onUndo={undo} recentLabel={recentLabel} />
          {chips.length > 0 && <BarChips chips={chips} onPanelChange={showPanel} />}
        </div>
        <div className="conflict-bar-details" inert={!open}>
          <div className="conflict-bar-details-inner">
            <ConflictDrawer
              id={detailsId}
              character={character}
              derived={derived}
              statuses={statuses}
              takeFocus={open && takeFocus}
              onRun={run}
              onUndo={undo}
              undoLabel={undoLabel}
              onPanelChange={showPanel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
