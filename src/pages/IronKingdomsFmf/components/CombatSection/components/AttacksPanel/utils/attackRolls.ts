import { sum } from '@/utils/sum';
import type { IkMeleeWeapon, IkRangedWeapon, Num, StatKey } from '../../../../../types';

/** One number that goes into a roll, such as { label: 'PRW', value: 4 }. */
export type RollPart = { label: string; value: Num };

/** A roll of 2d6 plus the total of its parts (pp. 207, 215). */
export type Roll = { total: Num; parts: RollPart[] };

type StatLookup = (key: StatKey) => Num;

const roll = (parts: RollPart[]): Roll => ({ total: sum(...parts.map((part) => part.value)), parts });

/** A crippled Agility's –2 as a part of its own (p. 215), so the roll shows where it comes from. */
const crippled = (penalty: Num): RollPart[] => (penalty === null ? [] : [{ label: 'Crippled', value: penalty }]);

export const rangedRolls = (weapon: IkRangedWeapon, stat: StatLookup, penalty: Num = null) => {
  const key = weapon.attackStat === 'prw' ? 'prw' : 'poi';
  return {
    attack: roll([
      { label: key.toUpperCase(), value: stat(key) },
      { label: 'Skill', value: weapon.skill },
      { label: 'Mod', value: weapon.attackMod },
      ...crippled(penalty),
    ]),
    damage: roll([{ label: 'POW', value: weapon.pow }]),
  };
};

export const meleeRolls = (weapon: IkMeleeWeapon, stat: StatLookup, penalty: Num = null) => ({
  attack: roll([
    { label: 'PRW', value: stat('prw') },
    { label: 'Skill', value: weapon.skill },
    { label: 'Mod', value: weapon.attackMod },
    ...crippled(penalty),
  ]),
  // A weapon without POW, such as a garrote, has no damage roll of its own.
  damage:
    typeof weapon.pow === 'number'
      ? roll([
          { label: 'POW', value: weapon.pow },
          { label: 'STR', value: stat('str') },
        ])
      : roll([]),
});

const signed = (value: number) => (value < 0 ? `–${-value}` : `+${value}`);

/** The number to add to 2d6, such as "+5" or "–2"; "—" when nothing is filled in. */
export const formatRoll = ({ total }: Roll) => (typeof total === 'number' ? signed(total) : '—');

/** One part of a roll, such as "PRW (4)" or "Skill (none)" when it isn't filled in. */
export const formatPart = ({ label, value }: RollPart) =>
  `${label} (${typeof value !== 'number' ? 'none' : value < 0 ? `–${-value}` : value})`;

/** "PRW (4) + Skill (2) + Mod (–1)". */
export const formatParts = ({ parts }: Roll) => parts.map(formatPart).join(' + ');
