import { NumberField } from '@/components/NumberField'
import { Panel } from '@/components/Panel'
import { RepeatTable, type RepeatTableColumn, type RepeatTableRowAction } from '@/components/RepeatTable'
import { useSheet } from '@/components/SheetProvider'
import { TextField } from '@/components/TextField'
import { useIkCharacter } from '../hooks/useIkCharacter'
import type { IkGear } from '../types'
import { createArmor } from '../utils/createCharacter'
import { toStored } from '../utils/storage'
import { StoredEquipment } from './StoredEquipment'

const GEAR_COLUMNS: RepeatTableColumn[] = [
  { key: 'name', label: 'Name', width: 'minmax(140px, 1fr)' },
  { key: 'notes', label: 'Benefit / notes', width: 'minmax(200px, 3fr)', rows: 2 },
  { key: 'quantity', label: 'Qty', width: '56px', type: 'number' },
]

const ARMOR_COLUMNS: RepeatTableColumn[] = [
  { key: 'name', label: 'Name', width: 'minmax(140px, 1fr)' },
  { key: 'spd', label: 'SPD', width: '52px', type: 'number' },
  { key: 'def', label: 'DEF', width: '52px', type: 'number' },
  { key: 'arm', label: 'ARM', width: '52px', type: 'number' },
  { key: 'notes', label: 'Description / notes', width: 'minmax(200px, 3fr)', rows: 2 },
]

const createGear = (): IkGear => ({ name: '', notes: '', quantity: null })

export function GearSection() {
  const { character } = useIkCharacter()
  const { set } = useSheet()
  const storeArmor: RepeatTableRowAction = {
    icon: 'archive',
    label: 'Store',
    title: 'Take off and move to stored armor',
    onClick: (row) => set('stored', [...character.stored, toStored('armor', row)]),
  }

  return (
    <div className="ik-section">
      <Panel title="Gear">
        <RepeatTable path="gear" columns={GEAR_COLUMNS} createRow={createGear} itemName="item" />
      </Panel>
      <Panel title="Worn armor">
        <p className="ik-note">
          The DEF and ARM modifiers of everything listed here are added to DEF and ARM on the Character tab. The SPD
          modifier changes your movement, not your DEF or Initiative.
        </p>
        <RepeatTable path="armor" columns={ARMOR_COLUMNS} createRow={createArmor} itemName="armor" rowAction={storeArmor} />
      </Panel>
      <Panel title="Stored armor">
        <StoredEquipment
          kinds={['armor']}
          showUnknown
          emptyText="Store armor you aren't wearing to keep it here with its values. Stored armor doesn't change your stats. Swap it for what you wear to change armor."
        />
      </Panel>
      <div className="ik-columns">
        <Panel title="Gold">
          <NumberField path="gold" label="Gold crowns" size="lg" />
        </Panel>
        <Panel title="Other wealth & property">
          <TextField path="wealth" label="Wealth & property" hideLabel rows={3} />
        </Panel>
      </div>
    </div>
  )
}
