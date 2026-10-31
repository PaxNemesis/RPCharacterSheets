import { NumberField } from '@/components/NumberField'
import { Panel } from '@/components/Panel'
import type { IkDerived } from '../../../types'
import { FormulaRow } from '../../FormulaRow'

type DerivedPanelProps = {
  derived: IkDerived
}

export function DerivedPanel({ derived }: DerivedPanelProps) {
  const { stat } = derived

  return (
    <Panel title="Defense, armor & initiative">
      <p className="ik-note">
        Shaded boxes fill in automatically. Armor comes from the Worn armor list on the Gear tab, and the Command skill
        from a skill named Command. Use Other for shields, spells and abilities.
      </p>
      <FormulaRow
        title="DEF"
        terms={[
          { label: 'SPD', value: stat('spd') },
          { label: 'AGL', value: stat('agl') },
          { label: 'PER', value: stat('per') },
          ...(derived.racialDefense !== null ? [{ label: 'Race', value: derived.racialDefense }] : []),
          { label: 'Armor', value: derived.armorDefense },
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
  )
}
