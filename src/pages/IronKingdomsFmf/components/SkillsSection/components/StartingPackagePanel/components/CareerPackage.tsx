/* oxlint-disable react/no-array-index-key -- The skill list comes from the rulebook and never changes order. */
import type { CareerData, IkCharacter } from '../../../../../types'
import { variantOf } from '../../../../../utils/rules'
import { choiceKey, type PackageSelection } from '../utils/startingPackage'

type CareerPackageProps = {
  career: CareerData
  character: IkCharacter
  selection: PackageSelection
  onSelect: (key: string, picks: string[]) => void
}

const list = (values: string[]) => (values.length > 0 ? values.join(', ') : '—')

export function CareerPackage({ career, character, selection, onSelect }: CareerPackageProps) {
  const variant = variantOf(character, career)
  const skills = [...career.skills, ...(variant?.skills ?? [])]

  return (
    <div className="starting-package-career">
      <h3>
        {career.name}
        {variant && ` (${variant.label})`}
      </h3>
      {career.variants && !variant && (
        <p className="ik-warning">Choose the {(career.variantLabel ?? 'version').toLowerCase()} on the Character tab.</p>
      )}
      <dl>
        <dt>Skills</dt>
        <dd>
          {skills.map((entry, index) => {
            if (!('choose' in entry)) return <span key={index}>{`${entry.name} ${entry.level}`}</span>
            const key = choiceKey(career, index)
            const picks = selection[key] ?? []
            return Array.from({ length: entry.choose }, (_, slot) => (
              <select
                key={`${index}-${slot}`}
                aria-label={`${career.name}: choose a skill${entry.choose > 1 ? ` (${slot + 1} of ${entry.choose})` : ''}`}
                value={picks[slot] ?? ''}
                onChange={(event) => {
                  const next = [...picks]
                  next[slot] = event.target.value
                  onSelect(key, next)
                }}
              >
                <option value="">Choose…</option>
                {entry.options
                  .filter((option) => option.name === picks[slot] || !picks.includes(option.name))
                  .map((option) => (
                    <option key={option.name} value={option.name}>
                      {`${option.name} ${option.level}`}
                    </option>
                  ))}
              </select>
            ))
          })}
        </dd>
        <dt>Abilities</dt>
        <dd>{list([...career.abilities, ...(variant?.abilities ?? [])])}</dd>
        <dt>Connections</dt>
        <dd>{list([...career.connections, ...(variant?.connections ?? [])])}</dd>
        {(career.spells.length > 0 || career.variants) && (
          <>
            <dt>Spells</dt>
            <dd>{list([...career.spells, ...(variant?.spells ?? [])])}</dd>
          </>
        )}
        <dt>Assets</dt>
        <dd>{list([...(career.gold > 0 ? [`${career.gold} gc`] : []), ...career.assets])}</dd>
      </dl>
      {variant?.stats && <p className="ik-note">This {(career.variantLabel ?? 'version').toLowerCase()} also raises a stat and its maximum by 1.</p>}
      {career.special && <p className="ik-note">{career.special}</p>}
    </div>
  )
}
