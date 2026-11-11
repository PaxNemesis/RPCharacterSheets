import type { ClassStatus } from '../../../ConflictBar.types';

type ClassStatusListProps = {
  statuses: ClassStatus[];
  onPanelChange: (panel: string) => void;
};

/** Each class's summary, with a link to its tab for the full controls. */
export function ClassStatusList({ statuses, onPanelChange }: ClassStatusListProps) {
  return (
    <div className="conflict-drawer-section">
      <h3 className="conflict-drawer-heading">Classes</h3>
      <ul className="conflict-drawer-classes">
        {statuses.map((status) => (
          <li key={status.panel}>
            <button type="button" className="conflict-drawer-link" onClick={() => onPanelChange(status.panel)}>
              {status.label}
            </button>
            <span>{status.summary}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
