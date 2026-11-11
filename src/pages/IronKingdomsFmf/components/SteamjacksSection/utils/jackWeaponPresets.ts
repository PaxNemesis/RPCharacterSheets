import type { RepeatTableRow } from '@/components/RepeatTable';
import { compareNames } from '@/utils/alphabetical';
import { bookEnabled, bookRef } from '../../../constants/books';
import { JACK_WEAPONS } from '../../../constants/steamjackWeapons';
import type { IkSettings, IkSteamjack, JackWeaponData } from '../../../types';
import type { WeaponPresets } from '../../../utils/weaponPresets';

type Jack = Pick<IkSteamjack, 'size' | 'chassis'>;

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** Whether this jack can use the weapon: any size, its size, or its chassis. An unknown size allows any. */
const fits = (weapon: JackWeaponData, jack: Jack) =>
  weapon.only === undefined ||
  (weapon.only === 'light' || weapon.only === 'heavy'
    ? !jack.size || weapon.only === jack.size
    : same(weapon.only, jack.chassis));

/** Who can use it and any values that depend on how it is used; the page has a column of its own. */
const describe = (weapon: JackWeaponData) => {
  const only = weapon.only && `${weapon.only[0].toUpperCase()}${weapon.only.slice(1)} only`;
  return [only, weapon.note].filter(Boolean).join('. ');
};

/** A weapon's values for this jack: a heavy steamjack takes the heavy values where there are any. */
const valuesFor = (weapon: JackWeaponData, jack: Jack) =>
  jack.size === 'heavy' ? { ...weapon, ...weapon.heavy } : weapon;

function presets(
  settings: IkSettings,
  jack: Jack,
  type: JackWeaponData['type'],
  fill: (weapon: JackWeaponData) => RepeatTableRow,
): WeaponPresets {
  const available = JACK_WEAPONS.filter(
    (weapon) => weapon.type === type && bookEnabled(settings, weapon.book) && fits(weapon, jack),
  );
  return {
    names: [...new Set(available.map((weapon) => weapon.name))].sort(compareNames),
    pick: (name, row) => {
      // Two weapons can share a name, such as the light and heavy Battle Mace; the first that fits wins.
      const weapon = available.find((candidate) => same(candidate.name, name));
      if (!weapon) return row;
      const values = valuesFor(weapon, jack);
      return {
        ...row,
        ...fill(values),
        name: weapon.name,
        location: weapon.location ?? row.location ?? '',
        attackMod: values.mod,
        pow: values.pow,
        notes: describe(weapon),
        page: bookRef(weapon.book, weapon.page),
      };
    },
  };
}

export const jackRangedPresets = (settings: IkSettings, jack: Jack) =>
  presets(settings, jack, 'ranged', (weapon) => ({
    rng: weapon.rng ?? '',
    aoe: weapon.aoe ?? '',
    ammo: weapon.ammo ?? '',
  }));

export const jackMeleePresets = (settings: IkSettings, jack: Jack) => presets(settings, jack, 'melee', () => ({}));
