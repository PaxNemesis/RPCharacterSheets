import { Panel } from '@/components/Panel'
import { useSheet } from '@/components/SheetProvider'
import { bookEnabled } from '../../constants/books'
import { CLASSES, findClass } from '../../constants/classes'
import { useFuCharacter } from '../../hooks/useFuCharacter'
import { createClass } from '../../utils/createCharacter'
import { classIssues } from '../../utils/rules'
import { ClassCard, HeroicSkillsPanel } from './components'

export function ClassesSection() {
  const { character, derived } = useFuCharacter()
  const { set } = useSheet()
  const { classes, settings } = character
  const classNames = CLASSES.filter((data) => bookEnabled(settings, data.book)).map((data) => data.name)
  const mastered = classes.filter((entry) => (entry.level ?? 0) >= 10).length

  const remove = (index: number) => {
    const name = classes[index].name.trim() || `class ${index + 1}`
    if (window.confirm(`Remove ${name} and its Skills?`)) set('classes', classes.filter((_, other) => other !== index))
  }

  return (
    <div className="fu-section">
      <Panel title="Classes">
        <p className="fu-note">
          Level {derived.level}. A new character puts 5 levels into two or three classes (p. 154). Each class level gives one
          Skill Level, a class reaches at most level 10, and you can never have more than three non-mastered classes (p. 227).
          Free benefits count toward HP, MP, IP and martial equipment automatically.
        </p>
        {derived.tooManyClasses && <p className="fu-warning">You have more than three non-mastered classes.</p>}
        <button type="button" className="fu-start" onClick={() => set('classes', [...classes, createClass()])}>
          + Add class
        </button>
      </Panel>
      {classes.map((entry, index) => (
        <ClassCard
          key={index}
          index={index}
          entry={entry}
          data={findClass(settings, entry.name)}
          classNames={classNames}
          issues={classIssues(character, entry)}
          onRemove={() => remove(index)}
        />
      ))}
      <HeroicSkillsPanel character={character} mastered={mastered} />
    </div>
  )
}
