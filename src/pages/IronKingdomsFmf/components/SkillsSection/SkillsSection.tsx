import { useMemo } from 'react'
import { Panel } from '@/components/Panel'
import { RepeatTable, type RepeatTableColumn } from '@/components/RepeatTable'
import { abilityNames } from '../../constants/abilities'
import { knownSkillStat, SKILL_SUGGESTIONS } from '../../constants/skills'
import { SKILL_STAT_OPTIONS } from '../../constants/stats'
import { useIkCharacter } from '../../hooks/useIkCharacter'
import type { IkDerived, IkEntry, IkSkill } from '../../types'
import { careersOf } from '../../utils/rules'
import { alphabetical } from '../../utils/alphabetical'
import { sum } from '../../utils/sum'
import { StartingPackagePanel } from './components'

/** The skill's stat: the one picked, or the book's governing stat for a known skill. */
const effectiveStat = (skill: IkSkill) => skill.stat || knownSkillStat(skill.name ?? '') || ''

const statValue = (stat: IkDerived['stat'], skill: IkSkill) => {
  const key = effectiveStat(skill)
  return key && key !== 'social' ? stat(key) : null
}

const createSkill = (): IkSkill => ({ name: '', stat: '', level: null })
const createEntry = (): IkEntry => ({ name: '', description: '', page: '' })
const STAT_OPTIONS = [{ value: '', label: 'Auto' }, ...SKILL_STAT_OPTIONS.slice(1)]

const entryColumns = (suggestions?: string[]): RepeatTableColumn[] => [
  { key: 'name', label: 'Name', width: 'minmax(120px, 1fr)', suggestions },
  { key: 'description', label: 'Description / notes', width: 'minmax(200px, 3fr)', rows: 2 },
  { key: 'page', label: 'Page', width: '60px' },
]

export function SkillsSection() {
  const { character, derived } = useIkCharacter()
  const { stat, skillMax } = derived
  const careerRules = character.settings.careerRules
  const careers = careersOf(character)

  const skillColumns = useMemo<RepeatTableColumn[]>(
    () => [
      { key: 'name', label: 'Skill', width: 'minmax(140px, 2fr)', suggestions: SKILL_SUGGESTIONS },
      { key: 'stat', label: 'Stat', width: '90px', type: 'select', options: STAT_OPTIONS },
      { key: 'statValue', label: 'Stat value', width: '70px', type: 'calculated', calculate: (row) => statValue(stat, row as IkSkill) },
      { key: 'level', label: 'Level', width: '64px', type: 'number' },
      ...(careerRules
        ? [{ key: 'max', label: 'Max', width: '56px', type: 'calculated', calculate: (row) => skillMax((row as IkSkill).name ?? '') } satisfies RepeatTableColumn]
        : []),
      {
        key: 'total',
        label: 'Total',
        width: '64px',
        type: 'calculated',
        calculate: (row) => {
          const skill = row as IkSkill
          return effectiveStat(skill) === 'social' ? null : sum(statValue(stat, skill), skill.level)
        },
      },
    ],
    [stat, skillMax, careerRules],
  )

  const abilitySuggestions = careers.length > 0
    ? alphabetical([...new Set(careers.flatMap((career) => career.abilityList))])
    : abilityNames(character.settings)
  const overMax = careers.length > 0
    ? character.skills.filter((skill) => {
        const max = skillMax(skill.name ?? '')
        return skill.name && skill.level !== null && (max === null || skill.level > max)
      })
    : []

  return (
    <div className="ik-section">
      {careerRules && <StartingPackagePanel />}
      <Panel title="Skills">
        <p className="ik-note">
          Stat “Auto” uses the skill’s governing stat from the book (pp. 172–173). Social skills have no fixed stat; the
          GM picks one for each roll, so they have no total here.
          {careerRules && ' Max comes from your careers and level; blank means none of your careers offer the skill.'}
        </p>
        <RepeatTable path="skills" columns={skillColumns} createRow={createSkill} itemName="skill" />
        {overMax.length > 0 && (
          <p className="ik-warning" role="status">
            Above what your careers and level allow: {overMax.map((skill) => skill.name).join(', ')}.
          </p>
        )}
      </Panel>
      <Panel title="Abilities">
        <RepeatTable path="abilities" columns={entryColumns(abilitySuggestions)} createRow={createEntry} itemName="ability" />
      </Panel>
      <Panel title="Connections">
        <RepeatTable path="connections" columns={entryColumns()} createRow={createEntry} itemName="connection" />
      </Panel>
    </div>
  )
}
