import { useEffect, useRef } from 'react'
import type { ConflictChoice } from './ConflictDialog.types'
import './ConflictDialog.styles.css'

type ConflictDialogProps = {
  /** The characters from the files that are already open, with when their file was saved. */
  items: { key: string; name: string; openName: string; savedAt?: string }[]
  /** How many other characters from the files were opened without asking. */
  opened: number
  onChoose: (choice: ConflictChoice) => void
}

const savedLabel = (savedAt?: string) => {
  const date = savedAt ? new Date(savedAt) : undefined
  return date && !Number.isNaN(date.getTime())
    ? `file saved ${date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}`
    : 'file saved at an unknown time'
}

/** Asks once what to do with every opened character that already has a tab: replace, copy or skip. */
export function ConflictDialog({ items, opened, onChoose }: ConflictDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const one = items.length === 1

  useEffect(() => {
    ref.current?.showModal()
  }, [])

  return (
    <dialog
      ref={ref}
      className="conflict-dialog-container"
      aria-labelledby="conflict-dialog-title"
      // Escape leaves the open tabs as they are.
      onCancel={(event) => {
        event.preventDefault()
        onChoose('skip')
      }}
    >
      <h2 id="conflict-dialog-title">{one ? 'This character is already open' : `${items.length} characters are already open`}</h2>
      <ul>
        {items.map((item) => (
          <li key={item.key}>
            <strong>{item.name}</strong>{' '}
            <span className="conflict-dialog-saved">
              ({savedLabel(item.savedAt)}
              {item.openName !== item.name && `; open as ${item.openName}`})
            </span>
          </li>
        ))}
      </ul>
      <p>
        Replace the open {one ? 'tab' : 'tabs'} with the saved {one ? 'version' : 'versions'}, open{' '}
        {one ? 'it' : 'them'} as a separate copy, or skip {one ? 'it' : 'them'}.
        {opened > 0 && ` The other ${opened === 1 ? 'character has' : `${opened} characters have`} been opened.`}
      </p>
      <div className="conflict-dialog-actions">
        <button type="button" className="conflict-dialog-danger" onClick={() => onChoose('replace')}>
          Replace
        </button>
        <button type="button" onClick={() => onChoose('copy')}>
          Open as copy
        </button>
        <button type="button" onClick={() => onChoose('skip')}>
          Skip
        </button>
      </div>
    </dialog>
  )
}
