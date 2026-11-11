import type { Track } from '../../ConflictBar.types';
import './TrackDots.styles.css';

type TrackDotsProps = {
  track: Track;
};

/** A row of dots, filled from the start: Soul Beads or a Growth Clock at a glance. */
export function TrackDots({ track: { filled, size, tone } }: TrackDotsProps) {
  return (
    <span className={tone === 'resolve' ? 'track-dots-container track-dots-resolve' : 'track-dots-container'}>
      {Array.from({ length: Math.max(0, size) }, (_, index) => (
        <i key={index} className={index < filled ? 'track-dots-filled' : undefined} />
      ))}
    </span>
  );
}
