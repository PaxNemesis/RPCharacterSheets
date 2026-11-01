import type { SelectOption } from '@/components/SelectField'

export type RepeatTableRow = Record<string, unknown>

export type RepeatTableColumn = {
  key: string
  label: string
  /** CSS grid track size, e.g. `2fr` or `64px`. Defaults to `1fr`. */
  width?: string
  /** Shown on its own line under the row's other cells, with the label as placeholder instead of a header. */
  wide?: boolean
} & (
  | {
      type?: 'text'
      rows?: number
      suggestions?: string[]
      /** Returns the whole row to store when a suggestion is picked, e.g. to fill in a preset's values. */
      onPick?: (value: string, row: RepeatTableRow) => RepeatTableRow
    }
  | { type: 'number' }
  | { type: 'select'; options: SelectOption[] }
  /** Read-only, worked out from the row's other values. */
  | { type: 'calculated'; calculate: (row: RepeatTableRow) => number | null }
)
