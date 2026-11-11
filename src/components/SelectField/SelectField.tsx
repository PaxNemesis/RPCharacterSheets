import { Field } from '@/components/Field';
import { useSheetField } from '@/components/SheetProvider';
import type { SelectOption } from './SelectField.types';

type SelectFieldProps = {
  path: string;
  label: string;
  options: SelectOption[];
  hideLabel?: boolean;
  className?: string;
  /** Called after the value is saved, for changes that follow from it. */
  onChange?: (value: string) => void;
};

export function SelectField({ path, label, options, hideLabel, className, onChange }: SelectFieldProps) {
  const [value, setValue] = useSheetField<string | undefined>(path);

  return (
    <Field label={label} hideLabel={hideLabel} className={className}>
      {(id) => (
        <select
          id={id}
          value={value ?? ''}
          onChange={(event) => {
            setValue(event.target.value);
            onChange?.(event.target.value);
          }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}
