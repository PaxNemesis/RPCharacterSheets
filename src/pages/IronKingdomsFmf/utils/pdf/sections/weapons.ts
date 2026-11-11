import type { IkCharacter, IkDerived } from '../../../types';
import { meleeAttack, meleeDamage, rangedAttack } from '../../weaponColumns';
import { GAP, LABEL, rowHeight, type Cell } from '../sheetLayout';
import type { SheetWriter } from '../sheetWriter';

/** The list's entries and `spares` blank ones after them, to write in more. */
export const withSpares = <T>(list: T[], blank: T, spares = 2): T[] => [
  ...list,
  ...Array.from({ length: spares }, () => blank),
];

/** One weapon as two rows of labelled fields, kept together in a column. */
function weaponBlock(w: SheetWriter, rows: Cell[][]) {
  w.keep(rows.reduce((height, row) => height + LABEL + rowHeight(row) + GAP, 0));
  for (const row of rows) w.fields(row);
}

/** Ranged and melee weapons, with RAT, MAT and P+S worked out at export. */
export function writeWeapons(w: SheetWriter, character: IkCharacter, { stat }: IkDerived) {
  w.section('Ranged weapons', 56);
  withSpares(character.rangedWeapons, null, 1).forEach((weapon, i) => {
    const path = `rangedWeapons.${i}`;
    weaponBlock(w, [
      [
        { label: 'Name', name: `${path}.name`, value: weapon?.name, weight: 3 },
        { label: 'RNG', name: `${path}.rng`, value: weapon?.rng },
        { label: 'RAT', name: `calculated.${path}.rat`, value: weapon && rangedAttack(weapon, stat) },
        { label: 'POW', name: `${path}.pow`, value: weapon?.pow },
        { label: 'Page', name: `${path}.page`, value: weapon?.page },
      ],
      [
        { label: 'Skill', name: `${path}.skill`, value: weapon?.skill },
        { label: 'Mod', name: `${path}.attackMod`, value: weapon?.attackMod },
        { label: 'AOE', name: `${path}.aoe`, value: weapon?.aoe },
        { label: 'Ammo', name: `${path}.ammo`, value: weapon?.ammo },
        { label: 'Notes', name: `${path}.notes`, value: weapon?.notes, weight: 3 },
      ],
    ]);
  });
  w.end();

  w.section('Melee weapons', 56);
  withSpares(character.meleeWeapons, null, 1).forEach((weapon, i) => {
    const path = `meleeWeapons.${i}`;
    weaponBlock(w, [
      [
        { label: 'Name', name: `${path}.name`, value: weapon?.name, weight: 3 },
        { label: 'MAT', name: `calculated.${path}.mat`, value: weapon && meleeAttack(weapon, stat) },
        { label: 'POW', name: `${path}.pow`, value: weapon?.pow },
        { label: 'P+S', name: `calculated.${path}.ps`, value: weapon && meleeDamage(weapon, stat) },
        { label: 'Page', name: `${path}.page`, value: weapon?.page },
      ],
      [
        { label: 'Skill', name: `${path}.skill`, value: weapon?.skill },
        { label: 'Mod', name: `${path}.attackMod`, value: weapon?.attackMod },
        { label: 'Notes', name: `${path}.notes`, value: weapon?.notes, weight: 4 },
      ],
    ]);
  });
  w.end();
}
