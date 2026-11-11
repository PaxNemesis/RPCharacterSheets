import { useEffect, useRef } from 'react';
import type { ConflictEvent, FuCharacter, FuDerived } from '../../../../types';
import type { ClassStatus } from '../../ConflictBar.types';
import { ClassStatusList, DrawerResources, EffectsEditor, UsesEditor } from './components';
import './ConflictDrawer.styles.css';

type ConflictDrawerProps = {
  id: string;
  character: FuCharacter;
  derived: FuDerived;
  statuses: ClassStatus[];
  /** Move focus into the drawer, when it was opened from the bar rather than open on load. */
  takeFocus: boolean;
  onRun: (event: ConflictEvent, label: string) => void;
  onPanelChange: (panel: string) => void;
};

/** The details behind the bar: resources, status effects, effects, limited uses and each class. */
export function ConflictDrawer({
  id,
  character,
  derived,
  statuses,
  takeFocus,
  onRun,
  onPanelChange,
}: ConflictDrawerProps) {
  const ref = useRef<HTMLElement>(null);
  const { active } = character.conflict;

  useEffect(() => {
    if (takeFocus) ref.current?.focus();
  }, [takeFocus]);

  return (
    <section id={id} ref={ref} className="conflict-drawer-container" aria-label="Conflict details" tabIndex={-1}>
      {statuses.length > 0 && <ClassStatusList statuses={statuses} onPanelChange={onPanelChange} />}
      <DrawerResources character={character} derived={derived} />
      <EffectsEditor classEffects={statuses.flatMap((status) => status.effects)} />
      <UsesEditor />
      <div className="conflict-drawer-actions">
        {active ? (
          <button type="button" onClick={() => onRun('endScene', 'End conflict')}>
            End conflict
          </button>
        ) : (
          <button
            type="button"
            title="Ends effects that last the scene and gives back once-per-scene uses"
            onClick={() => onRun('endScene', 'End scene')}
          >
            End scene
          </button>
        )}
        <button
          type="button"
          title="Recover all HP and MP and every status effect, and end the scene"
          onClick={() => onRun('rest', 'Rest')}
        >
          Rest
        </button>
      </div>
    </section>
  );
}
