import { Panel } from '@/components/Panel'
import { SelectField } from '@/components/SelectField'
import { TextField } from '@/components/TextField'
import { DELICACY_EFFECTS, TASTE_PAIRS } from '../../../constants/gourmet'
import type { FuGourmet } from '../../../types'

const EFFECT_OPTIONS = [
  { value: '', label: 'Not found yet' },
  ...DELICACY_EFFECTS.map((effect) => ({ value: String(effect.roll), label: `${effect.roll}. ${effect.label}` })),
]

const effectOf = (roll: string | undefined) => DELICACY_EFFECTS.find((effect) => String(effect.roll) === roll)

type CombinationsPanelProps = {
  gourmet: FuGourmet
}

/** The cookbook: the effect each pair of tastes adds to a delicacy, found by rolling a d12 (NF pp. 151–153). */
export function CombinationsPanel({ gourmet }: CombinationsPanelProps) {
  const entries = TASTE_PAIRS.map((pair) => ({ ...pair, ...gourmet.combinations[pair.key] }))
  const found = entries.filter((entry) => entry.effect).length

  // No two combinations may have the same effect, counting the choice (NF p. 151).
  const seen = new Map<string, string[]>()
  for (const entry of entries.filter((candidate) => candidate.effect)) {
    const id = `${entry.effect}:${effectOf(entry.effect)?.choices ? (entry.choice ?? '') : ''}`
    seen.set(id, [...(seen.get(id) ?? []), entry.label])
  }
  const duplicates = [...seen.values()].filter((labels) => labels.length > 1)

  return (
    <Panel title="Combinations and effects">
      <p className="fu-note">
        Found {found} of 15. The first time you combine two tastes, roll a d12 for the effect and record it here
        (NF pp. 151–152).
      </p>
      <div className="cookbook-section-combinations">
        {entries.map((entry) => {
          const choices = effectOf(entry.effect)?.choices
          return (
            <div key={entry.key} className="cookbook-section-pair" role="group" aria-label={entry.label}>
              <span className="cookbook-section-pair-label">{entry.label}</span>
              <SelectField
                path={`gourmet.combinations.${entry.key}.effect`}
                label={`${entry.label} effect`}
                hideLabel
                options={EFFECT_OPTIONS}
              />
              {choices ? (
                <SelectField
                  path={`gourmet.combinations.${entry.key}.choice`}
                  label={`${entry.label} choice`}
                  hideLabel
                  options={[{ value: '', label: 'Choose…' }, ...choices.map((choice) => ({ value: choice, label: choice }))]}
                />
              ) : (
                <span aria-hidden="true" />
              )}
            </div>
          )
        })}
      </div>
      {duplicates.map((labels) => (
        <p key={labels.join()} className="fu-warning">
          {labels.join(' and ')} have the same effect; each combination needs a different one.
        </p>
      ))}
      <TextField path="gourmet.notes" label="Notes and useful combinations" rows={3} />
    </Panel>
  )
}
