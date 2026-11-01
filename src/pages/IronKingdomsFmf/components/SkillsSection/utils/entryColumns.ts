import type { RepeatTableColumn } from '@/components/RepeatTable'

/** Columns for name, description and page lists such as abilities and connections. */
export const entryColumns = (suggestions?: string[]): RepeatTableColumn[] => [
  { key: 'name', label: 'Name', width: 'minmax(120px, 1fr)', suggestions },
  { key: 'description', label: 'Description / notes', width: 'minmax(200px, 3fr)', rows: 2 },
  { key: 'page', label: 'Page', width: '60px' },
]
