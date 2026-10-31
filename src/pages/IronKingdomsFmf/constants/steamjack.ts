import type { JackStatKey } from '../types'

export const JACK_STAT_KEYS: JackStatKey[] = ['phy', 'spd', 'str', 'agl', 'prw', 'poi', 'int', 'per']

export const GRID_COLUMNS = 6
export const GRID_ROWS = 6

/** Cell types in the order a click cycles through them while editing the grid layout. */
export const GRID_CELL_TYPES = [
  { type: '', label: 'No box' },
  { type: 'hull', label: 'Hull' },
  { type: 'L', label: 'Left arm' },
  { type: 'R', label: 'Right arm' },
  { type: 'H', label: 'Head' },
  { type: 'M', label: 'Movement' },
  { type: 'C', label: 'Cortex' },
  { type: 'A', label: 'Arc node' },
]

export const CRIPPLED_SYSTEMS: Record<string, string> = {
  A: 'Cannot be used to channel spells.',
  C: 'Loses all focus points and cannot be allocated or spend focus.',
  M: 'DEF 7. Cannot run or charge.',
  L: 'One fewer die on attack and damage rolls with weapons in this location; no power attacks with them.',
  R: 'One fewer die on attack and damage rolls with weapons in this location; no power attacks with them.',
  H: 'One fewer die on attack and damage rolls with weapons in this location; no power attacks with them.',
}
