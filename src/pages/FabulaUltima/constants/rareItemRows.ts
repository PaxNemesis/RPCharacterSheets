import type { DefensiveItemData, SupplementId } from '../types';

/** Fixed Defense (null for the DEX die), then the bonuses to Defense, Magic Defense and Initiative. */
type ArmorRow = [
  name: string,
  page: number,
  martial: boolean,
  defense: number | null,
  defenseBonus: number,
  magicDefenseBonus: number,
  initiative: number,
];
type ShieldRow = [name: string, page: number, martial: boolean, defenseBonus: number, magicDefenseBonus: number];
type AccessoryRow = [name: string, page: number, bonuses?: Pick<DefensiveItemData, 'magicDefenseBonus' | 'initiative'>];

// Zero means the table's "-" or a bare die; leaving it out keeps the field blank.
const value = (number: number) => number || undefined;

export const armor = (book: SupplementId | undefined, rows: ArmorRow[]): DefensiveItemData[] =>
  rows.map(([name, page, martial, defense, defenseBonus, magicDefenseBonus, initiative]) => ({
    name,
    kind: 'armor',
    book,
    page,
    quality: true,
    martial,
    defense: defense ?? undefined,
    defenseBonus: value(defenseBonus),
    magicDefenseBonus: value(magicDefenseBonus),
    initiative: value(initiative),
  }));

export const shields = (book: SupplementId | undefined, rows: ShieldRow[]): DefensiveItemData[] =>
  rows.map(([name, page, martial, defenseBonus, magicDefenseBonus]) => ({
    name,
    kind: 'shield',
    book,
    page,
    quality: true,
    martial,
    defenseBonus: value(defenseBonus),
    magicDefenseBonus: value(magicDefenseBonus),
  }));

export const accessories = (book: SupplementId | undefined, rows: AccessoryRow[]): DefensiveItemData[] =>
  rows.map(([name, page, bonuses]) => ({
    name,
    kind: 'accessory',
    book,
    page,
    quality: true,
    martial: false,
    ...bonuses,
  }));
