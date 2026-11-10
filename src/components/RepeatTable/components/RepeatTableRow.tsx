import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Icon } from '@/components/Icon'
import { SheetProvider } from '@/components/SheetProvider'
import type { RepeatTableColumn, RepeatTableRowAction } from '../RepeatTable.types'
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
  action?: RepeatTableRowAction
  onAction: () => void
}

/** One row: a drag handle, the cells, the action and remove buttons, then any full-width cells. */
export function RepeatTableRow({ id, path, rowLabel, itemName, narrow, wide, onRemove, action, onAction }: RepeatTableRowProps) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id })
  const removeButton = (
    <button
      type="button"
      className="repeat-table-remove"
      aria-label={`Remove ${rowLabel}`}
      title={`Remove ${itemName}`}
      onClick={onRemove}
    >
      ×
    </button>
  )

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
            {/* Shown instead of the column header when rows stack as cards; screen readers use the field's own label. */}
            <span className="repeat-table-cell-label" aria-hidden="true">
              {column.label}
            </span>
            <RepeatTableCell column={column} rowLabel={rowLabel} />
          </div>
        ))}
      </SheetProvider>
      {action ? (
        <div className="repeat-table-actions">
          <button
            type="button"
            className="repeat-table-action"
            aria-label={`${action.label} ${rowLabel}`}
            title={action.title}
            onClick={onAction}
          >
            <Icon name={action.icon} className="repeat-table-action-icon" />
          </button>
          {removeButton}
        </div>
      ) : (
        removeButton
      )}
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
