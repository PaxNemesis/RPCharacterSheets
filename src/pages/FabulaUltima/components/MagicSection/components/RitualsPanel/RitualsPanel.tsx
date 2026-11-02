import { Panel } from '@/components/Panel'
import { useSheet } from '@/components/SheetProvider'
import { TextField } from '@/components/TextField'
import { DISCIPLINES } from '../../../../constants/attributes'
import type { Discipline, FuCharacter, FuDerived } from '../../../../types'
import { DisciplineCard } from './components'
import './RitualsPanel.styles.css'

type RitualsPanelProps = {
  character: FuCharacter
  derived: FuDerived
}

export function RitualsPanel({ character, derived }: RitualsPanelProps) {
  const { set } = useSheet()
  const added = character.rituals.disciplines
  const known = DISCIPLINES.filter(({ key }) => derived.disciplines.includes(key) || added[key])
  const addable = DISCIPLINES.filter((discipline) => !known.includes(discipline))
  const setAdded = (key: Discipline, value: boolean) => set(`rituals.disciplines.${key}`, value)

  return (
    <Panel
      title="Rituals"
      className="rituals-panel-container"
      actions={
        addable.length > 0 && (
          <select
            aria-label="Add a ritual discipline"
            value=""
            onChange={(event) => event.target.value && setAdded(event.target.value as Discipline, true)}
          >
            <option value="">Add discipline…</option>
            {addable.map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        )
      }
    >
      {known.length > 0 ? (
        <div className="rituals-panel-grid">
          {known.map((discipline) => (
            <DisciplineCard
              key={discipline.key}
              discipline={discipline}
              sources={derived.disciplineSources[discipline.key] ?? []}
              onRemove={() => setAdded(discipline.key, false)}
            />
          ))}
        </div>
      ) : (
        <p className="fu-note">
          None of your classes grant a ritual discipline yet. Use Add discipline for one you have from elsewhere.
        </p>
      )}
      <p className="fu-note">
        Disciplines come from class free benefits (Ritualism) and Skills such as Ritual Elementalism. Rituals: pp. 118–121.
      </p>
      <TextField path="rituals.notes" label="Other ritual notes" rows={3} />
    </Panel>
  )
}
