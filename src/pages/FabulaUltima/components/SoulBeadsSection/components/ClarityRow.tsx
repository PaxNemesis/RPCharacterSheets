import { CheckboxField } from '@/components/CheckboxField';
import { Field } from '@/components/Field';
import { Icon } from '@/components/Icon';
import { SelectField } from '@/components/SelectField';
import { useSheet } from '@/components/SheetProvider';
import { CLARITY_KINDS } from '../../../constants/monk';
import type { FuClarity } from '../../../types';

type ClarityRowProps = {
  index: number;
  benefit: FuClarity;
  active: boolean;
  /** Whether Resonant Clarity is learned, so benefits can be shared. */
  canShare: boolean;
  onRemove: () => void;
};

/** One Clarity benefit: its kind, what it applies to, whether it is active and shared. */
export function ClarityRow({ index, benefit, active, canShare, onRemove }: ClarityRowProps) {
  const { set } = useSheet();
  const path = `monk.clarity.${index}`;
  const kind = CLARITY_KINDS.find((entry) => entry.key === benefit.kind);

  return (
    <li className={active ? 'soul-beads-section-benefit soul-beads-section-active' : 'soul-beads-section-benefit'}>
      <span className="soul-beads-section-state">{active ? 'Active' : 'Inactive'}</span>
      <Field label={`Benefit ${index + 1}`} hideLabel>
        {(id) => (
          <select
            id={id}
            value={benefit.kind}
            // A new kind has different choices, so the old one is cleared.
            onChange={(event) => set(path, { ...benefit, kind: event.target.value, choice: '' })}
          >
            <option value="">Choose a benefit…</option>
            {CLARITY_KINDS.map((entry) => (
              <option key={entry.key} value={entry.key}>
                {entry.label}
              </option>
            ))}
          </select>
        )}
      </Field>
      <SelectField
        path={`${path}.choice`}
        label={`Benefit ${index + 1} applies to`}
        hideLabel
        options={[
          { value: '', label: kind ? 'Choose…' : '—' },
          ...(kind?.choices ?? []).map((choice) => ({ value: choice, label: choice })),
        ]}
      />
      {canShare ? <CheckboxField path={`${path}.shared`} label="Shared" /> : <span />}
      <button
        type="button"
        className="soul-beads-section-remove"
        onClick={onRemove}
        title="Remove"
        aria-label={`Remove benefit ${index + 1}`}
      >
        <Icon name="delete" className="soul-beads-section-icon" />
      </button>
    </li>
  );
}
