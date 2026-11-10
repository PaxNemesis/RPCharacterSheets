import { FormulaRow } from '@/components/FormulaRow';
import { Panel } from '@/components/Panel';
import { sum } from '@/utils/sum';
import type { IkSteamjack } from '../../../types';
import type { JackCombat } from '../utils/jackCombat';

type JackCombatPanelProps = {
  jack: IkSteamjack;
  combat: JackCombat;
};

/** MAT, RAT, initiative, DEF and ARM, worked out from the stats and cortex (pp. 300–305, 324). */
export function JackCombatPanel({ jack, combat }: JackCombatPanelProps) {
  const { stats, advancement } = jack;
  const over = [advancement.mat, advancement.rat].some((value) => (value ?? 0) > combat.advancementLimit);

  return (
    <Panel title="Combat">
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
      <p className="ik-note">Adv. is MAT and RAT gained as the warcaster advances (p. 324).</p>
    </Panel>
  );
}
