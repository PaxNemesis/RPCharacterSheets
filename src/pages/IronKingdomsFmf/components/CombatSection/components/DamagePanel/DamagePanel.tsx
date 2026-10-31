import { CheckTrack } from '@/components/CheckTrack'
import { NumberField } from '@/components/NumberField'
import { Panel } from '@/components/Panel'
import { useSheet } from '@/components/SheetProvider'
import { TextField } from '@/components/TextField'
import { ASPECTS, CRIPPLED_EFFECTS } from '../../../../constants/stats'
import type { IkCharacter, IkDerived } from '../../../../IronKingdomsFmf.types'
import { applyDamage } from '../../../../utils/applyDamage'
import { LifeSpiral } from '../LifeSpiral'
import { TakeDamageForm } from './components'
import './DamagePanel.styles.css'

type DamagePanelProps = {
  character: IkCharacter
  derived: IkDerived
}

export function DamagePanel({ character, derived }: DamagePanelProps) {
  const { set } = useSheet()
  const { marked } = character.damage
  const sizes = derived.branchSizes
  const damage = sizes.reduce((total, size, i) => total + Math.min(marked[i] ?? 0, size), 0)

  return (
    <Panel title="Damage capacity" className="damage-panel-container">
      <div className="damage-panel-layout">
        <LifeSpiral sizes={sizes} marked={marked} onMark={(branch, count) => set(`damage.marked.${branch}`, count)} />
        <div className="damage-panel-side">
          {ASPECTS.map((aspect) => (
            <p
              key={aspect.key}
              className={derived.crippled.includes(aspect.key) ? 'damage-panel-crippled ik-warning' : 'damage-panel-crippled'}
            >
              <strong>Crippled {aspect.label}:</strong> {CRIPPLED_EFFECTS[aspect.key]}
            </p>
          ))}
          <p className="ik-note">
            Vitality: <strong>{derived.vitality - damage}</strong> of {derived.vitality || '—'}
            {derived.vitality === 0 && ' (fill in PHY, AGL and INT on the Character tab)'}
          </p>
          <TakeDamageForm onApply={(branch, amount) => set('damage.marked', applyDamage(marked, sizes, branch, amount))} />
          <p className="ik-note">
            Damage fills the branch from the outside in, then carries on to the next branch with room. Click a circle to
            mark up to it, or click the last marked circle to heal it. Blacked-out circles are unused.
          </p>
          <button type="button" className="ik-start" onClick={() => set('damage.marked', sizes.map(() => 0))}>
            Heal all
          </button>
          {character.settings.powerField && (
            <div className="damage-panel-power">
              <NumberField path="powerField.size" label="Power field" size="sm" />
              <CheckTrack path="powerField.marked" size={Math.max(0, character.powerField.size ?? 0)} label="Power field" />
            </div>
          )}
        </div>
      </div>
      <TextField path="damage.notes" label="Damage & condition notes" rows={3} />
    </Panel>
  )
}
