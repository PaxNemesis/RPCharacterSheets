import type { RepeatTableColumn } from '@/components/RepeatTable'

/**
 * Columns for name, description and page lists such as abilities and connections. With `pageOf`,
 * picking a suggested name fills in its page.
 */
export const entryColumns = (suggestions?: string[], pageOf?: (name: string) => string | undefined): RepeatTableColumn[] => [
  {
    key: 'name',
    label: 'Name',
    width: 'minmax(120px, 1fr)',
    suggestions,
    onPick: pageOf && ((name, row) => ({ ...row, page: pageOf(name) || row.page })),
  },
  { key: 'description', label: 'Description / notes', width: 'minmax(200px, 3fr)', rows: 2 },
  { key: 'page', label: 'Page', width: '60px' },
]
