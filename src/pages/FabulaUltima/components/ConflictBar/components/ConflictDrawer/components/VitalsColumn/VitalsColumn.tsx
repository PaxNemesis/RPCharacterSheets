import { useSheet } from '@/components/SheetProvider';
import { STATUSES } from '../../../../../../constants/attributes';
import type { FuCharacter, FuDerived } from '../../../../../../types';
import { PoolRow } from './components';
import './VitalsColumn.styles.css';

type VitalsColumnProps = {
  character: FuCharacter;
  derived: FuDerived;
};

/** HP, MP, IP and Fabula Points, each raised or lowered from its own buttons, and the status effects. */
export function VitalsColumn({ character, derived }: VitalsColumnProps) {
  const { set } = useSheet();
  const fabulaPoints = character.fabulaPoints ?? 0;

  return (
    <section className="conflict-drawer-column vitals-column-container" aria-labelledby="conflict-drawer-vitals">
      <h3 id="conflict-drawer-vitals" className="conflict-drawer-badge">
        Vitals
      </h3>
      {/* A blank current value counts as full. */}
      <PoolRow
        pool="hp"
        label="HP"
        current={character.hp.current ?? derived.maxHp}
        max={derived.maxHp}
        crisis={derived.crisis}
        verbs={[
          { label: 'Damage', title: 'Damage to HP' },
          { label: 'Heal', title: 'HP recovered' },
        ]}
      />
      <PoolRow
        pool="mp"
        label="MP"
        current={character.mp.current ?? derived.maxMp}
        max={derived.maxMp}
        verbs={[
          { label: 'Spend', title: 'MP spent' },
          { label: 'Recover', title: 'MP recovered' },
        ]}
      />
      <PoolRow
        pool="ip"
        label="IP"
        current={character.ip.current ?? derived.maxIp}
        max={derived.maxIp}
        verbs={[
          // Most items cost 3 IP, such as an elixir or a remedy (p. 104).
          { label: 'Use', title: 'IP used', preset: 3 },
          { label: 'Recover', title: 'IP recovered' },
        ]}
      />
      <div className="vitals-column-pool">
        <span className="vitals-column-pool-label">FP</span>
        <span className="vitals-column-pool-value">{fabulaPoints}</span>
        <button
          type="button"
          className="vitals-column-lower"
          onClick={() => set('fabulaPoints', Math.max(0, fabulaPoints - 1))}
          disabled={fabulaPoints < 1}
          aria-label="Spend a Fabula Point"
          title="Spend a Fabula Point"
        >
          −
        </button>
        <button
          type="button"
          className="vitals-column-raise"
          onClick={() => set('fabulaPoints', fabulaPoints + 1)}
          aria-label="Gain a Fabula Point"
          title="Gain a Fabula Point"
        >
          +
        </button>
      </div>
      <div className="vitals-column-statuses" role="group" aria-label="Status effects">
        {STATUSES.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            className="vitals-column-status"
            aria-pressed={character.statuses[key]}
            onClick={() => set(`statuses.${key}`, !character.statuses[key])}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}
