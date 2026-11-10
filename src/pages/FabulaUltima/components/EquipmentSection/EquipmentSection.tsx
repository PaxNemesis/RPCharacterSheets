import { useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { Panel } from '@/components/Panel';
import { RepeatTable, type RepeatTableColumn } from '@/components/RepeatTable';
import { useSheet } from '@/components/SheetProvider';
import { TextField } from '@/components/TextField';
import { SLOTS } from '../../constants/slots';
import { useFuCharacter } from '../../hooks/useFuCharacter';
import type { FuBackpackItem, SlotKey } from '../../types';
import { BlockedSlot, ItemSlot, MayEquip, StoredEquipment } from './components';
import { emptyFor, hasContent, isTwoHanded, unequip } from '../../utils/equip';
import './EquipmentSection.styles.css';

const BACKPACK_COLUMNS: RepeatTableColumn[] = [
  { key: 'name', label: 'Item', width: 'minmax(140px, 1fr)' },
  { key: 'quantity', label: 'Qty', width: '56px', type: 'number' },
  { key: 'notes', label: 'Notes', width: 'minmax(200px, 3fr)', rows: 2 },
];

const createBackpackItem = (): FuBackpackItem => ({ name: '', quantity: null, notes: '' });

export function EquipmentSection() {
  const { character, derived } = useFuCharacter();
  const { set } = useSheet();
  const [open, setOpen] = useState<SlotKey[]>([]);
  const close = (key: SlotKey) => setOpen((current) => current.filter((other) => other !== key));
  const isHand = (key: SlotKey) => key === 'mainHand' || key === 'offHand';
  const toggle = (key: SlotKey) => {
    const item = character.equipment[key];
    if (open.includes(key)) {
      // A slot that was never filled in goes back to empty rather than keeping an unnamed item.
      if (!hasContent(item)) set(`equipment.${key}`, emptyFor(key));
      close(key);
    } else {
      // An empty hand starts as a weapon; Holding switches it to a shield.
      if (isHand(key) && item.kind === '') set(`equipment.${key}.kind`, 'weapon');
      setOpen((current) => [...current, key]);
    }
  };
  const store = (key: SlotKey) => {
    const next = unequip(character, key);
    set('equipment', next.equipment);
    set('stored', next.stored);
    close(key);
  };
  // The system's normalize empties the off-hand while a two-handed weapon is held.
  const { mainHand } = character.equipment;
  const bothHands = isTwoHanded(mainHand);
  // A blocked off-hand has no editor, so it doesn't reopen half-empty once the hand is free again.
  if (bothHands && open.includes('offHand')) setOpen(open.filter((key) => key !== 'offHand'));

  // With nothing filled in yet, the button cancels, so there is nothing to confirm.
  const clear = (key: SlotKey) => {
    const item = character.equipment[key];
    const name = item.name.trim() || 'this item';
    const message = `Delete ${name}? It will be removed from the sheet. Use Unequip instead to keep it in the backpack.`;
    if (hasContent(item) && !window.confirm(message)) return;
    set(`equipment.${key}`, emptyFor(key));
    close(key);
  };

  return (
    <div className="fu-section equipment-section-container">
      <Panel title="Equipped items">
        <MayEquip derived={derived} />
        {derived.equipmentWarnings.map((warning) => (
          <p key={warning} className="fu-warning">
            {warning}
          </p>
        ))}
        <div className="equipment-section-slots">
          {SLOTS.map((slot) =>
            slot.key === 'offHand' && bothHands ? (
              <BlockedSlot key={slot.key} label={slot.label} weapon={mainHand.name.trim() || 'two-handed weapon'} />
            ) : (
              <ItemSlot
                key={slot.key}
                slot={slot}
                item={character.equipment[slot.key]}
                derived={derived}
                settings={character.settings}
                open={open.includes(slot.key)}
                onToggle={() => toggle(slot.key)}
                onUnequip={() => store(slot.key)}
                onDelete={() => clear(slot.key)}
              />
            ),
          )}
        </div>
        <p className="fu-note">
          Click a slot to edit it. Start typing a name to pick a basic weapon, armor or shield (pp. 130–133), a rare
          weapon, armor, shield or accessory, or a custom weapon from the Atlases, and fill in its stats. Defense, Magic
          Defense and Initiative bonuses are added on the Character tab. Martial equipment comes from your classes and
          Quirk; click a crossed-out type to allow it anyway.
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
  );
}
