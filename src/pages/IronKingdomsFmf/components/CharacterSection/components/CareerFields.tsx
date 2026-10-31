import { SelectField } from '@/components/SelectField'
import { useSheet } from '@/components/SheetProvider'
import { TextField } from '@/components/TextField'
import { CAREERS, findCareer } from '../../../constants/careers'
import { useIkCharacter } from '../../../hooks/useIkCharacter'

const CAREER_OPTIONS = [{ value: '', label: 'Choose…' }, ...CAREERS.map((c) => ({ value: c.name, label: c.name }))]

/** Starting careers plus any learned later; free text when career rules are off. */
export function CareerFields() {
  const { character } = useIkCharacter()
  const { set } = useSheet()
  const { careerList } = character.identity

  if (!character.settings.careerRules) {
    return <TextField path="identity.careers" label="Careers" />
  }

  const list = careerList.length >= 2 ? careerList : [...careerList, '', ''].slice(0, 2)
  const careers = list.map((name) => findCareer(name ?? ''))
  const [first, second] = careers
  const notes = careers.flatMap((career, index) => {
    if (!career) return []
    const other = index === 0 ? second : index === 1 ? first : undefined
    return [
      career.prerequisites !== 'None' && `${career.name} requires: ${career.prerequisites}.`,
      career.startingOnly && index >= 2 && `${career.name} can only be a starting career.`,
      career.pairsWith && index < 2 && other && !career.pairsWith.includes(other.name) &&
        `${career.name} must be paired with ${career.pairsWith.join(', ')}.`,
    ].filter((note): note is string => Boolean(note))
  })

  return (
    <>
      {list.map((name, index) => {
        const career = findCareer(name ?? '')
        return (
          <div key={index} className="ik-career">
            <SelectField
              path={`identity.careerList.${index}`}
              label={index < 2 ? `Starting career ${index + 1}` : `Career ${index + 1}`}
              options={CAREER_OPTIONS}
            />
            {career?.variants && (
              <SelectField
                path={`identity.careerVariants.${career.name}`}
                label={career.name === 'Priest' ? 'Faith' : 'Element'}
                options={[{ value: '', label: 'Choose…' }, ...career.variants.map((v) => ({ value: v.label, label: v.label }))]}
              />
            )}
            {index >= 2 && (
              <button
                type="button"
                className="ik-start"
                aria-label={`Remove career ${index + 1}`}
                onClick={() => set('identity.careerList', list.filter((_, other) => other !== index))}
              >
                Remove
              </button>
            )}
          </div>
        )
      })}
      <button type="button" className="ik-start ik-career-add" onClick={() => set('identity.careerList', [...list, ''])}>
        + Add career
      </button>
      {notes.length > 0 && <p className="ik-note ik-wide">{notes.join(' ')}</p>}
    </>
  )
}
