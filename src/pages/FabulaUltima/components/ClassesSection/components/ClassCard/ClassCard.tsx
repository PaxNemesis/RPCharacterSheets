import { Icon } from '@/components/Icon'
import { NumberField } from '@/components/NumberField'
import { Panel } from '@/components/Panel'
import { RepeatTable, type RepeatTableColumn } from '@/components/RepeatTable'
import { SelectField } from '@/components/SelectField'
import { SheetProvider } from '@/components/SheetProvider'
import { TextField } from '@/components/TextField'
import { alphabetical } from '@/utils/alphabetical'
import { MARTIAL } from '../../../../constants/attributes'
import { bookRef } from '../../../../constants/books'
import type { ClassData, FuClass, FuClassSkill } from '../../../../types'
import { classLevel } from '../../../../utils/rules'
import { CustomBenefits } from './components'
import './ClassCard.styles.css'

const BENEFIT_CHOICES = [
  { value: '', label: 'Choose…' },
  { value: 'hp', label: '+5 max HP' },
  { value: 'mp', label: '+5 max MP' },
]

const createSkill = (): FuClassSkill => ({ name: '', level: 1, notes: '' })

const describeBenefits = ({ benefits }: ClassData) =>
  [
    benefits.hp && `+${benefits.hp} max HP`,
    benefits.mp && `+${benefits.mp} max MP`,
    benefits.ip && `+${benefits.ip} max IP`,
    benefits.hpOrMp && '+5 max HP or MP',
    ...(benefits.martial ?? []).map((key) => MARTIAL.find((martial) => martial.key === key)?.label.toLowerCase()),
    benefits.ritualism && 'Ritualism rituals',
    benefits.other,
  ]
    .filter(Boolean)
    .join(', ')

type ClassCardProps = {
  index: number
  entry: FuClass
  /** The matching rulebook class, if any. */
  data: ClassData | undefined
  classNames: string[]
  issues: string[]
  onRemove: () => void
}

export function ClassCard({ index, entry, data, classNames, issues, onRemove }: ClassCardProps) {
  const columns: RepeatTableColumn[] = [
    { key: 'name', label: 'Skill', width: 'minmax(150px, 2fr)', suggestions: data && alphabetical(data.skills.map((skill) => skill.name)) },
    { key: 'level', label: 'SL', width: '56px', type: 'number' },
    {
      key: 'max',
      label: 'Max',
      width: '56px',
      type: 'calculated',
      calculate: (row) => {
        const name = String(row.name ?? '').trim().toLowerCase()
        return data?.skills.find((skill) => skill.name.toLowerCase() === name)?.max ?? null
      },
    },
    { key: 'notes', label: 'Notes', width: 'minmax(200px, 3fr)', rows: 2 },
  ]

  return (
    <SheetProvider path={`classes.${index}`}>
      <Panel
        title={entry.name.trim() || `Class ${index + 1}`}
        className="class-card-container"
        actions={
          <button
            type="button"
            className="class-card-remove"
            onClick={onRemove}
            title="Remove class"
            aria-label={`Remove ${entry.name.trim() || `class ${index + 1}`}`}
          >
            <Icon name="delete" className="class-card-icon" />
          </button>
        }
      >
        <div className="fu-fields">
          <TextField path="name" label="Class" suggestions={classNames} />
          <NumberField value={classLevel(entry)} label="Class level" />
          {data?.benefits.hpOrMp && <SelectField path="benefitChoice" label="Free benefit" options={BENEFIT_CHOICES} />}
        </div>
        {data && (
          <p className="fu-note">
            Free benefits: {describeBenefits(data)}. Skills and their maximum levels: {bookRef(data.book, data.page)}.
          </p>
        )}
        {!data && entry.name.trim() && <CustomBenefits />}
        {classLevel(entry) >= 10 && <p className="fu-note">Mastered: acquire one Heroic Skill (p. 228).</p>}
        <RepeatTable path="skills" columns={columns} createRow={createSkill} itemName="skill" />
        <TextField path="notes" label="Class notes" rows={2} />
        {issues.map((issue) => (
          <p key={issue} className="fu-warning">
            {issue}
          </p>
        ))}
      </Panel>
    </SheetProvider>
  )
}
