import { useState } from 'react'
import { NumberField } from '@/components/NumberField'
import { Panel } from '@/components/Panel'
import { RepeatTable, type RepeatTableColumn } from '@/components/RepeatTable'
import { useSheet } from '@/components/SheetProvider'
import { TextField } from '@/components/TextField'
import { MARTIAL } from '../../constants/attributes'
import { SLOTS } from '../../constants/slots'
import { useFuCharacter } from '../../hooks/useFuCharacter'
import type { FuBackpackItem, SlotKey } from '../../types'
import { ItemSlot, StoredEquipment } from './components'
import { emptyFor, unequip } from './utils/equip'
import './EquipmentSection.styles.css'

const BACKPACK_COLUMNS: RepeatTableColumn[] = [
  { key: 'name', label: 'Item', width: 'minmax(140px, 1fr)' },
  { key: 'quantity', label: 'Qty', width: '56px', type: 'number' },
  { key: 'notes', label: 'Notes', width: 'minmax(200px, 3fr)', rows: 2 },
]

const createBackpackItem = (): FuBackpackItem => ({ name: '', quantity: null, notes: '' })

export function EquipmentSection() {
  const { character, derived } = useFuCharacter()
  const { set } = useSheet()
  const [open, setOpen] = useState<SlotKey[]>([])
  const toggle = (key: SlotKey) =>
    setOpen((current) => (current.includes(key) ? current.filter((other) => other !== key) : [...current, key]))
  const store = (key: SlotKey) => {
    const next = unequip(character, key)
    set('equipment', next.equipment)
    set('stored', next.stored)
    setOpen((current) => current.filter((other) => other !== key))
  }
  const clear = (key: SlotKey) => {
    const item = character.equipment[key]
    const name = item.name.trim() || 'this item'
    if (window.confirm(`Delete ${name}? It will be removed from the sheet. Use Unequip instead to keep it in the backpack.`)) {
      set(`equipment.${key}`, emptyFor(key))
    }
  }

  return (
    <div className="fu-section equipment-section-container">
      <Panel title="Equipped items">
        <div className="equipment-section-martial">
          <span className="equipment-section-martial-label">May equip</span>
          {MARTIAL.map(({ key, label }) => (
            <span key={key} className={derived.martial[key] ? 'equipment-section-tag' : 'equipment-section-tag equipment-section-tag-off'}>
              {label}
            </span>
          ))}
        </div>
        {derived.equipmentWarnings.map((warning) => (
          <p key={warning} className="fu-warning">
            {warning}
          </p>
        ))}
        <div className="equipment-section-slots">
          {SLOTS.map((slot) => (
            <ItemSlot
              key={slot.key}
              slot={slot}
              item={character.equipment[slot.key]}
              derived={derived}
              open={open.includes(slot.key)}
              onToggle={() => toggle(slot.key)}
              onUnequip={() => store(slot.key)}
              onDelete={() => clear(slot.key)}
            />
          ))}
        </div>
        <p className="fu-note">
          Click a slot to edit it. Start typing a name to pick a basic weapon, armor or shield (pp. 130–133) and fill in
          its stats. Defense, Magic Defense and Initiative bonuses are added on the Character tab. Martial equipment comes from your classes and Quirk.
        </p>
      </Panel>
      <Panel title="Backpack & notes">
        <div className="equipment-section-wealth">
          <NumberField path="zenit" label="Zenit" />
          <TextField path="notes.wealth" label="Other valuables" />
        </div>
        <h3 className="equipment-section-subheading">Stored equipment</h3>
        <StoredEquipment character={character} />
        <h3 className="equipment-section-subheading">Other items</h3>
        <RepeatTable path="backpack" columns={BACKPACK_COLUMNS} createRow={createBackpackItem} itemName="item" />
      </Panel>
    </div>
  )
}
