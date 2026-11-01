import { Panel } from '@/components/Panel'
import { RepeatTable } from '@/components/RepeatTable'
import { useSheet } from '@/components/SheetProvider'
import { ARCHETYPE_DATA, archetypeBenefitRef, BENEFIT_OR_CAREER_XP, BENEFIT_XP, findArchetype } from '../../../constants/archetypes'
import { findRace } from '../../../constants/races'
import { useIkCharacter } from '../../../hooks/useIkCharacter'
import type { IkEntry } from '../../../types'
import { careersOf } from '../../../utils/rules'
import { entryColumns } from '../utils/entryColumns'

const createEntry = (): IkEntry => ({ name: '', description: '', page: '' })
const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

/** The archetype's own rules, how many benefits XP allows, and the benefits the character has. */
export function ArchetypePanel() {
  const { character } = useIkCharacter()
  const { set } = useSheet()
  const archetype = findArchetype(character.identity.archetype)
  const benefits = character.archetypeBenefits ?? []
  const xp = character.identity.xp ?? 0
  const fromXp = BENEFIT_XP.filter((total) => xp >= total).length
  const fromXpOrCareer = BENEFIT_OR_CAREER_XP.filter((total) => xp >= total).length

  // Benefits the race and careers give for free, such as a trollkin's Tough.
  const race = character.settings.raceRules ? findRace(character.identity.race) : undefined
  const granted = [
    ...(race?.archetypeBenefits ?? []).map((name) => ({ name, source: race?.name ?? '' })),
    ...careersOf(character).flatMap((career) => (career.archetypeBenefits ?? []).map((name) => ({ name, source: career.name }))),
  ]
  const missing = granted.filter((grant) => !benefits.some((row) => same(row.name, grant.name)))
  const addMissing = () =>
    set('archetypeBenefits', [
      ...benefits,
      ...missing.map((grant) => ({ name: grant.name, description: '', page: archetypeBenefitRef(grant.name) })),
    ])

  const suggestions = (archetype ? [archetype] : ARCHETYPE_DATA).flatMap((data) => data.benefits.map((benefit) => benefit.name))

  return (
    <Panel title="Archetype">
      {archetype ? (
        <p className="ik-note">
          <strong>{archetype.name}</strong> (p. {archetype.page}): {archetype.summary}
        </p>
      ) : (
        <p className="ik-note">
          {character.identity.archetype
            ? `${character.identity.archetype} is not a core rules archetype, so there is no benefit list for it.`
            : 'Pick an archetype on the Character tab to see what it gives and its benefits.'}
        </p>
      )}
      <p className="ik-note">
        Benefits: one chosen at creation, plus {fromXp} from XP so far
        {fromXpOrCareer > 0 && ` and up to ${fromXpOrCareer} more if taken instead of a new career`} (XP table p. 154). Benefits
        from your race or careers come on top.
      </p>
      {missing.length > 0 && (
        <p className="ik-warning" role="status">
          Not on the sheet yet: {missing.map((grant) => `${grant.name} (${grant.source})`).join(', ')}.{' '}
          <button type="button" onClick={addMissing}>
            Add {missing.length === 1 ? 'it' : 'them'}
          </button>
        </p>
      )}
      <RepeatTable path="archetypeBenefits" columns={entryColumns(suggestions, archetypeBenefitRef)} createRow={createEntry} itemName="benefit" />
    </Panel>
  )
}
