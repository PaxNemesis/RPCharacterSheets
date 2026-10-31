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
  const template = `${columns.map((column) => column.width ?? '1fr').join(' ')} 28px`

  return (
    <div className="repeat-table-container">
      <div className="repeat-table-scroll">
        <div className="repeat-table-grid" style={{ gridTemplateColumns: template }} role="table">
          {list.length > 0 && (
            <div className="repeat-table-row repeat-table-head" role="row">
              {columns.map((column) => (
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
                {columns.map((column) => (
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
