import { NumberField } from '@/components/NumberField'
import { SelectField } from '@/components/SelectField'
import { useSheet } from '@/components/SheetProvider'
import { TextField } from '@/components/TextField'
import type { RepeatTableColumn, RepeatTableRow } from '../RepeatTable.types'

type RepeatTableCellProps = {
  column: RepeatTableColumn
  rowLabel: string
}

export function RepeatTableCell({ column, rowLabel }: RepeatTableCellProps) {
  const { get } = useSheet()
  const label = `${column.label}, ${rowLabel}`

  switch (column.type) {
    case 'number':
      return <NumberField path={column.key} label={label} hideLabel size="sm" />
    case 'select':
      return <SelectField path={column.key} label={label} hideLabel options={column.options} />
    case 'calculated':
      return (
        <NumberField
          value={column.calculate((get('') ?? {}) as RepeatTableRow)}
          label={label}
          hideLabel
          size="sm"
        />
      )
    default:
      return (
        <TextField
          path={column.key}
          label={label}
          hideLabel
          rows={column.rows}
          placeholder={column.wide ? column.label : undefined}
          suggestions={column.suggestions}
        />
      )
  }
}
