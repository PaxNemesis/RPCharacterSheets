import { NumberField } from '@/components/NumberField'
import { Panel } from '@/components/Panel'
import { TextField } from '@/components/TextField'

export function NotesSection() {
  return (
    <div className="ik-section">
      <Panel title="Notes & background">
        <TextField path="notes.general" label="Notes" hideLabel rows={12} />
      </Panel>
      <Panel title="Wealth & property">
        <div className="ik-wealth">
          <NumberField path="gold" label="Gold crowns" />
          <TextField path="wealth" label="Other wealth & property" rows={3} />
        </div>
      </Panel>
      <div className="ik-columns">
        <Panel title="Languages">
          <TextField path="notes.languages" label="Spoken languages" hideLabel rows={5} />
        </Panel>
        <Panel title="Religious beliefs">
          <TextField path="notes.religion" label="Religious beliefs" hideLabel rows={5} />
        </Panel>
      </div>
    </div>
  )
}
