import type { JackStatKey } from './character';
import type { BookId } from './rules';

export type JackSize = 'light' | 'heavy';
export type CortexGrade = 'cupernum' | 'ferrum' | 'aurum' | 'arcanum';

/** A steamjack chassis; see constants/chassis.ts for how `grid` is written. */
export type ChassisData = {
  name: string;
  book: BookId;
  page: number;
  size: JackSize;
  kind: 'laborjack' | 'warjack';
  height: string;
  weight: string;
  fuelLoad: string;
  fuelUse: string;
  /** The stock cortex. */
  cortex: CortexGrade;
  stats: Record<JackStatKey, number>;
  def: number;
  arm: number;
  grid: string[];
};

export type CortexData = {
  grade: CortexGrade;
  label: string;
  page: number;
  int: number;
  per: number;
  /** Added to MAT and RAT. */
  attackBonus: number;
  /** How far advancement can raise MAT and RAT (p. 324). */
  advancementLimit: number;
};

/**
 * A steamjack weapon. The main values are for light steamjacks, or for any steamjack; `heavy` holds a
 * heavy steamjack's values where they differ. `only` limits it to one size or one chassis.
 */
export type JackWeaponData = {
  name: string;
  book: BookId;
  page: number;
  type: 'melee' | 'ranged';
  only?: JackSize | string;
  /** Fixed location: L, R or H, or "—" for one outside the arms and head. Missing when it goes in either arm. */
  location?: 'L' | 'R' | 'H' | '—';
  mod: number | null;
  pow: number | null;
  rng?: string;
  aoe?: string;
  ammo?: string;
  heavy?: { pow?: number; rng?: string; ammo?: string };
  note?: string;
};
