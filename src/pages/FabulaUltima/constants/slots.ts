import type { ItemKind, SlotKey } from '../types';

/** The four equipment slots on the character sheet, and what each can hold. A hand with no item has kind ''. */
export const SLOTS: { key: SlotKey; label: string; kinds: ItemKind[] }[] = [
  { key: 'mainHand', label: 'Main hand', kinds: ['weapon', 'shield'] },
  { key: 'offHand', label: 'Off-hand', kinds: ['weapon', 'shield'] },
  { key: 'armor', label: 'Armor', kinds: ['armor'] },
  { key: 'accessory', label: 'Accessory', kinds: ['accessory'] },
];
