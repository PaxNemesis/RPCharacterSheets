import type { FuItem, MartialKey } from '../types';

export const MARTIAL_NAMES: Record<MartialKey, string> = {
  armor: 'martial armor',
  shields: 'martial shields',
  melee: 'martial melee weapons',
  ranged: 'martial ranged weapons',
};

const martialKind = (kind: FuItem['kind'], range: FuItem['range']): MartialKey | undefined => {
  if (kind === 'armor') return 'armor';
  if (kind === 'shield') return 'shields';
  if (kind === 'weapon' && range) return range;
  return undefined;
};

/**
 * The kinds of martial equipment a character must be able to equip to use the item. A transforming
 * weapon needs every martial form's kind, so a melee and a ranged form need both (HF p. 109).
 */
export function martialNeeds(item: FuItem): MartialKey[] {
  // The current form's stats are the item's own; the stored copy is only up to date for the others.
  const forms = item.forms?.length
    ? item.forms.map((form, index) => (index === (item.form ?? 0) ? item : form))
    : [item];
  const needs = forms.filter((form) => form.martial).map((form) => martialKind(item.kind, form.range));
  return [...new Set(needs.filter((need): need is MartialKey => need !== undefined))];
}

export const canEquip = (item: FuItem, martial: Record<MartialKey, boolean>) =>
  martialNeeds(item).every((need) => martial[need]);
