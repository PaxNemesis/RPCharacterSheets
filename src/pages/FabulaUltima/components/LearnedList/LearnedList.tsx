import type { ReactNode } from 'react'
import { Panel } from '@/components/Panel'
import { useSheet } from '@/components/SheetProvider'
import { LearnedCard } from './components'
import './LearnedList.styles.css'

type LearnedListProps = {
  title: string
  /** What one entry is called, for the picker: "dance". */
  noun: string
  /** Every entry that can be learned, with its book and page and a short line of data. */
  entries: { name: string; ref: string; detail?: string }[]
  /** Path to the list of learned names. */
  path: string
  /** Path to the player's notes, by name. */
  notesPath: string
  /** Learned entries counted against the limit, when that covers more than this list. */
  count?: number
  limit: number
  /** How the limit is worked out, after "Learned 2 of 3: ". */
  limitNote: string
  /** The entry in use right now, such as the dance performed this turn. */
  highlight?: string
  /** Buttons for an entry's card, such as Perform. */
  renderActions?: (name: string) => ReactNode
}

/** The dances, symbols, keys or tones a character has learned, each with the player's notes. */
export function LearnedList({ title, noun, entries, path, notesPath, count, limit, limitNote, highlight, renderActions }: LearnedListProps) {
  const { get, set } = useSheet()
  const names = get(path) as string[]
  // Names that aren't in the rulebook, such as from a hand-edited file, are left out.
  const learned = entries.filter((entry) => names.includes(entry.name))
  const unlearned = entries.filter((entry) => !names.includes(entry.name))
  const total = count ?? learned.length

  return (
    <Panel
      title={title}
      className="learned-list-container"
      actions={
        unlearned.length > 0 && (
          <select
            aria-label={`Learn a ${noun}`}
            value=""
            onChange={(event) => event.target.value && set(path, [...names, event.target.value])}
          >
            <option value="">Learn {noun}…</option>
            {unlearned.map((entry) => (
              <option key={entry.name} value={entry.name}>
                {entry.name}
              </option>
            ))}
          </select>
        )
      }
    >
      <p className={total > limit ? 'fu-warning' : 'fu-note'}>
        Learned {total} of {limit}: {limitNote}
      </p>
      {learned.length > 0 && (
        <div className="learned-list-grid">
          {learned.map((entry) => (
            <LearnedCard
              key={entry.name}
              entry={entry}
              notesPath={`${notesPath}.${entry.name}`}
              highlighted={entry.name === highlight}
              actions={renderActions?.(entry.name)}
              onForget={() => set(path, names.filter((other) => other !== entry.name))}
            />
          ))}
        </div>
      )}
    </Panel>
  )
}
