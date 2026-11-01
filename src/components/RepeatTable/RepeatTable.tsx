import { SheetProvider, useSheetField } from '@/components/SheetProvider'
import { RepeatTableCell } from './components'
import type { RepeatTableColumn, RepeatTableRow } from './RepeatTable.types'
import './RepeatTable.styles.css'

type RepeatTableProps = {
  /** Path to the array of rows. */
  path: string
  columns: RepeatTableColumn[]
  createRow: () => RepeatTableRow
  /** Used in button and screen reader labels, e.g. "skill". */
  itemName: string
}

export function RepeatTable({ path, columns, createRow, itemName }: RepeatTableProps) {
  const [rows, setRows] = useSheetField<RepeatTableRow[] | undefined>(path)
  const list = rows ?? []
  const narrow = columns.filter((column) => !column.wide)
  const wide = columns.filter((column) => column.wide)
  const template = `${narrow.map((column) => column.width ?? '1fr').join(' ')} 28px`

  return (
    <div className="repeat-table-container">
      <div className="repeat-table-scroll">
        <div className="repeat-table-grid" style={{ gridTemplateColumns: template }} role="table">
          {list.length > 0 && (
            <div className="repeat-table-row repeat-table-head" role="row">
              {narrow.map((column) => (
                <span key={column.key} role="columnheader">
                  {column.label}
                </span>
              ))}
              <span />
            </div>
          )}
          {list.map((_, index) => (
            <div key={index} className="repeat-table-row" role="row">
              <SheetProvider path={`${path}.${index}`}>
                {narrow.map((column) => (
                  <div key={column.key} role="cell">
                    <RepeatTableCell column={column} rowLabel={`${itemName} ${index + 1}`} />
                  </div>
                ))}
              </SheetProvider>
              <button
                type="button"
                className="repeat-table-remove"
                aria-label={`Remove ${itemName} ${index + 1}`}
                title={`Remove ${itemName}`}
                onClick={() => setRows(list.filter((__, i) => i !== index))}
              >
                ×
              </button>
              {/* After the remove button, so wide cells wrap onto their own lines. */}
              <SheetProvider path={`${path}.${index}`}>
                {wide.map((column) => (
                  <div key={column.key} role="cell" className="repeat-table-wide">
                    <RepeatTableCell column={column} rowLabel={`${itemName} ${index + 1}`} />
                  </div>
                ))}
              </SheetProvider>
            </div>
          ))}
        </div>
      </div>
      <button type="button" className="repeat-table-add" onClick={() => setRows([...list, createRow()])}>
        + Add {itemName}
      </button>
    </div>
  )
}
