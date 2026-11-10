/* oxlint-disable react/no-array-index-key -- The damage grid has a fixed set of cells that never reorders. */
import { useState } from 'react';
import { Panel } from '@/components/Panel';
import { useSheetField } from '@/components/SheetProvider';
import { CRIPPLED_SYSTEMS, GRID_CELL_TYPES, GRID_COLUMNS, GRID_ROWS } from '../../../../constants/steamjack';
import type { JackGridCell } from '../../../../types';
import './JackDamageGrid.styles.css';

const labelOf = (type: string) => GRID_CELL_TYPES.find((cell) => cell.type === type)?.label ?? type;

export function JackDamageGrid() {
  const [grid, setGrid] = useSheetField<JackGridCell[]>('grid');
  const [editing, setEditing] = useState(false);
  const cells = grid ?? [];

  const onCell = (index: number) => {
    const cell = cells[index];
    if (!cell) return;
    const next = [...cells];
    if (editing) {
      const position = GRID_CELL_TYPES.findIndex((option) => option.type === cell.type);
      next[index] = { type: GRID_CELL_TYPES[(position + 1) % GRID_CELL_TYPES.length].type, damaged: false };
    } else if (cell.type) {
      next[index] = { ...cell, damaged: !cell.damaged };
    }
    setGrid(next);
  };

  const systems = [...new Set(cells.map((cell) => cell.type).filter((type) => CRIPPLED_SYSTEMS[type]))];
  const crippled = systems.filter((type) => cells.every((cell) => cell.type !== type || cell.damaged));
  const boxes = cells.filter((cell) => cell.type);

  return (
    <Panel
      title="Damage grid"
      className="jack-damage-grid-container"
      actions={
        <button type="button" aria-pressed={editing} onClick={() => setEditing(!editing)}>
          {editing ? 'Done editing layout' : 'Edit layout'}
        </button>
      }
    >
      <p className="ik-note">
        {editing
          ? 'Click a box to cycle it through: no box, hull, L, R, H, M, C, A. Set this up to match the chassis.'
          : 'Click a box to mark or clear damage.'}{' '}
        {boxes.filter((cell) => cell.damaged).length} of {boxes.length} boxes damaged.
      </p>
      <div className="jack-damage-grid-columns" aria-hidden="true">
        {Array.from({ length: GRID_COLUMNS }, (_, column) => (
          <span key={column}>{column + 1}</span>
        ))}
      </div>
      <div className={editing ? 'jack-damage-grid jack-damage-grid-editing' : 'jack-damage-grid'}>
        {cells.slice(0, GRID_COLUMNS * GRID_ROWS).map((cell, index) => {
          const column = Math.floor(index / GRID_ROWS) + 1;
          const row = (index % GRID_ROWS) + 1;
          const name = cell.type ? labelOf(cell.type) : 'no box';
          return (
            <button
              key={index}
              type="button"
              className={[
                'jack-damage-grid-cell',
                !cell.type && 'jack-damage-grid-cell-empty',
                cell.damaged && 'jack-damage-grid-cell-damaged',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-label={`Column ${column}, row ${row}: ${name}${cell.damaged ? ', damaged' : ''}`}
              disabled={!editing && !cell.type}
              onClick={() => onCell(index)}
            >
              {cell.type !== 'hull' && cell.type}
            </button>
          );
        })}
      </div>
      {crippled.map((type) => (
        <p key={type} className="ik-warning" role="status">
          Crippled {labelOf(type).toLowerCase()}: {CRIPPLED_SYSTEMS[type]}
        </p>
      ))}
    </Panel>
  );
}
