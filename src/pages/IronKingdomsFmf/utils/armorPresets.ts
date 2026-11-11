import { ARMOR } from '../constants/armor';
import { bookEnabled, bookRef } from '../constants/books';
import type { IkSettings } from '../types';
import { compareNames } from '@/utils/alphabetical';
import type { WeaponPresets } from './weaponPresets';

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/**
 * Rulebook armor to suggest by name, from the books the character uses. Picking one fills in its
 * modifiers, and its page when the notes are still empty.
 */
export function armorPresets(settings: IkSettings): WeaponPresets {
  const available = ARMOR.filter((armor) => bookEnabled(settings, armor.book));
  return {
    names: available.map((armor) => armor.name).sort(compareNames),
    pick: (name, row) => {
      const armor = available.find((entry) => same(entry.name, name));
      if (!armor) return row;
      const page = armor.book === 'core' ? `p. ${armor.page}` : bookRef(armor.book, armor.page);
      const notes = typeof row.notes === 'string' && row.notes.trim() ? row.notes : page;
      return { ...row, name: armor.name, spd: armor.spd, def: armor.def, arm: armor.arm, notes };
    },
  };
}
