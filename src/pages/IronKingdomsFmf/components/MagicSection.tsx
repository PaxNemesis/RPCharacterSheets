import { Panel } from '@/components/Panel'
import { RepeatTable, type RepeatTableColumn } from '@/components/RepeatTable'
import { TextField } from '@/components/TextField'
import { useIkCharacter } from '../hooks/useIkCharacter'
import type { IkMechanika, IkSpell } from '../IronKingdomsFmf.types'

const SPELL_COLUMNS: RepeatTableColumn[] = [
  { key: 'name', label: 'Spell', width: 'minmax(140px, 2fr)' },
  { key: 'cost', label: 'Cost', width: '52px', type: 'number' },
  { key: 'rng', label: 'RNG', width: '60px' },
  { key: 'aoe', label: 'AOE', width: '60px' },
  { key: 'pow', label: 'POW', width: '52px', type: 'number' },
  { key: 'up', label: 'UP', width: '52px' },
  { key: 'off', label: 'OFF', width: '52px' },
]

const MECHANIKA_COLUMNS: RepeatTableColumn[] = [
  { key: 'name', label: 'Housing', width: 'minmax(120px, 1fr)' },
  { key: 'runePlate', label: 'Rune plate', width: 'minmax(120px, 1fr)' },
  { key: 'capacitor', label: 'Capacitor', width: 'minmax(100px, 1fr)' },
  { key: 'charges', label: 'Charges', width: '64px', type: 'number' },
  { key: 'notes', label: 'Notes', width: 'minmax(160px, 2fr)', rows: 2 },
]

const createSpell = (): IkSpell => ({ name: '', cost: null, rng: '', aoe: '', pow: null, up: '', off: '' })
const createMechanika = (): IkMechanika => ({ name: '', runePlate: '', capacitor: '', charges: null, notes: '' })

export function MagicSection() {
  const { character } = useIkCharacter()

  return (
    <div className="ik-section">
      {character.settings.magic && (
        <Panel title="Spells">
          <div className="ik-fields">
            <TextField path="arcaneTradition" label="Arcane tradition" />
          </div>
          <RepeatTable path="spells" columns={SPELL_COLUMNS} createRow={createSpell} itemName="spell" />
        </Panel>
      )}
      {character.settings.mechanika && (
        <Panel title="Mechanika">
          <RepeatTable path="mechanika" columns={MECHANIKA_COLUMNS} createRow={createMechanika} itemName="device" />
        </Panel>
      )}
    </div>
  )
}
