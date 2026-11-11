export type PoolKey = 'hp' | 'mp' | 'ip';

/** One of a pool's two buttons; `preset` fills the popup's amount for a cost that is usually the same. */
export type PoolVerb = { label: string; title: string; preset?: number };

/** What lowering and raising each pool means. */
export const POOL_VERBS: Record<PoolKey, [lower: PoolVerb, raise: PoolVerb]> = {
  hp: [
    { label: 'Damage', title: 'Damage to HP' },
    { label: 'Heal', title: 'HP recovered' },
  ],
  mp: [
    { label: 'Spend', title: 'MP spent' },
    { label: 'Recover', title: 'MP recovered' },
  ],
  ip: [
    // Most items cost 3 IP, such as an elixir or a remedy (p. 104).
    { label: 'Use', title: 'IP used', preset: 3 },
    { label: 'Recover', title: 'IP recovered' },
  ],
};
