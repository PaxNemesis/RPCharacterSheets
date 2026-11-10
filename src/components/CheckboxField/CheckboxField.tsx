import { useId } from 'react';
import { useSheetField } from '@/components/SheetProvider';
import './CheckboxField.styles.css';

type CheckboxFieldProps = {
  path: string;
  label: string;
  description?: string;
};

export function CheckboxField({ path, label, description }: CheckboxFieldProps) {
  const [checked, setChecked] = useSheetField<boolean | undefined>(path);
  const id = useId();

  return (
    <div className="checkbox-field-container">
      <input
        id={id}
        type="checkbox"
        checked={checked ?? false}
        onChange={(event) => setChecked(event.target.checked)}
      />
      <label htmlFor={id}>
        <span className="checkbox-field-label">{label}</span>
        {description && <span className="checkbox-field-description">{description}</span>}
      </label>
    </div>
  );
}
