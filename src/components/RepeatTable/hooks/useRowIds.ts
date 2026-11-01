import { arrayMove } from '@dnd-kit/sortable'
import { useState } from 'react'

let lastId = 0
const newId = () => `row-${++lastId}`

/** Adds or drops ids at the end until there is one per row. */
const fit = (ids: string[], count: number) =>
  ids.length < count
    ? [...ids, ...Array.from({ length: count - ids.length }, newId)]
    : ids.length > count
      ? ids.slice(0, count)
      : ids

/**
 * An id per row while the page is open, so a row keeps its identity when rows are moved or
 * removed. Rows added from outside the table always go on the end, so the ids only need to grow
 * or shrink at the end to keep up; the table updates them itself when it moves or removes a row.
 */
export function useRowIds(count: number) {
  const [ids, setIds] = useState<string[]>(() => fit([], count))
  const fitted = fit(ids, count)
  // Adjusting state during render: React re-renders straight away with the fitted ids.
  if (fitted !== ids) setIds(fitted)

  return {
    ids: fitted,
    remove: (index: number) => setIds((current) => current.filter((_, i) => i !== index)),
    move: (from: number, to: number) => setIds((current) => arrayMove(current, from, to)),
  }
}
