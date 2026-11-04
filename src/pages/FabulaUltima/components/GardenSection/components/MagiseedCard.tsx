import { Icon } from '@/components/Icon'
import { TextField } from '@/components/TextField'

type MagiseedCardProps = {
  seed: { name: string; page: number }
  /** Whether it's the magiseed currently in the garden. */
  planted: boolean
  onPlant: () => void
  onForget: () => void
}

/** A discovered magiseed, with the player's own notes on its effects. */
export function MagiseedCard({ seed, planted, onPlant, onForget }: MagiseedCardProps) {
  return (
    <section className={planted ? 'garden-section-card garden-section-planted' : 'garden-section-card'} aria-label={seed.name}>
      <header className="garden-section-card-header">
        <h3>{seed.name}</h3>
        <button
          type="button"
          className="garden-section-forget"
          onClick={onForget}
          title="Remove from discovered magiseeds"
          aria-label={`Remove ${seed.name}`}
        >
          <Icon name="delete" className="garden-section-icon" />
        </button>
      </header>
      <p className="fu-note">
        {planted && <strong>In the garden · </strong>}NF p. {seed.page}
      </p>
      <button type="button" className="garden-section-plant" onClick={onPlant} disabled={planted}>
        {planted ? 'Planted' : 'Plant'}
      </button>
      <TextField
        path={`floralist.seedNotes.${seed.name}`}
        label={`${seed.name} notes`}
        hideLabel
        rows={3}
        placeholder="Its effect at each Growth Clock section, in your words…"
      />
    </section>
  )
}
