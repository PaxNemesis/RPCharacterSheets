import { FormulaRow } from '@/components/FormulaRow';
import { Panel } from '@/components/Panel';
import type { FuDerived } from '../../../types';

type DefensePanelProps = {
  derived: FuDerived;
};

export function DefensePanel({ derived }: DefensePanelProps) {
  const armorBase = derived.armorDefense !== null;
  return (
    <Panel title="Defense & initiative">
      <FormulaRow
        title="Defense"
        terms={[
          armorBase ? { label: 'Armor', value: derived.armorDefense } : { label: 'DEX', value: derived.current('dex') },
          { label: 'Equipment', value: derived.gear.defense },
          { label: 'Other', path: 'modifiers.defense' },
        ]}
        total={derived.defense}
      />
      <FormulaRow
        title="Magic Defense"
        terms={[
          { label: 'INS', value: derived.current('ins') },
          { label: 'Equipment', value: derived.gear.magicDefense },
          { label: 'Other', path: 'modifiers.magicDefense' },
        ]}
        total={derived.magicDefense}
      />
      <FormulaRow
        title="Initiative mod."
        terms={[
          { label: 'Equipment', value: derived.gear.initiative },
          { label: 'Other', path: 'modifiers.initiative' },
        ]}
        total={derived.initiative}
      />
      <p className="fu-note">
        Defense uses your current DEX die, or the armor&apos;s fixed score for heavy armor; Magic Defense uses your
        current INS die (p. 127). Equipment bonuses come from the Equipment tab. Use Other for Skills, spells and other
        effects.
      </p>
    </Panel>
  );
}
