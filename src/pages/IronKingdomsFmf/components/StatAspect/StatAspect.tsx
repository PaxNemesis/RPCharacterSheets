import type { CSSProperties, ReactNode } from 'react';
import './StatAspect.styles.css';

type StatAspectProps = {
  /** The aspect's name, such as Physique. */
  label: string;
  /** The aspect's colour, for the left edge and the heading. */
  color: string;
  /** One cell per stat, in three columns; a missing stat (a jack's ARC) can be left out with `null`. */
  children: ReactNode;
};

/** One aspect's stats in a box with the aspect's colour, as on the character and steamjack sheets. */
export function StatAspect({ label, color, children }: StatAspectProps) {
  return (
    <div className="stat-aspect-container" style={{ '--aspect-color': color } as CSSProperties}>
      <h3>{label}</h3>
      <div className="stat-aspect-row">{children}</div>
    </div>
  );
}
