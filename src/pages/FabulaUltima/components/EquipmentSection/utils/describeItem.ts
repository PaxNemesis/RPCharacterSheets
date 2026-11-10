import { ATTRIBUTES } from '../../../constants/attributes';
import type { FuItem, Num } from '../../../types';

const signed = (value: Num) => (value ? `${value > 0 ? '+' : '−'}${Math.abs(value)}` : '');

const bonuses = (item: FuItem) =>
  [
    item.defenseBonus && `Defense ${signed(item.defenseBonus)}`,
    item.magicDefenseBonus && `M. Defense ${signed(item.magicDefenseBonus)}`,
    item.initiative && `Initiative ${signed(item.initiative)}`,
  ].filter((part): part is string => Boolean(part));

/** A one-line summary of an equipped item's stats, like the description column on the printed sheet. */
export function describeItem(item: FuItem): string {
  const parts: string[] = [];
  if (item.kind === 'weapon') {
    const hands = item.hands === 'two' ? 'two-handed' : item.hands === 'one' ? 'one-handed' : '';
    const kind = [item.category, [hands, item.range].filter(Boolean).join(' ')].filter(Boolean).join(', ');
    const accuracy = `【${ATTRIBUTES[item.accuracyA]?.short ?? '?'} + ${ATTRIBUTES[item.accuracyB]?.short ?? '?'}】`;
    if (kind) parts.push(kind);
    parts.push(`${accuracy}${item.accuracyBonus ? ` ${signed(item.accuracyBonus)}` : ''}`);
    parts.push(`HR + ${item.damage ?? 0} ${item.damageType}`.trim());
  }
  if (item.kind === 'armor') {
    // Armor states its scores in full, like the rulebook: "Defense DEX +1", "M. Defense INS +2".
    const add = (value: Num) => (value ? ` ${signed(value)}` : '');
    parts.push(
      `Defense ${item.defense ?? 'DEX'}${add(item.defenseBonus)}`,
      `M. Defense INS${add(item.magicDefenseBonus)}`,
    );
    if (item.initiative) parts.push(`Initiative ${signed(item.initiative)}`);
  } else {
    parts.push(...bonuses(item));
  }
  if (item.martial) parts.push('Martial');
  return parts.join(' · ');
}
