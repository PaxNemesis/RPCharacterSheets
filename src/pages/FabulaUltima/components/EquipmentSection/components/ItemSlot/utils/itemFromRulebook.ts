import { compareNames } from '@/utils/alphabetical';
import { bookEnabled, bookRef } from '../../../../../constants/books';
import { CUSTOM_WEAPONS } from '../../../../../constants/customWeapons';
import { BASIC_DEFENSIVE_ITEMS, BASIC_WEAPONS } from '../../../../../constants/equipment';
import { RARE_ITEMS } from '../../../../../constants/rareItems';
import { RARE_WEAPONS } from '../../../../../constants/rareWeapons';
import type {
  BookId,
  CustomWeaponData,
  DefensiveItemData,
  FuItem,
  FuSettings,
  ItemKind,
  WeaponData,
} from '../../../../../types';
import { createItem } from '../../../../../utils/createCharacter';
import { martialNeeds } from '../../../../../utils/martial';
import { defaultFormLabel } from '../../../utils/forms';

// A rare weapon's notes point to its page; basic weapons (quality missing) have none.
const weaponNotes = (weapon: WeaponData) =>
  weapon.quality === undefined
    ? ''
    : weapon.quality
      ? `Quality: see ${bookRef(undefined, weapon.page)}.`
      : `No Quality (${bookRef(undefined, weapon.page)}).`;

export const itemFromWeapon = (weapon: WeaponData): FuItem => ({
  ...createItem('weapon'),
  name: weapon.name,
  martial: weapon.martial,
  category: weapon.category,
  hands: weapon.hands,
  range: weapon.range,
  accuracyA: weapon.accuracy[0],
  accuracyB: weapon.accuracy[1],
  accuracyBonus: weapon.accuracyBonus ?? null,
  damage: weapon.damage,
  damageType: weapon.damageType ?? 'physical',
  defenseBonus: weapon.defenseBonus ?? null,
  magicDefenseBonus: weapon.magicDefenseBonus ?? null,
  quality: weaponNotes(weapon),
});

export const itemFromDefensive = (item: DefensiveItemData): FuItem => ({
  ...createItem(item.kind),
  name: item.name,
  martial: item.martial,
  defense: item.defense ?? null,
  defenseBonus: item.defenseBonus ?? null,
  magicDefenseBonus: item.magicDefenseBonus ?? null,
  initiative: item.initiative ?? null,
  quality: item.quality ? `Quality: see ${bookRef(item.book, item.page)}.` : '',
});

/** A custom weapon in its first form, with each form's stats; a Quality is only referred to by page. */
export function itemFromCustomWeapon(weapon: CustomWeaponData): FuItem {
  const ref = bookRef(weapon.book, weapon.page);
  const forms = weapon.forms.map(({ accuracy, customizations, ...stats }, index) => {
    const {
      kind: _kind,
      name: _name,
      ...item
    } = {
      ...createItem('weapon'),
      ...stats,
      hands: 'two' as const,
      accuracyA: accuracy[0],
      accuracyB: accuracy[1],
      accuracyBonus: stats.accuracyBonus || null,
      defenseBonus: stats.defenseBonus ?? null,
      magicDefenseBonus: stats.magicDefenseBonus ?? null,
      quality: `${weapon.quality ? `Quality: see ${ref}` : `No Quality (${ref})`}. Customizations: ${customizations}.`,
    };
    return { label: defaultFormLabel(index), ...item };
  });
  const { label: _label, ...first } = forms[0];
  return { kind: 'weapon', name: weapon.name, ...first, ...(forms.length > 1 ? { forms, form: 0 } : {}) };
}

// A weapon's Category, or each form's for one that transforms: "dagger/firearm".
const categories = (item: FuItem) =>
  item.kind === 'weapon'
    ? [...new Set([item.category, ...(item.forms ?? []).map((form) => form.category)])].join('/').toLowerCase()
    : '';

/**
 * The suggestion for an item: its name, then its Category for a weapon, "martial" if it needs
 * martial equipment, and its book and page, e.g. "Halberd (spear, martial, p. 277)". Typing a
 * Category therefore finds every weapon in it.
 */
const labelled = (item: FuItem, source?: { book?: BookId; page: number }) => {
  const notes = [
    categories(item),
    martialNeeds(item).length > 0 && 'martial',
    source && bookRef(source.book, source.page),
  ].filter(Boolean);
  return notes.length > 0 ? `${item.name} (${notes.join(', ')})` : item.name;
};

/**
 * The rulebook items a slot can hold, for the Name field's suggestions: basic items (pp. 130–133) by
 * name, and rare items (pp. 270–287) and the enabled Atlases' items with their book and page, e.g.
 * "Eyre (martial, NF p. 117)".
 */
export function rulebookItems(kinds: ItemKind[], settings: FuSettings): Map<string, FuItem> {
  const weapons = kinds.includes('weapon')
    ? [...BASIC_WEAPONS, ...RARE_WEAPONS].map((weapon) => {
        const item = itemFromWeapon(weapon);
        return [labelled(item, weapon.quality === undefined ? undefined : weapon), item] as const;
      })
    : [];
  const custom = kinds.includes('weapon')
    ? CUSTOM_WEAPONS.filter((weapon) => bookEnabled(settings, weapon.book)).map((weapon) => {
        const item = itemFromCustomWeapon(weapon);
        return [labelled(item, weapon), item] as const;
      })
    : [];
  const defensive = [...BASIC_DEFENSIVE_ITEMS, ...RARE_ITEMS]
    .filter((data) => kinds.includes(data.kind) && bookEnabled(settings, data.book))
    .map((data) => {
      const item = itemFromDefensive(data);
      return [labelled(item, data.quality ? data : undefined), item] as const;
    });
  return new Map([...weapons, ...custom, ...defensive].sort(([a], [b]) => compareNames(a, b)));
}

/** The notes the presets write, including each form's, so they can be told apart from the player's own. */
export const presetNotes = (presets: Map<string, FuItem>) =>
  new Set(
    [...presets.values()]
      .flatMap((item) => [item.quality, ...(item.forms ?? []).map((form) => form.quality)])
      .filter(Boolean),
  );
