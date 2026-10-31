import { Panel } from '@/components/Panel'
import { RepeatTable, type RepeatTableColumn } from '@/components/RepeatTable'
import { bookEnabled, bookRef } from '../../../constants/books'
import { HEROIC_SKILLS } from '../../../constants/heroicSkills'
import type { FuCharacter, FuEntry } from '../../../types'

const createHeroicSkill = (): FuEntry => ({ name: '', notes: '' })

type HeroicSkillsPanelProps = {
  character: FuCharacter
  /** Number of classes at level 10. */
  mastered: number
}

export function HeroicSkillsPanel({ character, mastered }: HeroicSkillsPanelProps) {
  const available = HEROIC_SKILLS.filter((skill) => bookEnabled(character.settings, skill.book))
  const columns: RepeatTableColumn[] = [
    { key: 'name', label: 'Heroic Skill', width: 'minmax(160px, 1fr)', suggestions: available.map((skill) => skill.name) },
    { key: 'notes', label: 'Notes', width: 'minmax(220px, 3fr)', rows: 2 },
  ]
  const references = character.heroicSkills.flatMap(({ name }) => {
    const data = available.find((skill) => skill.name.toLowerCase() === name.trim().toLowerCase())
    return data ? [`${data.name} ${bookRef(data.book, data.page)}`] : []
  })

  return (
    <Panel title="Heroic skills">
      <p className="fu-note">
        Mastering a class gives one Heroic Skill (p. 228). Mastered classes: {mastered}. Extra HP, Extra MP and Extra IP
        are added to your maximums.
      </p>
      <RepeatTable path="heroicSkills" columns={columns} createRow={createHeroicSkill} itemName="Heroic Skill" />
      {references.length > 0 && <p className="fu-note">Pages: {references.join(', ')}.</p>}
    </Panel>
  )
}
