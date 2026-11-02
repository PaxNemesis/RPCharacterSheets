import { TextField } from '@/components/TextField'
import type { Discipline } from '../../../../../types'

type DisciplineCardProps = {
  discipline: { key: Discipline; label: string; check: string; page: string }
  /** Classes that grant the discipline; empty when it was added by hand. */
  sources: string[]
  onRemove: () => void
}

/** A discipline the character can perform Rituals of, with its Magic Check and the player's notes. */
export function DisciplineCard({ discipline, sources, onRemove }: DisciplineCardProps) {
  const fromClass = sources.length > 0

  return (
    <section className="rituals-panel-card" aria-label={`${discipline.label} rituals`}>
      <header className="rituals-panel-card-header">
        <h3>{discipline.label}</h3>
        <span className="rituals-panel-check">{discipline.check}</span>
      </header>
      <p className="fu-note">
        {fromClass ? `From ${sources.join(', ')}` : 'Added by you'} · Magic Check {discipline.page}
      </p>
      <TextField
        path={`rituals.disciplineNotes.${discipline.key}`}
        label={`${discipline.label} notes`}
        rows={3}
        placeholder="Rituals you've used, their effects, clocks…"
      />
      {!fromClass && (
        <button type="button" className="fu-start" onClick={onRemove}>
          Remove
        </button>
      )}
    </section>
  )
}
