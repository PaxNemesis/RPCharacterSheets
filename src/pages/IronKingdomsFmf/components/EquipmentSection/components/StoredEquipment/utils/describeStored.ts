import type { IkStoredItem, IkStoredKind, Num, StatKey } from '../../../../../types';
import { meleeAttack, meleeDamage, rangedAttack } from '../../../../../utils/weaponColumns';

export const KIND_LABELS: Record<IkStoredKind, string> = {
  ranged: 'Ranged weapon',
  melee: 'Melee weapon',
  armor: 'Armor',
};

const isNumber = (value: unknown): value is number => typeof value === 'number';
const signed = (value: number) => (value > 0 ? `+${value}` : value < 0 ? `–${-value}` : '0');

/** "RAT 7", leaving out blank values; `format` changes how a number reads. */
const part = (label: string, value: Num | string, format: (value: number) => string = String) =>
  isNumber(value)
    ? `${label} ${format(value)}`
    : typeof value === 'string' && value.trim()
      ? `${label} ${value.trim()}`
      : '';

/** A one-line summary of a stored item's values, such as "Ranged weapon · RAT 7 · RNG 12 · POW 10". */
export function describeStored(item: IkStoredItem, kind: IkStoredKind, stat: (key: StatKey) => Num): string {
  const parts =
    kind === 'ranged'
      ? [
          part('RAT', rangedAttack(item, stat)),
          part('RNG', item.rng),
          part('AOE', item.aoe),
          part('POW', item.pow),
          part('Ammo', item.ammo),
        ]
      : kind === 'melee'
        ? [part('MAT', meleeAttack(item, stat)), part('POW', item.pow), part('P+S', meleeDamage(item, stat))]
        : [part('SPD', item.spd, signed), part('DEF', item.def, signed), part('ARM', item.arm, signed)];
  return [KIND_LABELS[kind], ...parts].filter(Boolean).join(' · ');
}
