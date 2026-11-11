/** A Hunter's trap: the Set Trap Skill Level it needs, its page, and a few words on what it does (LF pp. 91–92). */
export type TrapData = { name: string; sl: number; page: number; effect: string };

export const TRAPS: TrapData[] = [
  { name: 'Tripwire', sl: 1, page: 91, effect: 'HR + 10 physical' },
  { name: 'Siren', sl: 1, page: 91, effect: 'dazed' },
  { name: 'Smoke Bomb', sl: 1, page: 91, effect: '−2 Accuracy for a round' },
  { name: 'Snare Net', sl: 2, page: 91, effect: 'loses an action; flying: HR + 10 physical' },
  { name: 'Blinding Powder', sl: 2, page: 91, effect: 'dazed, slow' },
  { name: 'Mocking Trap', sl: 2, page: 91, effect: 'enraged' },
  { name: 'Poison Dart', sl: 3, page: 91, effect: 'HR + 10 poison, poisoned' },
  { name: 'Snap Out', sl: 3, page: 91, effect: 'HR + 10 bolt, −2 Accuracy for a round' },
  { name: 'Sting Thing', sl: 3, page: 91, effect: 'HR + 15 physical, bolt or poison' },
  { name: 'Bear Trap', sl: 4, page: 92, effect: 'HR + 20 physical, slow' },
  { name: 'Moth Trap', sl: 4, page: 92, effect: 'HR + 15 light, −SL Accuracy for a round' },
  { name: 'Fly Trap', sl: 4, page: 92, effect: 'loses an action, slow; flying: HR + 10 physical' },
  { name: 'Explosive Trap', sl: 5, page: 92, effect: 'HR + 25 fire' },
  { name: 'Venomous Cloud', sl: 5, page: 92, effect: 'HR + 20 poison, poisoned' },
  { name: 'Soul Mirror', sl: 5, page: 92, effect: 'turns their next offensive spell on them' },
];

/** How big a trap is: its MP cost and how many creatures it targets (LF p. 90). */
export const TRAP_SIZES = [
  { name: 'Minor', mp: 5, targets: 1 },
  { name: 'Medium', mp: 10, targets: 2 },
  { name: 'Major', mp: 15, targets: 3 },
] as const;

export type TrapSize = (typeof TRAP_SIZES)[number]['name'];

/** MP for Lock-On, Track and Vital Strike; Lock-On costs 20 when Unerring Focus is used (LF pp. 89, 93). */
export const HUNTER_MP = 10;
export const UNERRING_FOCUS_MP = 20;
