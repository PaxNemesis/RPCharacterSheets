import { useId, useState } from 'react';
import { CheckboxField } from '@/components/CheckboxField';
import { SelectField } from '@/components/SelectField';
import { SheetProvider, useSheet } from '@/components/SheetProvider';
import { TextField } from '@/components/TextField';
import type { FuDerived, FuItem, FuSettings, ItemKind, SlotKey } from '../../../../types';
import { describeItem } from '../../utils/describeItem';
import { hasContent } from '../../../../utils/equip';
import { formLabel, hasForms, nextForm, switchForm } from '../../utils/forms';
import { canEquip } from '../../../../utils/martial';
import { DefenseFields, ItemForms, ItemSlotActions, MartialFilterNote, WeaponFields } from './components';
import { presetNotes, rulebookItems } from './utils/itemFromRulebook';
import { KIND_LABELS, NAME_PLACEHOLDERS } from './ItemSlot.constants';
import './ItemSlot.styles.css';

type ItemSlotProps = {
  slot: { key: SlotKey; label: string; kinds: ItemKind[] };
  item: FuItem;
  derived: FuDerived;
  /** Which Atlases' custom weapons to suggest. */
  settings: FuSettings;
  open: boolean;
  onToggle: () => void;
  /** Moves the item to stored equipment in the backpack. */
  onUnequip: () => void;
  /** Clears the slot without keeping the item. */
  onDelete: () => void;
};

/** One row of the equipment list: a summary of the item, with its fields underneath while open. */
export function ItemSlot({ slot, item, derived, settings, open, onToggle, onUnequip, onDelete }: ItemSlotProps) {
  const { set } = useSheet();
  const editorId = useId();
  const path = `equipment.${slot.key}`;
  const everything = rulebookItems(slot.kinds, settings);
  // Once Holding is chosen, only items of that kind are suggested; an empty hand offers both.
  const presets = item.kind ? new Map([...everything].filter(([, preset]) => preset.kind === item.kind)) : everything;
  // Martial items the character can't equip are left out of the suggestions unless asked for.
  const [showAll, setShowAll] = useState(false);
  const allowed = [...presets].filter(([, preset]) => canEquip(preset, derived.martial)).map(([key]) => key);
  const suggestions = showAll ? [...presets.keys()] : allowed;
  const details = item.kind === '' ? '' : describeItem(item);
  // A slot is empty when it holds nothing worth keeping and isn't being filled in; while it is,
  // it reads "Unnamed armor" and so on.
  const empty = !open && !hasContent(item);
  const name =
    item.name.trim() || (empty ? (item.kind === 'armor' ? 'No armor' : 'Empty') : `Unnamed ${item.kind || 'item'}`);
  // Leftovers without a type (from before Holding lost its Empty option) can still be deleted.
  // A new item can't be closed until it has something worth keeping; Cancel discards it.
  const unfinished = open && !hasContent(item);
  const deletable = open || hasContent(item) || Boolean(item.name.trim() || item.quality.trim());
  const label = item.name.trim() || slot.label.toLowerCase();
  const kindOptions = [
    ...(item.kind === '' ? [{ value: '', label: 'Choose…' }] : []),
    ...slot.kinds.map((kind) => ({ value: kind, label: KIND_LABELS[kind] })),
  ];

  const forms = hasForms(item);
  // A basic item fills in the current form's stats, keeping the item's notes and other forms; notes
  // that a preset wrote, rather than the player, are dropped. A rare item or custom weapon brings its
  // own notes (and forms), so it replaces the item.
  const pick = (value: string) => {
    const preset = presets.get(value);
    const notes = presetNotes(everything).has(item.quality) ? '' : item.quality;
    if (preset?.quality) set(path, preset);
    else if (preset) set(path, { ...preset, quality: notes, forms: item.forms, form: item.form });
  };

  return (
    <SheetProvider path={path}>
      <div className="item-slot-container">
        <div className="item-slot-row">
          {/* Clicking the summary is a shortcut for the Edit button, which is what keyboards and screen readers use. */}
          <div className="item-slot-overview" onClick={unfinished ? undefined : onToggle}>
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
            cancels={!hasContent(item)}
            unfinished={unfinished}
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
                <SelectField path="kind" label="Holding" options={kindOptions} className="item-slot-kind" />
              )}
              <TextField
                path="name"
                label="Name"
                placeholder={NAME_PLACEHOLDERS[item.kind]}
                suggestions={presets.size > 0 ? suggestions : undefined}
                onPick={pick}
                className="item-slot-name-field"
              />
              {item.kind !== '' && item.kind !== 'accessory' && <CheckboxField path="martial" label="Martial" />}
            </div>
            <MartialFilterNote
              blocked={presets.size - allowed.length}
              showAll={showAll}
              onToggle={() => setShowAll(!showAll)}
            />
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
  );
}
