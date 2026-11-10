import type { IkCharacter, IkStoredItem, IkStoredKind } from '../types';
import { createArmor, createStoredItem } from './createCharacter';
import { createMeleeWeapon, createRangedWeapon } from './weaponColumns';

type EquippedList = 'rangedWeapons' | 'meleeWeapons' | 'armor';
type Gear = Pick<IkCharacter, EquippedList | 'stored'>;
type Row = Record<string, unknown>;

/** The list each kind of item is used from while it is equipped. */
export const EQUIPPED_LIST: Record<IkStoredKind, EquippedList> = {
  ranged: 'rangedWeapons',
  melee: 'meleeWeapons',
  armor: 'armor',
};

const KINDS = Object.keys(EQUIPPED_LIST) as IkStoredKind[];

// A blank row of each equipped list, for the fields an equipped item gets back from storage.
const BLANKS: Record<IkStoredKind, () => Row> = {
  ranged: createRangedWeapon,
  melee: createMeleeWeapon,
  armor: createArmor,
};

/** The fields of `blank`, with the values `item` has for them. */
const pick = (blank: Row, item: object): Row =>
  Object.fromEntries(Object.keys(blank).map((key) => [key, (item as Row)[key] ?? blank[key]]));

/** The stored item's kind, or undefined for an entry of no known kind, such as one edited by hand. */
export const storedKind = (item: IkStoredItem): IkStoredKind | undefined => KINDS.find((kind) => kind === item.kind);

/** An equipped weapon or armor as a stored item, keeping all of its values. */
export const toStored = (kind: IkStoredKind, row: object): IkStoredItem => ({
  ...(pick(createStoredItem() as Row, row) as IkStoredItem),
  kind,
});

/**
 * Equips the stored item at `index` by adding it to the end of its list. With `swap`, it takes the
 * place of the equipped item at that index instead, and that item goes into storage.
 */
export function equip(gear: Gear, index: number, swap?: number): Gear {
  const item = gear.stored[index];
  const kind = item && storedKind(item);
  if (!kind) return gear;
  const key = EQUIPPED_LIST[kind];
  const list = gear[key] as Row[];
  const row = pick(BLANKS[kind](), item);
  const rest = gear.stored.filter((_, other) => other !== index);
  const replaced = swap === undefined ? undefined : list[swap];
  if (!replaced) return { ...gear, [key]: [...list, row], stored: rest };
  return {
    ...gear,
    [key]: list.map((other, at) => (at === swap ? row : other)),
    stored: [...rest, toStored(kind, replaced)],
  };
}
