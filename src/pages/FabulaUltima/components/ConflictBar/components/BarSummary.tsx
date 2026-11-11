import type { FuCharacter, FuDerived } from '../../../types';
import type { ClassStatus } from '../ConflictBar.types';

type BarSummaryProps = {
  character: FuCharacter;
  derived: FuDerived;
  statuses: ClassStatus[];
  effectCount: number;
  onPanelChange: (panel: string) => void;
  onShowEffects: () => void;
};

/** HP, MP, IP and Fabula Points, then what each class is tracking: always in view on every tab. */
export function BarSummary({
  character,
  derived,
  statuses,
  effectCount,
  onPanelChange,
  onShowEffects,
}: BarSummaryProps) {
  // A blank current value counts as full.
  const hp = character.hp.current ?? derived.maxHp;
  const pools = [
    { key: 'hp', label: 'HP', current: hp, max: derived.maxHp, crisis: hp <= derived.crisis },
    { key: 'mp', label: 'MP', current: character.mp.current ?? derived.maxMp, max: derived.maxMp },
    { key: 'ip', label: 'IP', current: character.ip.current ?? derived.maxIp, max: derived.maxIp },
  ];

  return (
    <div className="conflict-bar-summary">
      {pools.map((pool) => (
        <span
          key={pool.key}
          className={`conflict-bar-pool conflict-bar-pool-${pool.key}${pool.crisis ? ' conflict-bar-crisis' : ''}`}
          title={pool.crisis ? 'In Crisis' : undefined}
        >
          {pool.label} <strong>{pool.current}</strong>
          <span className="conflict-bar-max">/{pool.max}</span>
        </span>
      ))}
      <span className="conflict-bar-pool conflict-bar-extra">
        FP <strong>{character.fabulaPoints ?? 0}</strong>
      </span>
      {statuses.map((status) => (
        <button
          key={status.panel}
          type="button"
          className="conflict-bar-chip conflict-bar-extra"
          title={`Open ${status.label}`}
          onClick={() => onPanelChange(status.panel)}
        >
          {status.summary}
        </button>
      ))}
      {effectCount > 0 && (
        <button type="button" className="conflict-bar-chip" onClick={onShowEffects}>
          {effectCount} {effectCount === 1 ? 'effect' : 'effects'}
        </button>
      )}
    </div>
  );
}
