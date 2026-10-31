import type { SelectOption } from '@/components/SelectField'

export type RepeatTableRow = Record<string, unknown>

export type RepeatTableColumn = {
  key: string
  label: string
  /** CSS grid track size, e.g. `2fr` or `64px`. Defaults to `1fr`. */
  width?: string
} & (
  | { type?: 'text'; rows?: number }
  | { type: 'number' }
  | { type: 'select'; options: SelectOption[] }
  /** Read-only, worked out from the row's other values. */
  | { type: 'calculated'; calculate: (row: RepeatTableRow) => number | null }
)
