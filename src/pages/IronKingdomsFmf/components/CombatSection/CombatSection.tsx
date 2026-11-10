import { Panel } from '@/components/Panel'
import { TextField } from '@/components/TextField'
import { useIkCharacter } from '../../hooks/useIkCharacter'
import { AttacksPanel, DamagePanel } from './components'

export function CombatSection() {
  const { character, derived } = useIkCharacter()

  return (
    <div className="ik-section">
      <AttacksPanel character={character} derived={derived} />
      <DamagePanel character={character} derived={derived} />
      <Panel title="Permanent injuries">
        <TextField path="notes.injuries" label="Permanent injuries" hideLabel rows={4} />
      </Panel>
    </div>
  )
}
