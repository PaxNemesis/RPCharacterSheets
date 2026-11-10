import { GRID_COLUMNS, GRID_ROWS } from '../../../constants/steamjack';
import type { ChassisData, IkSteamjack, JackGridCell } from '../../../types';

/**
 * The 36 grid cells, column by column, from a chassis's rows. Grids shorter than six rows sit at the
 * bottom, with no boxes above, as in the books.
 */
export function gridFromRows(rows: string[]): JackGridCell[] {
  const padded = [
    ...Array.from({ length: Math.max(0, GRID_ROWS - rows.length) }, () => '.'.repeat(GRID_COLUMNS)),
    ...rows,
  ];
  return Array.from({ length: GRID_COLUMNS * GRID_ROWS }, (_, index) => {
    const mark = padded[index % GRID_ROWS]?.[Math.floor(index / GRID_ROWS)] ?? '.';
    return { type: mark === '.' ? '' : mark === 'o' ? 'hull' : mark, damaged: false };
  });
}

/** What picking a chassis fills in. Name, image, weapons and notes stay as they are. */
export const chassisValues = (chassis: ChassisData, jack: IkSteamjack): IkSteamjack => ({
  ...jack,
  chassis: chassis.name,
  size: chassis.size,
  height: chassis.height,
  weight: chassis.weight,
  fuelLoad: chassis.fuelLoad,
  fuelUse: chassis.fuelUse,
  stats: { ...chassis.stats },
  defense: { ...jack.defense, base: chassis.def },
  armor: { ...jack.armor, base: chassis.arm },
  cortex: { ...jack.cortex, grade: chassis.cortex },
  grid: gridFromRows(chassis.grid),
});

/** Whether the grid has damage marked, which picking a chassis would clear. */
export const hasDamage = (jack: IkSteamjack) => jack.grid.some((cell) => cell.damaged);
