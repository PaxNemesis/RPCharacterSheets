import { NumberField } from '@/components/NumberField'
import { Panel } from '@/components/Panel'
import { JACK_STAT_KEYS } from '../../../constants/steamjack'
import { STAT_LABELS } from '../../../constants/stats'
import type { IkSteamjack } from '../../../IronKingdomsFmf.types'
import { sum } from '../../../utils/sum'
import { FormulaRow } from '../../FormulaRow'

type JackStatsPanelProps = {
  jack: IkSteamjack
}

export function JackStatsPanel({ jack }: JackStatsPanelProps) {
  return (
    <Panel title="Stats">
      <div className="ik-fields">
        {JACK_STAT_KEYS.map((key) => (
          <NumberField key={key} path={`stats.${key}`} label={STAT_LABELS[key]} size="lg" />
        ))}
      </div>
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
  )
}
