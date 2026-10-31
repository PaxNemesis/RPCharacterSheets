import { NumberField } from '@/components/NumberField'
import { Panel } from '@/components/Panel'
import { RepeatTable, type RepeatTableColumn } from '@/components/RepeatTable'
import { TextField } from '@/components/TextField'
import { MARTIAL } from '../../constants/attributes'
import { SLOTS } from '../../constants/slots'
import { useFuCharacter } from '../../hooks/useFuCharacter'
import type { FuBackpackItem } from '../../types'
import { ItemSlot } from './components'

const BACKPACK_COLUMNS: RepeatTableColumn[] = [
  { key: 'name', label: 'Item', width: 'minmax(140px, 1fr)' },
  { key: 'quantity', label: 'Qty', width: '56px', type: 'number' },
  { key: 'notes', label: 'Notes', width: 'minmax(200px, 3fr)', rows: 2 },
]

const createBackpackItem = (): FuBackpackItem => ({ name: '', quantity: null, notes: '' })

export function EquipmentSection() {
  const { character, derived } = useFuCharacter()
  const allowed = MARTIAL.filter(({ key }) => derived.martial[key]).map(({ label }) => label.toLowerCase())

  return (
    <div className="fu-section">
      <Panel title="Equipped items">
        <p className="fu-note">
          Your classes let you equip {allowed.length > 0 ? allowed.join(', ') : 'no martial items'}. Use Fill from rulebook
          for basic weapons, armor and shields (pp. 130–133); Defense, Magic Defense and Initiative bonuses go to the
          Character tab.
        </p>
        {derived.equipmentWarnings.map((warning) => (
          <p key={warning} className="fu-warning">
            {warning}
          </p>
        ))}
      </Panel>
      <div className="fu-columns">
        {SLOTS.map((slot) => (
          <ItemSlot key={slot.key} slot={slot} item={character.equipment[slot.key]} derived={derived} />
        ))}
      </div>
      <div className="fu-columns">
        <Panel title="Backpack & notes">
          <RepeatTable path="backpack" columns={BACKPACK_COLUMNS} createRow={createBackpackItem} itemName="item" />
        </Panel>
        <Panel title="Zenit">
          <NumberField path="zenit" label="Zenit" hideLabel size="lg" />
          <TextField path="notes.wealth" label="Other valuables" rows={3} />
        </Panel>
      </div>
    </div>
  )
}
