import { useMemo } from 'react'
import { Panel } from '@/components/Panel'
import { RepeatTable, type RepeatTableColumn } from '@/components/RepeatTable'
import { SKILL_STAT_OPTIONS } from '../constants/stats'
import { useIkCharacter } from '../hooks/useIkCharacter'
import type { IkDerived, IkEntry, IkSkill, StatKey } from '../IronKingdomsFmf.types'
import { sum } from '../utils/sum'

const skillStat = (stat: IkDerived['stat'], skill: IkSkill) =>
  skill.stat && skill.stat !== 'social' ? stat(skill.stat as StatKey) : null

const createSkill = (): IkSkill => ({ name: '', stat: '', level: null })
const createEntry = (): IkEntry => ({ name: '', description: '', page: '' })

const ENTRY_COLUMNS: RepeatTableColumn[] = [
  { key: 'name', label: 'Name', width: 'minmax(120px, 1fr)' },
  { key: 'description', label: 'Description / notes', width: 'minmax(200px, 3fr)', rows: 2 },
  { key: 'page', label: 'Page', width: '60px' },
]

export function SkillsSection() {
  const { derived } = useIkCharacter()
  const { stat } = derived

  const skillColumns = useMemo<RepeatTableColumn[]>(
    () => [
      { key: 'name', label: 'Skill', width: 'minmax(140px, 2fr)' },
      { key: 'stat', label: 'Stat', width: '90px', type: 'select', options: SKILL_STAT_OPTIONS },
      {
        key: 'statValue',
        label: 'Stat value',
        width: '70px',
        type: 'calculated',
        calculate: (row) => skillStat(stat, row as IkSkill),
      },
      { key: 'level', label: 'Level', width: '64px', type: 'number' },
      {
        key: 'total',
        label: 'Total',
        width: '64px',
        type: 'calculated',
        calculate: (row) => {
          const skill = row as IkSkill
          return skill.stat === 'social' ? null : sum(skillStat(stat, skill), skill.level)
        },
      },
    ],
    [stat],
  )

  return (
    <div className="ik-section">
      <Panel title="Skills">
        <p className="ik-note">
          Social skills have no fixed stat; the GM picks one for each roll, so they have no total here.
        </p>
        <RepeatTable path="skills" columns={skillColumns} createRow={createSkill} itemName="skill" />
      </Panel>
      <Panel title="Abilities">
        <RepeatTable path="abilities" columns={ENTRY_COLUMNS} createRow={createEntry} itemName="ability" />
      </Panel>
      <Panel title="Connections">
        <RepeatTable path="connections" columns={ENTRY_COLUMNS} createRow={createEntry} itemName="connection" />
      </Panel>
    </div>
  )
}
