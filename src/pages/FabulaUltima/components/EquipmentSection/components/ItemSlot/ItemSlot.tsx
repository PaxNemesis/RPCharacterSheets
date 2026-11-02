import { useId } from 'react'
import { CheckboxField } from '@/components/CheckboxField'
import { Icon } from '@/components/Icon'
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
  /** Clears the slot without keeping the item. */
  onDelete: () => void
}

/** One row of the equipment list: a summary of the item, with its fields underneath while open. */
export function ItemSlot({ slot, item, derived, open, onToggle, onUnequip, onDelete }: ItemSlotProps) {
  const { set } = useSheet()
  const editorId = useId()
  const path = `equipment.${slot.key}`
  const presets = rulebookItems(slot.kinds)
  const holdsWeapons = slot.kinds.includes('weapon')
  const details = item.kind === '' ? '' : describeItem(item)
  const empty = !item.name.trim() && (item.kind === '' || item.kind === 'armor' || !details)
  const name = item.name.trim() || (item.kind === 'armor' ? 'No armor' : empty ? 'Empty' : `Unnamed ${item.kind}`)
  // Leftovers without a type (from before Holding lost its Empty option) can still be deleted.
  const deletable = hasContent(item) || Boolean(item.name.trim() || item.quality.trim())
  const label = item.name.trim() || slot.label.toLowerCase()
  const kindOptions = [
    ...(item.kind === '' ? [{ value: '', label: 'Choose…' }] : []),
    ...slot.kinds.map((kind) => ({ value: kind, label: KIND_LABELS[kind] })),
  ]

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
          {/* Clicking the summary is a shortcut for the Edit button, which is what keyboards and screen readers use. */}
          <div className="item-slot-overview" onClick={onToggle}>
            <span className="item-slot-label">{slot.label}</span>
            <span className="item-slot-summary">
              <span className={empty ? 'item-slot-name item-slot-empty' : 'item-slot-name'}>{name}</span>
              {details && <span className="item-slot-details">{details}</span>}
            </span>
          </div>
          <div className="item-slot-actions" role="group" aria-label={`${slot.label} actions`}>
            <button
              type="button"
              className="item-slot-edit"
              aria-expanded={open}
              aria-controls={editorId}
              aria-label={`${open ? 'Done editing' : empty ? 'Add to' : 'Edit'} ${slot.label.toLowerCase()}`}
              title={open ? 'Done' : empty ? 'Add' : 'Edit'}
              onClick={onToggle}
            >
              <Icon name={open ? 'check' : empty ? 'add' : 'edit'} className="equipment-section-icon" />
            </button>
            {hasContent(item) && (
              <button
                type="button"
                onClick={onUnequip}
                title="Move to stored equipment in the backpack"
                aria-label={`Unequip ${label}`}
              >
                <Icon name="archive" className="equipment-section-icon" />
              </button>
            )}
            {deletable && (
              <button type="button" className="item-slot-delete" onClick={onDelete} title="Delete" aria-label={`Delete ${label}`}>
                <Icon name="delete" className="equipment-section-icon" />
              </button>
            )}
          </div>
        </div>
        {open && (
          <div id={editorId} className="item-slot-editor">
            <div className="item-slot-name-row">
              {slot.kinds.length > 1 && (
                <SelectField
                  path="kind"
                  label="Holding"
                  options={kindOptions}
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
