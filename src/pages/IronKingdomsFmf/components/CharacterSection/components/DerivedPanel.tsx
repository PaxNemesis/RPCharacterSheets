import { NumberField } from '@/components/NumberField';
import { Panel } from '@/components/Panel';
import type { IkDerived } from '../../../types';
import { FormulaRow } from '@/components/FormulaRow';

type DerivedPanelProps = {
  derived: IkDerived;
};

export function DerivedPanel({ derived }: DerivedPanelProps) {
  const { stat } = derived;

  return (
    <Panel title="Defense, armor & initiative">
      <p className="ik-note">
        Shaded boxes fill in automatically. Armor comes from the Worn armor list on the Weapons & gear tab, and the
        Command skill from a skill named Command. Use Other for shields, spells and abilities. Movement SPD is how far
        you move; DEF and Initiative use the SPD stat itself (p. 106).
        {derived.loadBearing && ' Load Bearing reduces the armor’s SPD and DEF penalties by 1 each (p. 164).'}
      </p>
      <FormulaRow
        title="DEF"
        terms={[
          { label: 'SPD', value: stat('spd') },
          { label: 'AGL', value: stat('agl') },
          { label: 'PER', value: stat('per') },
          ...(derived.racialDefense !== null ? [{ label: 'Race', value: derived.racialDefense }] : []),
          { label: 'Armor', value: derived.armorDefense },
          // Crippled Intellect: –2 DEF (p. 215), shown only while it applies.
          ...(derived.defensePenalty !== null ? [{ label: 'Crippled', value: derived.defensePenalty }] : []),
          { label: 'Other', path: 'modifiers.defense' },
        ]}
        total={derived.defense}
      />
      <FormulaRow
        title="ARM"
        terms={[
          { label: 'PHY', value: stat('phy') },
          { label: 'Armor', value: derived.armorArmor },
          { label: 'Other', path: 'modifiers.armor' },
        ]}
        total={derived.armor}
      />
      <FormulaRow
        title="Initiative"
        terms={[
          { label: 'SPD', value: stat('spd') },
          { label: 'PRW', value: stat('prw') },
          { label: 'PER', value: stat('per') },
          { label: 'Other', path: 'modifiers.initiative' },
        ]}
        total={derived.initiative}
      />
      <FormulaRow
        title="Movement SPD"
        terms={[
          { label: 'SPD', value: stat('spd') },
          { label: 'Armor', value: derived.armorSpeed },
          { label: 'Other', path: 'modifiers.speed' },
        ]}
        total={derived.speed}
      />
      <FormulaRow
        title="Command range"
        terms={[
          { label: 'INT', value: stat('int') },
          { label: 'Command', value: derived.commandSkill },
          { label: 'Other', path: 'modifiers.commandRange' },
        ]}
        total={derived.commandRange}
      />
      <div className="ik-formula">
        <span className="ik-formula-title">Feat points</span>
        <NumberField path="featPoints" label="Current" size="sm" />
        <p className="ik-note">
          Earned by critical successes, destroying enemies, or from the GM. Spend on boosts, re-rolls, quick actions,
          heroic dodges and more (p. 220).
        </p>
      </div>
    </Panel>
  );
}
