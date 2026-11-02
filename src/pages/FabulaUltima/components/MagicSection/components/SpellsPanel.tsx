import { Panel } from '@/components/Panel'
import { RepeatTable, type RepeatTableColumn } from '@/components/RepeatTable'
import { useSheet } from '@/components/SheetProvider'
import { alphabetical, compareNames } from '@/utils/alphabetical'
import { bookEnabled, bookRef } from '../../../constants/books'
import { SPELLS } from '../../../constants/spells'
import type { FuCharacter, FuSpell, SpellData } from '../../../types'

const createSpell = (): FuSpell => ({ name: '', offensive: '', mp: '', targets: '', duration: '', notes: '' })

const spellFromRulebook = (spell: SpellData): FuSpell => ({
  name: spell.name,
  offensive: spell.offensive ? 'yes' : '',
  mp: spell.mp,
  targets: spell.targets,
  duration: spell.duration,
  notes: `${spell.className}, ${bookRef(spell.book, spell.page)}`,
})

type SpellsPanelProps = {
  character: FuCharacter
}

export function SpellsPanel({ character }: SpellsPanelProps) {
  const { set } = useSheet()
  const spells = SPELLS.filter((spell) => bookEnabled(character.settings, spell.book)).sort((a, b) =>
    compareNames(a.name, b.name),
  )
  const groups = alphabetical([...new Set(spells.map((spell) => spell.className))])
  const columns: RepeatTableColumn[] = [
    { key: 'name', label: 'Spell', width: 'minmax(140px, 2fr)', suggestions: [...new Set(spells.map((spell) => spell.name))] },
    {
      key: 'offensive',
      label: 'Offensive',
      width: '96px',
      type: 'select',
      options: [
        { value: '', label: '—' },
        { value: 'yes', label: 'Offensive' },
      ],
    },
    { key: 'mp', label: 'MP', width: '80px' },
    { key: 'targets', label: 'Targets', width: 'minmax(120px, 1.5fr)' },
    { key: 'duration', label: 'Duration', width: 'minmax(100px, 1fr)', suggestions: ['Instantaneous', 'Scene'] },
    { key: 'notes', label: 'Effect & notes', width: 'minmax(200px, 3fr)', rows: 2 },
  ]

  const add = (index: string) => {
    const spell = spells[Number(index)]
    if (spell) set('spells', [...character.spells, spellFromRulebook(spell)])
  }

  return (
    <Panel
      title="Spells"
      actions={
        <select aria-label="Add a spell from the rulebook" value="" onChange={(event) => add(event.target.value)}>
          <option value="">Add from rulebook…</option>
          {groups.map((group) => (
            <optgroup key={group} label={group}>
              {spells.map((spell, index) =>
                spell.className === group ? (
                  <option key={spell.name} value={index}>
                    {spell.name} ({spell.mp} MP)
                  </option>
                ) : null,
              )}
            </optgroup>
          ))}
        </select>
      }
    >
      <p className="fu-note">
        Spells you have learned. Offensive spells need a Magic Check (p. 116). Classes like Chimerist learn spells from
        other sources: type those in.
      </p>
      <RepeatTable path="spells" columns={columns} createRow={createSpell} itemName="spell" />
    </Panel>
  )
}
