import { Panel } from '@/components/Panel';
import { useSheet } from '@/components/SheetProvider';
import type { FuCharacter, FuDerived } from '../../../../types';
import { PoolRow } from './components';
import './PointsPanel.styles.css';

type PointsPanelProps = {
  character: FuCharacter;
  derived: FuDerived;
};

export function PointsPanel({ character, derived }: PointsPanelProps) {
  const { set } = useSheet();
  const hp = character.hp.current;
  const inCrisis = hp !== null && hp > 0 && hp <= derived.crisis;
  const over = [
    hp !== null && hp > derived.maxHp && 'HP',
    (character.mp.current ?? 0) > derived.maxMp && 'MP',
    (character.ip.current ?? 0) > derived.maxIp && 'IP',
  ].filter(Boolean);

  // Resting restores all HP and MP and removes every status effect (p. 90).
  const rest = () => {
    set('hp.current', derived.maxHp);
    set('mp.current', derived.maxMp);
    set('statuses', Object.fromEntries(Object.keys(character.statuses).map((key) => [key, false])));
  };

  return (
    <Panel
      title="Hit points, mind points, inventory points"
      className="points-panel-container"
      actions={
        <button type="button" onClick={rest} title="Recover all HP and MP and clear status effects (p. 90)">
          Rest
        </button>
      }
    >
      <div className="points-panel-grid">
        <span aria-hidden="true" />
        <span className="points-panel-head">Max</span>
        <span className="points-panel-head">Current</span>
        <PoolRow
          pool="hp"
          label="HP"
          max={derived.maxHp}
          crisis={derived.crisis}
          inCrisis={inCrisis}
          terms={[
            { label: 'MIG × 5', value: derived.base('mig') * 5 },
            { label: 'Level', value: derived.level },
            { label: 'Bonuses', value: derived.hpBonus },
            { label: 'Other', path: 'hp.other' },
          ]}
        />
        <PoolRow
          pool="mp"
          label="MP"
          max={derived.maxMp}
          terms={[
            { label: 'WLP × 5', value: derived.base('wlp') * 5 },
            { label: 'Level', value: derived.level },
            { label: 'Bonuses', value: derived.mpBonus },
            { label: 'Other', path: 'mp.other' },
          ]}
        />
        <PoolRow
          pool="ip"
          label="IP"
          max={derived.maxIp}
          terms={[
            { label: 'Base', value: 6 },
            { label: 'Bonuses', value: derived.ipBonus },
            { label: 'Other', path: 'ip.other' },
          ]}
        />
      </div>
      {hp === 0 && <p className="fu-warning">0 HP: surrender or sacrifice (pp. 86–89).</p>}
      {over.length > 0 && <p className="fu-warning">Above the maximum: {over.join(', ')}.</p>}
      <p className="fu-note">Bonuses are class free benefits, Heroic Skills such as Extra HP, and your Quirk.</p>
    </Panel>
  );
}
