import { TrackDots } from '../../TrackDots';
import type { ClassStatus } from '../../../ConflictBar.types';

type ClassesColumnProps = {
  statuses: ClassStatus[];
  onPanelChange: (panel: string) => void;
};

/** Each class at a glance, read only; its name opens the tab with the full controls. */
export function ClassesColumn({ statuses, onPanelChange }: ClassesColumnProps) {
  return (
    <section className="conflict-drawer-column" aria-labelledby="conflict-drawer-classes">
      <h3 id="conflict-drawer-classes" className="conflict-drawer-badge">
        Classes
      </h3>
      <ul className="conflict-drawer-classes">
        {statuses.map((status) => (
          <li key={status.panel}>
            <button type="button" className="conflict-drawer-link" onClick={() => onPanelChange(status.panel)}>
              {status.label}
            </button>
            <span>
              {status.summary}
              {status.tracks?.map((track) => (
                <TrackDots key={track.tone ?? 'core'} track={track} />
              ))}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
