import { sum } from '@/utils/sum';
import { findCortex } from '../../../constants/cortexes';
import type { IkSteamjack, Num } from '../../../types';

export type JackCombat = {
  /** The cortex's bonus to MAT and RAT; 0 without a known cortex. */
  cortexBonus: number;
  /** How far advancement can raise MAT and RAT with this cortex. */
  advancementLimit: number;
  mat: Num;
  rat: Num;
  initiative: Num;
};

const stat = (jack: IkSteamjack, key: keyof IkSteamjack['stats']): Num => {
  const value = jack.stats[key];
  return typeof value === 'number' ? value : null;
};

/**
 * MAT = PRW + cortex bonus + advancement, RAT = POI + cortex bonus + advancement, and initiative =
 * SPD + PRW + PER, as printed for every chassis (core rules pp. 300–305, 324). Blank without the stat.
 */
export function jackCombat(jack: IkSteamjack): JackCombat {
  const cortex = findCortex(jack.cortex.grade);
  const cortexBonus = cortex?.attackBonus ?? 0;
  const prw = stat(jack, 'prw');
  const poi = stat(jack, 'poi');
  return {
    cortexBonus,
    advancementLimit: cortex?.advancementLimit ?? 0,
    mat: prw === null ? null : sum(prw, cortexBonus, jack.advancement.mat),
    rat: poi === null ? null : sum(poi, cortexBonus, jack.advancement.rat),
    initiative: prw === null ? null : sum(stat(jack, 'spd'), prw, stat(jack, 'per')),
  };
}
