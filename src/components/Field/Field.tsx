import { useId, type ReactNode } from 'react';
import './Field.styles.css';

type FieldProps = {
  label: string;
  /** Keeps the label for screen readers only, e.g. inside table rows. */
  hideLabel?: boolean;
  className?: string;
  children: (id: string) => ReactNode;
};

export function Field({ label, hideLabel, className, children }: FieldProps) {
  const id = useId();
  return (
    <div className={['field-container', className].filter(Boolean).join(' ')}>
      <label htmlFor={id} className={hideLabel ? 'field-label field-label-hidden' : 'field-label'}>
        {label}
      </label>
      {children(id)}
    </div>
  );
}
