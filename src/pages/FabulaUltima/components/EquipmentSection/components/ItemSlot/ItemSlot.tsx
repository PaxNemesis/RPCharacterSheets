import { useId } from 'react'
import { CheckboxField } from '@/components/CheckboxField'
import { SelectField } from '@/components/SelectField'
import { SheetProvider, useSheet } from '@/components/SheetProvider'
import { TextField } from '@/components/TextField'
import type { FuDerived, FuItem, ItemKind, SlotKey } from '../../../../types'
import { describeItem } from '../../utils/describeItem'
import { hasContent } from '../../utils/equip'
import { DefenseFields, WeaponFields } from './components'
import { rulebookItems } from './utils/itemFromRulebook'
import './ItemSlot.styles.css'

const KIND_LABELS: Record<ItemKind, string> = {
  '': 'Empty',
  weapon: 'Weapon',
  shield: 'Shield',
  armor: 'Armor',
  accessory: 'Accessory',
}

type ItemSlotProps = {
  slot: { key: SlotKey; label: string; kinds: ItemKind[] }
  item: FuItem
  derived: FuDerived
  open: boolean
  onToggle: () => void
  /** Moves the item to stored equipment in the backpack. */
  onUnequip: () => void
}

/** One row of the equipment list: a summary of the item, with its fields underneath while open. */
export function ItemSlot({ slot, item, derived, open, onToggle, onUnequip }: ItemSlotProps) {
  const { set } = useSheet()
  const editorId = useId()
  const path = `equipment.${slot.key}`
  const presets = rulebookItems(slot.kinds)
  const holdsWeapons = slot.kinds.includes('weapon')
  const details = item.kind === '' ? '' : describeItem(item)
  const empty = !item.name.trim() && (item.kind === '' || item.kind === 'armor' || !details)
  const name = item.name.trim() || (item.kind === 'armor' ? 'No armor' : empty ? 'Empty' : `Unnamed ${item.kind}`)

  // Picking a basic item fills in its stats; the item's own notes are kept.
  const pick = (value: string) => {
    const preset = presets.get(value)
    if (preset) set(path, { ...preset, quality: item.quality })
  }
  // Typing a name into an empty hand makes it a weapon, so the name isn't lost.
  const rename = (value: string) => {
    if (item.kind === '' && holdsWeapons && value.trim()) set(`${path}.kind`, 'weapon')
  }
  const placeholder =
    item.kind === 'armor' ? 'No armor, or type to pick basic armor' : holdsWeapons ? 'Type to pick a basic weapon or shield' : undefined

  return (
    <SheetProvider path={path}>
      <div className="item-slot-container">
        <div className="item-slot-row">
          <button type="button" className="item-slot-toggle" aria-expanded={open} aria-controls={editorId} onClick={onToggle}>
            <span className="item-slot-label">{slot.label}</span>
            <span className="item-slot-summary">
              <span className={empty ? 'item-slot-name item-slot-empty' : 'item-slot-name'}>{name}</span>
              {details && <span className="item-slot-details">{details}</span>}
            </span>
            <span className="item-slot-action">{open ? 'Done' : empty ? 'Add' : 'Edit'}</span>
          </button>
          {hasContent(item) && (
            <button
              type="button"
              className="item-slot-unequip"
              onClick={onUnequip}
              title="Move to stored equipment in the backpack"
              aria-label={`Unequip ${item.name.trim() || slot.label.toLowerCase()}`}
            >
              Unequip
            </button>
          )}
        </div>
        {open && (
          <div id={editorId} className="item-slot-editor">
            <div className="item-slot-name-row">
              {slot.kinds.length > 1 && (
                <SelectField
                  path="kind"
                  label="Holding"
                  options={slot.kinds.map((kind) => ({ value: kind, label: KIND_LABELS[kind] }))}
                  className="item-slot-kind"
                />
              )}
              <TextField
                path="name"
                label="Name"
                placeholder={placeholder}
                suggestions={presets.size > 0 ? [...presets.keys()] : undefined}
                onPick={pick}
                onChange={rename}
                className="item-slot-name-field"
              />
              {item.kind !== '' && item.kind !== 'accessory' && <CheckboxField path="martial" label="Martial" />}
            </div>
            {item.kind !== '' && (
              <>
                {item.kind === 'weapon' && <WeaponFields item={item} derived={derived} />}
                <DefenseFields isArmor={item.kind === 'armor'} />
                <TextField path="quality" label="Quality & notes" rows={2} />
              </>
            )}
          </div>
        )}
      </div>
    </SheetProvider>
  )
}
