import { NumberField } from '@/components/NumberField'
import { Panel } from '@/components/Panel'
import { RepeatTable, type RepeatTableColumn } from '@/components/RepeatTable'
import { TextField } from '@/components/TextField'
import type { IkArmor, IkGear } from '../IronKingdomsFmf.types'

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
const createArmor = (): IkArmor => ({ name: '', spd: null, def: null, arm: null, notes: '' })

export function GearSection() {
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
        <RepeatTable path="armor" columns={ARMOR_COLUMNS} createRow={createArmor} itemName="armor" />
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
