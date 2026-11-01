import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SheetProvider } from '@/components/SheetProvider'
import type { RepeatTableColumn } from '../RepeatTable.types'
import { RepeatTableCell } from './RepeatTableCell'

type RepeatTableRowProps = {
  id: string
  /** Path to this row, e.g. `skills.3`. */
  path: string
  rowLabel: string
  itemName: string
  narrow: RepeatTableColumn[]
  wide: RepeatTableColumn[]
  onRemove: () => void
}

/** One row: a drag handle, the cells, the remove button, then any full-width cells. */
export function RepeatTableRow({ id, path, rowLabel, itemName, narrow, wide, onRemove }: RepeatTableRowProps) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      className={['repeat-table-row', isDragging && 'repeat-table-dragging'].filter(Boolean).join(' ')}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      role="row"
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        className="repeat-table-handle"
        {...attributes}
        {...listeners}
        aria-label={`Move ${rowLabel}`}
        title={`Drag to move this ${itemName}`}
      >
        ⋮⋮
      </button>
      <SheetProvider path={path}>
        {narrow.map((column) => (
          <div key={column.key} role="cell">
            <RepeatTableCell column={column} rowLabel={rowLabel} />
          </div>
        ))}
      </SheetProvider>
      <button
        type="button"
        className="repeat-table-remove"
        aria-label={`Remove ${rowLabel}`}
        title={`Remove ${itemName}`}
        onClick={onRemove}
      >
        ×
      </button>
      {/* After the remove button, so wide cells wrap onto their own lines. */}
      <SheetProvider path={path}>
        {wide.map((column) => (
          <div key={column.key} role="cell" className="repeat-table-wide">
            <RepeatTableCell column={column} rowLabel={rowLabel} />
          </div>
        ))}
      </SheetProvider>
    </div>
  )
}
