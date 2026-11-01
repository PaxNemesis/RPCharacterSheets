import type { Announcements, UniqueIdentifier } from '@dnd-kit/core'

/** Screen reader messages that name rows by position, e.g. "Moved skill 3 to position 1 of 7.", not by internal id. */
export function announcements(ids: string[], itemName: string): Announcements {
  const position = (id: UniqueIdentifier) => ids.indexOf(String(id)) + 1
  return {
    onDragStart: ({ active }) => `Picked up ${itemName} ${position(active.id)}.`,
    onDragOver: ({ active, over }) =>
      over ? `Moved ${itemName} ${position(active.id)} to position ${position(over.id)} of ${ids.length}.` : undefined,
    onDragEnd: ({ active, over }) =>
      over ? `Dropped ${itemName} ${position(active.id)} at position ${position(over.id)} of ${ids.length}.` : undefined,
    onDragCancel: ({ active }) => `Stopped moving ${itemName} ${position(active.id)}; it stays where it was.`,
  }
}
