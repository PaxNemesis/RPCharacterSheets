import { Panel } from '@/components/Panel';
import { TextField } from '@/components/TextField';

export function NotesSection() {
  return (
    <div className="fu-section">
      <Panel title="Notes & background">
        <TextField path="notes.general" label="Notes" hideLabel rows={14} />
      </Panel>
    </div>
  );
}
