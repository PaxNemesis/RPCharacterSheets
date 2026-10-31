import { FormulaRow } from '@/components/FormulaRow'
import { NumberField } from '@/components/NumberField'
import { Panel } from '@/components/Panel'
import { useSheet } from '@/components/SheetProvider'
import type { FuCharacter, FuDerived } from '../../../types'

type PointsPanelProps = {
  character: FuCharacter
  derived: FuDerived
}

export function PointsPanel({ character, derived }: PointsPanelProps) {
  const { set } = useSheet()
  const hp = character.hp.current
  const inCrisis = hp !== null && hp > 0 && hp <= derived.crisis
  const over = [
    hp !== null && hp > derived.maxHp && 'HP',
    (character.mp.current ?? 0) > derived.maxMp && 'MP',
    (character.ip.current ?? 0) > derived.maxIp && 'IP',
  ].filter(Boolean)

  // Resting restores all HP and MP and removes every status effect (p. 90).
  const rest = () => {
    set('hp.current', derived.maxHp)
    set('mp.current', derived.maxMp)
    set('statuses', Object.fromEntries(Object.keys(character.statuses).map((key) => [key, false])))
  }

  return (
    <Panel
      title="Hit points, mind points, inventory points"
      actions={
        <button type="button" onClick={rest} title="Recover all HP and MP and clear status effects (p. 90)">
          Rest
        </button>
      }
    >
      <FormulaRow
        title="Max HP"
        terms={[
          { label: 'MIG × 5', value: derived.base('mig') * 5 },
          { label: 'Level', value: derived.level },
          { label: 'Classes', value: derived.hpBonus },
          { label: 'Other', path: 'hp.other' },
        ]}
        total={derived.maxHp}
      />
      <div className="fu-pool">
        <NumberField path="hp.current" label="Current HP" size="lg" className={inCrisis ? 'fu-crisis' : undefined} />
        <NumberField value={derived.crisis} label="Crisis" />
        {inCrisis && <p className="fu-warning">In Crisis.</p>}
        {hp === 0 && <p className="fu-warning">0 HP: surrender or sacrifice (pp. 86–89).</p>}
      </div>
      <FormulaRow
        title="Max MP"
        terms={[
          { label: 'WLP × 5', value: derived.base('wlp') * 5 },
          { label: 'Level', value: derived.level },
          { label: 'Classes', value: derived.mpBonus },
          { label: 'Other', path: 'mp.other' },
        ]}
        total={derived.maxMp}
      />
      <div className="fu-pool">
        <NumberField path="mp.current" label="Current MP" size="lg" />
      </div>
      <FormulaRow
        title="Max IP"
        terms={[
          { label: 'Base', value: 6 },
          { label: 'Classes', value: derived.ipBonus },
          { label: 'Other', path: 'ip.other' },
        ]}
        total={derived.maxIp}
      />
      <div className="fu-pool">
        <NumberField path="ip.current" label="Current IP" size="lg" />
      </div>
      {over.length > 0 && <p className="fu-warning">Above the maximum: {over.join(', ')}.</p>}
      <p className="fu-note">Classes includes free benefits and Heroic Skills such as Extra HP.</p>
    </Panel>
  )
}
