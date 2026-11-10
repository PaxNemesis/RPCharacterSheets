import type { ClarityKind } from '../types';
import { DAMAGE_TYPES, STATUSES } from './attributes';

/** The three kinds of Clarity benefit and what each is chosen from (LF p. 102). */
export const CLARITY_KINDS: { key: ClarityKind; label: string; choices: string[] }[] = [
  {
    key: 'immunity',
    label: 'Immunity to a status effect',
    choices: STATUSES.map((status) => status.label.toLowerCase()),
  },
  { key: 'pierce', label: 'Damage type ignores Resistances', choices: DAMAGE_TYPES },
  { key: 'resistance', label: 'Resistance to a damage type', choices: DAMAGE_TYPES },
];

/** Releasing a Soul Bead with any Monk Skill costs this many MP (LF p. 102). */
export const MP_PER_BEAD = 2;
