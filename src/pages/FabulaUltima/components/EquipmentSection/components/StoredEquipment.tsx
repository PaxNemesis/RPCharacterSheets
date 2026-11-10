import { Icon } from '@/components/Icon';
import { useSheet } from '@/components/SheetProvider';
import { useRowIds } from '@/hooks/useRowIds';
import { SLOTS } from '../../../constants/slots';
import type { FuCharacter } from '../../../types';
import { describeItem } from '../utils/describeItem';
import { equip, isTwoHanded, slotsFor } from '../../../utils/equip';
import { formLabel, hasForms } from '../utils/forms';

type StoredEquipmentProps = {
  character: FuCharacter;
};

/** Weapons, armor and accessories kept in the backpack, with buttons to equip them again. */
export function StoredEquipment({ character }: StoredEquipmentProps) {
  const { set } = useSheet();
  const { stored } = character;
  // Equipping takes an item out of the middle of the list; whatever it displaces goes on the end.
  const rowIds = useRowIds(stored.length);
  if (stored.length === 0) {
    return <p className="fu-note">Unequip a weapon, armor or accessory to keep it here with its stats.</p>;
  }

  const apply = (index: number, next: Pick<FuCharacter, 'equipment' | 'stored'>) => {
    rowIds.remove(index);
    set('equipment', next.equipment);
    set('stored', next.stored);
  };
  const remove = (index: number) => {
    const name = stored[index].name.trim() || 'this item';
    if (window.confirm(`Delete ${name}? It will be removed from the sheet.`)) {
      rowIds.remove(index);
      set(
        'stored',
        stored.filter((_, other) => other !== index),
      );
    }
  };

  return (
    <ul className="equipment-section-stored">
      {stored.map((item, index) => {
        // A two-handed weapon in the main hand leaves no off-hand to equip to.
        const slots = slotsFor(item).filter(
          (slot) => !(slot === 'offHand' && isTwoHanded(character.equipment.mainHand)),
        );
        const twoHanded = item.kind === 'weapon' && item.hands === 'two';
        return (
          <li key={rowIds.ids[index]} className="equipment-section-stored-item">
            <span className="equipment-section-stored-summary">
              <span className="equipment-section-stored-name">
                {item.name.trim() || 'Unnamed item'}
                {hasForms(item) && ` (${formLabel(item)})`}
              </span>
              <span className="fu-note">{describeItem(item)}</span>
            </span>
            <span className="equipment-section-stored-actions">
              {slots.map((slot) => {
                const where = twoHanded ? 'Both hands' : (SLOTS.find((entry) => entry.key === slot)?.label ?? '');
                const named = slots.length > 1 || twoHanded;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => apply(index, equip(character, index, slot))}
                    aria-label={`Equip ${item.name.trim() || 'item'}${named ? ` to ${where.toLowerCase()}` : ''}`}
                    title={named ? `Equip: ${where.toLowerCase()}` : 'Equip'}
                  >
                    <Icon name="unarchive" className="equipment-section-icon" />
                    {/* The icon stands for "Equip", but which slot still needs saying. */}
                    {named && where}
                  </button>
                );
              })}
              <button
                type="button"
                className="equipment-section-stored-delete"
                onClick={() => remove(index)}
                title="Delete"
                aria-label={`Delete ${item.name.trim() || 'item'}`}
              >
                <Icon name="delete" className="equipment-section-icon" />
              </button>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
