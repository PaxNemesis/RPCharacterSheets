import type { CSSProperties } from 'react'
import { useSheetField } from '@/components/SheetProvider'
import './CheckTrack.styles.css'

type CheckTrackProps = {
  /** Path to the number of marked boxes. */
  path: string
  /** Number of boxes in the track. */
  size: number
  label: string
  color?: string
  /** 'cross' for something used up, such as damage; 'fill' for something held, such as beads. */
  mark?: 'cross' | 'fill'
}

// A row of boxes filled from the start: clicking box n marks n boxes, clicking the last marked box unmarks it.
export function CheckTrack({ path, size, label, color, mark = 'cross' }: CheckTrackProps) {
  const [marked, setMarked] = useSheetField<number | undefined>(path)
  const count = Math.min(marked ?? 0, size)

  return (
    <div
      className={mark === 'fill' ? 'check-track-container check-track-fill' : 'check-track-container'}
      role="group"
      aria-label={`${label}: ${count} of ${size} marked`}
      style={color ? { '--check-track-color': color } as CSSProperties : undefined}
    >
      {Array.from({ length: size }, (_, index) => {
        const isMarked = index < count
        return (
          <button
            key={index}
            type="button"
            className={isMarked ? 'check-track-box check-track-box-marked' : 'check-track-box'}
            aria-pressed={isMarked}
            aria-label={`${label} box ${index + 1}`}
            onClick={() => setMarked(index + 1 === count ? index : index + 1)}
          />
        )
      })}
      {size === 0 && <span className="check-track-empty">—</span>}
    </div>
  )
}
