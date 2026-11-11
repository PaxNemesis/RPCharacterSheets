import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useRef, type CSSProperties } from 'react';
import { useSheetField } from '@/components/SheetProvider';
import { RepeatTableRow } from './components';
import { useRowIds } from '@/hooks/useRowIds';
import { useStackedLayout } from './hooks/useStackedLayout';
import type { RepeatTableColumn, RepeatTableRow as Row, RepeatTableRowAction } from './RepeatTable.types';
import { announcements } from './utils/announcements';
import './RepeatTable.styles.css';

type RepeatTableProps = {
  /** Path to the array of rows. */
  path: string;
  columns: RepeatTableColumn[];
  createRow: () => Row;
  /** Used in button and screen reader labels, e.g. "skill". */
  itemName: string;
  /** An extra button next to each row's remove button. */
  rowAction?: RepeatTableRowAction;
};

export function RepeatTable({ path, columns, createRow, itemName, rowAction }: RepeatTableProps) {
  const [rows, setRows] = useSheetField<Row[] | undefined>(path);
  const list = rows ?? [];
  const rowIds = useRowIds(list.length);
  const scrollRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const narrow = columns.filter((column) => !column.wide);
  // Narrow containers show each row as a card with labelled cells instead of scrolling sideways, with
  // as many cells side by side as fit.
  const { stacked, columns: cardColumns } = useStackedLayout(scrollRef, gridRef, narrow.length);
  const wide = columns.filter((column) => column.wide);
  // The last column holds the remove button, and the row action's button when there is one.
  const template = `24px ${narrow.map((column) => column.width ?? '1fr').join(' ')} ${rowAction ? '60px' : '28px'}`;
  // A short drag distance keeps clicks on the handle from starting a drag.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const remove = (index: number) => {
    rowIds.remove(index);
    setRows(list.filter((_, i) => i !== index));
  };

  const act = (index: number) => {
    const row = list[index];
    remove(index);
    rowAction?.onClick(row);
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    const from = rowIds.ids.indexOf(String(active.id));
    const to = over ? rowIds.ids.indexOf(String(over.id)) : -1;
    if (from < 0 || to < 0 || from === to) return;
    rowIds.move(from, to);
    setRows(arrayMove(list, from, to));
  };

  return (
    <div
      className={stacked ? 'repeat-table-container repeat-table-stacked' : 'repeat-table-container'}
      style={stacked ? ({ '--repeat-table-card-columns': cardColumns } as CSSProperties) : undefined}
    >
      <div ref={scrollRef} className="repeat-table-scroll">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          accessibility={{ announcements: announcements(rowIds.ids, itemName) }}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={rowIds.ids} strategy={verticalListSortingStrategy}>
            <div ref={gridRef} className="repeat-table-grid" style={{ gridTemplateColumns: template }} role="table">
              {list.length > 0 && (
                <div className="repeat-table-row repeat-table-head" role="row">
                  <span />
                  {narrow.map((column) => (
                    <span key={column.key} role="columnheader">
                      {column.label}
                    </span>
                  ))}
                  <span />
                </div>
              )}
              {rowIds.ids.map((id, index) => (
                <RepeatTableRow
                  key={id}
                  id={id}
                  path={`${path}.${index}`}
                  rowLabel={`${itemName} ${index + 1}`}
                  itemName={itemName}
                  narrow={narrow}
                  wide={wide}
                  cardColumns={stacked ? cardColumns : undefined}
                  onRemove={() => remove(index)}
                  action={rowAction}
                  onAction={() => act(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      <button type="button" className="repeat-table-add" onClick={() => setRows([...list, createRow()])}>
        + Add {itemName}
      </button>
    </div>
  );
}
