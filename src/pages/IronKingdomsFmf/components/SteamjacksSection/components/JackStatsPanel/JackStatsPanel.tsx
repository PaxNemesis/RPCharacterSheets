import { FormulaRow } from '@/components/FormulaRow';
import { NumberField } from '@/components/NumberField';
import { Panel } from '@/components/Panel';
import { sum } from '@/utils/sum';
import { JACK_STAT_KEYS } from '../../../../constants/steamjack';
import { STAT_LABELS } from '../../../../constants/stats';
import type { IkSteamjack } from '../../../../types';
import type { JackCombat } from '../../utils/jackCombat';
import './JackStatsPanel.styles.css';

type JackStatsPanelProps = {
  jack: IkSteamjack;
  combat: JackCombat;
};

/** The chassis stats, and MAT, RAT, initiative, DEF and ARM worked out from them (pp. 300–305, 324). */
export function JackStatsPanel({ jack, combat }: JackStatsPanelProps) {
  const { stats, advancement } = jack;
  const over = [advancement.mat, advancement.rat].some((value) => (value ?? 0) > combat.advancementLimit);

  return (
    <Panel title="Stats" className="jack-stats-panel-container">
      <div className="jack-stats-panel-fields">
        {JACK_STAT_KEYS.map((key) => (
          <NumberField key={key} path={`stats.${key}`} label={STAT_LABELS[key]} />
        ))}
      </div>
      <FormulaRow
        title="MAT"
        terms={[
          { label: 'PRW', value: stats.prw },
          { label: 'Cortex', value: combat.cortexBonus },
          { label: 'Adv.', path: 'advancement.mat' },
        ]}
        total={combat.mat}
      />
      <FormulaRow
        title="RAT"
        terms={[
          { label: 'POI', value: stats.poi },
          { label: 'Cortex', value: combat.cortexBonus },
          { label: 'Adv.', path: 'advancement.rat' },
        ]}
        total={combat.rat}
      />
      {over && (
        <p className="ik-warning">
          This cortex allows advancement of up to {combat.advancementLimit} on MAT and RAT (p. 324).
        </p>
      )}
      <FormulaRow
        title="Initiative"
        terms={[
          { label: 'SPD', value: stats.spd },
          { label: 'PRW', value: stats.prw },
          { label: 'PER', value: stats.per },
        ]}
        total={combat.initiative}
      />
      <FormulaRow
        title="DEF"
        terms={[
          { label: 'Base', path: 'defense.base' },
          { label: 'Modifiers', path: 'defense.mod' },
        ]}
        total={sum(jack.defense.base, jack.defense.mod)}
      />
      <FormulaRow
        title="ARM"
        terms={[
          { label: 'Base', path: 'armor.base' },
          { label: 'Modifiers', path: 'armor.mod' },
        ]}
        total={sum(jack.armor.base, jack.armor.mod)}
      />
    </Panel>
  );
}
