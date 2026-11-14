import { useId } from 'react';
import { Icon, type IconName } from '@/components/Icon';

type SegmentedControlProps<T extends string | number> = {
  label: string;
  options: readonly { value: T; label: string; icon?: IconName }[];
  value: T;
  onChange: (value: T) => void;
};

/** A row of radio buttons drawn as joined segments, with the arrow keys moving between them. */
export function SegmentedControl<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const name = useId();

  return (
    <fieldset className="settings-menu-group">
      <legend>{label}</legend>
      <div className="settings-menu-segments">
        {options.map((option) => (
          <label key={option.value} className="settings-menu-segment">
            <input type="radio" name={name} checked={option.value === value} onChange={() => onChange(option.value)} />
            {option.icon && <Icon name={option.icon} />}
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
