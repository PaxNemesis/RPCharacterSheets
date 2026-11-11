import { Icon } from '@/components/Icon';
import type { ConflictEvent, FuCharacter, FuDerived } from '../../../../types';
import { VitalMeter } from '../VitalMeter';
import './BarRow.styles.css';

type BarRowProps = {
  character: FuCharacter;
  derived: FuDerived;
  onRun: (event: ConflictEvent, label: string) => void;
  onUndo: () => void;
  /** Set for a few seconds after a bar button, to undo it without opening the drawer. */
  recentLabel?: string;
};

// Every label the state can show, stacked invisibly so it keeps the width of the widest.
const STATE_SIZES = ['No conflict', 'Waiting', 'Turn 88'];

const NEXT: Record<'idle' | 'acting' | 'waiting', [ConflictEvent, string, string?]> = {
  idle: ['startConflict', 'Start conflict'],
  acting: ['endTurn', 'End turn', 'Effects lasting until your next turn stay on until you start it'],
  waiting: ['startTurn', 'Start turn', 'Your turn comes up'],
};

/** The bar's first line: turn, HP and MP, IP and FP, and the next step. */
export function BarRow({ character, derived, onRun, onUndo, recentLabel }: BarRowProps) {
  const { active, acting, turn } = character.conflict;
  const mode = !active ? 'idle' : acting ? 'acting' : 'waiting';
  const state = mode === 'idle' ? 'No conflict' : mode === 'acting' ? `Turn ${turn}` : 'Waiting';
  const [event, label, title] = NEXT[mode];

  return (
    <div className="bar-row-container">
      <span className={active ? 'bar-row-state bar-row-live' : 'bar-row-state'}>
        {STATE_SIZES.map((size) => (
          <span key={size} className="bar-row-sizer" aria-hidden="true">
            {size}
          </span>
        ))}
        <span>{state}</span>
      </span>
      <span className="bar-row-vitals">
        <VitalMeter
          label="HP"
          current={character.hp.current ?? derived.maxHp}
          max={derived.maxHp}
          crisis={derived.crisis}
        />
        <VitalMeter label="MP" current={character.mp.current ?? derived.maxMp} max={derived.maxMp} />
        <VitalMeter
          label="IP"
          current={character.ip.current ?? derived.maxIp}
          max={derived.maxIp}
          className="bar-row-ip"
        />
        <span className="bar-row-number">
          FP <strong>{character.fabulaPoints ?? 0}</strong>
        </span>
      </span>
      <span className="bar-row-actions">
        {recentLabel && (
          <button type="button" className="bar-row-undo" onClick={onUndo}>
            <Icon name="undo" />
            <span className="bar-row-word">Undo {recentLabel}</span>
          </button>
        )}
        {mode === 'idle' && (
          <button
            type="button"
            title="Recover all HP and MP and every status effect, and end the scene"
            onClick={() => onRun('rest', 'Rest')}
          >
            Rest
          </button>
        )}
        <button type="button" className="bar-row-primary" title={title} onClick={() => onRun(event, label)}>
          {label}
        </button>
      </span>
    </div>
  );
}
