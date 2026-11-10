import type { CortexData, CortexGrade } from '../types';

/** The cortex grades and what each gives (core rules pp. 303–305, 324). */
export const CORTEXES: CortexData[] = [
  { grade: 'cupernum', label: 'Cupernum', page: 303, int: 1, per: 1, attackBonus: 0, advancementLimit: 0 },
  { grade: 'ferrum', label: 'Ferrum', page: 304, int: 1, per: 1, attackBonus: 0, advancementLimit: 0 },
  { grade: 'aurum', label: 'Aurum', page: 304, int: 2, per: 2, attackBonus: 1, advancementLimit: 1 },
  { grade: 'arcanum', label: 'Arcanum', page: 304, int: 3, per: 3, attackBonus: 2, advancementLimit: 2 },
];

export const findCortex = (grade: string): CortexData | undefined =>
  CORTEXES.find((cortex) => cortex.grade === (grade as CortexGrade));
