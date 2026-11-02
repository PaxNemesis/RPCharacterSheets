import { SelectField } from '@/components/SelectField'
import { TextField } from '@/components/TextField'
import { ARCHETYPES, findRace, RACES, TRADITIONS } from '../../../constants/races'
import { useIkCharacter } from '../../../hooks/useIkCharacter'
import { alphabetical } from '@/utils/alphabetical'

const options = (values: string[], empty = 'Choose…') => [
  { value: '', label: empty },
  ...values.map((value) => ({ value, label: value })),
]

const HUMAN_BONUS = [
  { value: '', label: 'Choose…' },
  { value: 'phy', label: '+1 PHY' },
  { value: 'agl', label: '+1 AGL' },
  { value: 'int', label: '+1 INT' },
]

/** Race, archetype and the choices they bring; free text when race rules are off. */
export function RaceFields() {
  const { character } = useIkCharacter()
  const { identity } = character

  if (!character.settings.raceRules) {
    return (
      <>
        <TextField path="identity.race" label="Race" />
        <TextField path="identity.archetype" label="Archetype" />
      </>
    )
  }

  const race = findRace(identity.race)
  const archetypes = race?.archetypes ?? ARCHETYPES
  // Keep a value that doesn't match the book visible instead of silently dropping it.
  const withCurrent = (values: string[], current: string) =>
    current && !values.includes(current) ? [...values, current] : values

  return (
    <>
      <SelectField
        path="identity.race"
        label="Race"
        options={options(withCurrent(alphabetical(RACES.map((r) => r.name)), identity.race))}
      />
      <SelectField path="identity.archetype" label="Archetype" options={options(withCurrent(archetypes, identity.archetype))} />
      {race?.name === 'Human' && (
        <SelectField path="identity.humanBonus" label="Exceptional Potential" options={HUMAN_BONUS} />
      )}
      {identity.archetype === 'Gifted' && (
        <SelectField
          path="arcaneTradition"
          label="Arcane tradition"
          options={options(withCurrent(TRADITIONS.map((t) => t.value), character.arcaneTradition))}
        />
      )}
      {race && <p className="ik-note ik-wide">{race.notes.join(' ')}</p>}
    </>
  )
}
