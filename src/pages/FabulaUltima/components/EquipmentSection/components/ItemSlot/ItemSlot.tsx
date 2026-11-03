import { useId } from 'react'
import { CheckboxField } from '@/components/CheckboxField'
import { SelectField } from '@/components/SelectField'
import { SheetProvider, useSheet } from '@/components/SheetProvider'
import { TextField } from '@/components/TextField'
import type { FuDerived, FuItem, ItemKind, SlotKey } from '../../../../types'
import { describeItem } from '../../utils/describeItem'
import { hasContent } from '../../utils/equip'
import { formLabel, hasForms, nextForm, switchForm } from '../../utils/forms'
import { DefenseFields, ItemForms, ItemSlotActions, WeaponFields } from './components'
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

  const forms = hasForms(item)
  // Picking a basic item fills in the current form's stats; the item's own notes and other forms are kept.
  const pick = (value: string) => {
    const preset = presets.get(value)
    if (preset) set(path, { ...preset, quality: item.quality, forms: item.forms, form: item.form })
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
              <span className={empty ? 'item-slot-name item-slot-empty' : 'item-slot-name'}>
                {name}
                {forms && <span className="item-slot-form">{formLabel(item)}</span>}
              </span>
              {details && <span className="item-slot-details">{details}</span>}
            </span>
          </div>
          <ItemSlotActions
            slotLabel={slot.label}
            label={label}
            empty={empty}
            open={open}
            editorId={editorId}
            nextForm={forms ? formLabel(item, nextForm(item)) : undefined}
            canUnequip={hasContent(item)}
            canDelete={deletable}
            onToggle={onToggle}
            onSwitch={() => set(path, switchForm(item, nextForm(item)))}
            onUnequip={onUnequip}
            onDelete={onDelete}
          />
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
                <ItemForms item={item} onChange={(next) => set(path, next)} />
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
