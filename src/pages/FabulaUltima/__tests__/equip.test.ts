import { describe, expect, it } from 'vitest';
import type { FuCharacter, FuItem } from '../types';
import { createItem } from '../utils/createCharacter';
import { equip, normalizeCharacter, slotsFor, unequip } from '../utils/equip';
import { character } from './character';

const weapon = (name: string, hands: FuItem['hands']): FuItem => ({ ...createItem('weapon'), name, hands, damage: 6 });
const shield = { ...createItem('shield'), name: 'Bronze Shield', defenseBonus: 2 };

const holding = (mainHand: FuItem, offHand: FuItem, stored: FuItem[] = []): FuCharacter => {
  const sheet = character({ stored });
  return { ...sheet, equipment: { ...sheet.equipment, mainHand, offHand } };
};

describe('equip', () => {
  it('moves an unequipped item to storage and empties its slot', () => {
    const next = unequip(holding(weapon('Rapier', 'one'), shield), 'offHand');
    expect(next.stored).toEqual([shield]);
    expect(next.equipment.offHand.kind).toBe('');
  });

  it('swaps a stored item with what the slot held', () => {
    const rapier = weapon('Rapier', 'one');
    const dagger = weapon('Dagger', 'one');
    const next = equip(holding(rapier, shield, [dagger]), 0, 'mainHand');
    expect(next.equipment.mainHand).toBe(dagger);
    expect(next.stored).toEqual([rapier]);
  });

  it('stores the off-hand too when a two-handed weapon is equipped, and only offers the main hand for it', () => {
    const greatsword = weapon('Greatsword', 'two');
    const next = equip(holding(createItem(), shield, [greatsword]), 0, 'mainHand');
    expect(next.equipment.mainHand).toBe(greatsword);
    expect(next.equipment.offHand.kind).toBe('');
    expect(next.stored).toEqual([shield]);
    expect(slotsFor(greatsword)).toEqual(['mainHand']);
    expect(slotsFor(shield)).toEqual(['mainHand', 'offHand']);
  });

  it('empties the off-hand into storage whenever the main hand becomes two-handed', () => {
    const next = normalizeCharacter(holding(weapon('Greatsword', 'two'), shield));
    expect(next.equipment.offHand.kind).toBe('');
    expect(next.stored).toEqual([shield]);
  });

  it('clears an off-hand with nothing in it without storing it, and leaves one-handed setups alone', () => {
    const blank = normalizeCharacter(holding(weapon('Greatsword', 'two'), createItem('shield')));
    expect(blank.equipment.offHand.kind).toBe('');
    expect(blank.stored).toEqual([]);
    const oneHanded = holding(weapon('Rapier', 'one'), shield);
    expect(normalizeCharacter(oneHanded)).toBe(oneHanded);
  });
});
