import type { BarChip } from '../../ConflictBar.types';
import { TrackDots } from '../TrackDots';
import './BarChips.styles.css';

type BarChipsProps = {
  chips: BarChip[];
};

/** The bar's second line: one chip for each thing happening right now. */
export function BarChips({ chips }: BarChipsProps) {
  return (
    <ul className="bar-chips-container" aria-label="Happening now">
      {chips.map((chip) => (
        <li key={chip.key} className={chip.due ? 'bar-chips-chip bar-chips-due' : 'bar-chips-chip'} title={chip.title}>
          {chip.text}
          {chip.tracks?.map((track) => (
            <TrackDots key={track.tone ?? 'core'} track={track} />
          ))}
          {chip.note && <span className="bar-chips-note">{chip.note}</span>}
          {/* The hover text, for screen readers too. */}
          {chip.title && <span className="bar-chips-hidden">: {chip.title}</span>}
        </li>
      ))}
    </ul>
  );
}
