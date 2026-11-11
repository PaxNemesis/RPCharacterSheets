import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { Icon } from '@/components/Icon';
import { useFuCharacter } from '../../hooks/useFuCharacter';
import { BarActions, BarSummary, ConflictDrawer } from './components';
import { useConflictUndo } from './hooks/useConflictUndo';
import { useDrawerOpen } from './hooks/useDrawerOpen';
import { classStatuses } from './utils/classStatuses';
import './ConflictBar.styles.css';

type ConflictBarProps = {
  onPanelChange: (panel: string) => void;
};

/**
 * Stays at the bottom of the sheet on every tab: the character's resources and turn, with a drawer
 * for the details. It belongs to the open character, so each character keeps its own conflict.
 */
export function ConflictBar({ onPanelChange }: ConflictBarProps) {
  const { character, derived } = useFuCharacter();
  const [open, setOpen] = useDrawerOpen();
  const [takeFocus, setTakeFocus] = useState(false);
  const { run, undo, undoLabel } = useConflictUndo(character);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerId = useId();
  const { active, acting, turn } = character.conflict;
  const statuses = classStatuses(character, derived);
  const reminders = statuses.flatMap((status) => (status.reminder ? [status.reminder] : []));
  const effectCount = character.effects.length + statuses.reduce((total, status) => total + status.effects.length, 0);
  const state = !active
    ? 'No conflict'
    : acting
      ? `Turn ${turn}`
      : turn > 0
        ? `Waiting · turn ${turn} done`
        : 'Waiting';

  const show = (next: boolean) => {
    setTakeFocus(next);
    setOpen(next);
    if (!next) toggleRef.current?.focus();
  };
  const showPanel = (panel: string) => {
    onPanelChange(panel);
    setOpen(false);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && open) show(false);
  };

  return (
    <div className="conflict-bar-container" onKeyDown={onKeyDown}>
      {open && (
        <ConflictDrawer
          id={drawerId}
          character={character}
          derived={derived}
          statuses={statuses}
          takeFocus={takeFocus}
          onRun={run}
          onPanelChange={showPanel}
        />
      )}
      {reminders.map((reminder) => (
        <p key={reminder} className="conflict-bar-reminder">
          {reminder}
        </p>
      ))}
      <div className="conflict-bar-row">
        <button
          ref={toggleRef}
          type="button"
          className={active ? 'conflict-bar-toggle conflict-bar-active' : 'conflict-bar-toggle'}
          aria-expanded={open}
          aria-controls={open ? drawerId : undefined}
          title={open ? 'Hide conflict details' : 'Show conflict details'}
          onClick={() => show(!open)}
        >
          <Icon name={open ? 'expand_more' : 'expand_less'} />
          {state}
        </button>
        <BarSummary
          character={character}
          derived={derived}
          statuses={statuses}
          effectCount={effectCount}
          onPanelChange={onPanelChange}
          onShowEffects={() => show(true)}
        />
        <BarActions conflict={character.conflict} onRun={run} onUndo={undo} undoLabel={undoLabel} />
      </div>
    </div>
  );
}
