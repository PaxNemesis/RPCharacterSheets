import type { ItemKind } from '../../../../types';

export const KIND_LABELS: Record<ItemKind, string> = {
  '': 'Empty',
  weapon: 'Weapon',
  shield: 'Shield',
  armor: 'Armor',
  accessory: 'Accessory',
};

/** The Name field's placeholder, by what the slot holds. */
export const NAME_PLACEHOLDERS: Record<ItemKind, string> = {
  '': 'Type to pick a weapon or shield',
  weapon: 'Type to pick a weapon',
  shield: 'Type to pick a shield',
  armor: 'No armor, or type to pick armor',
  accessory: 'Type to pick an accessory',
};
