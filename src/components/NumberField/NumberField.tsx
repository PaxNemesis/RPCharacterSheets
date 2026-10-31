import { Field } from '@/components/Field'
import { NumberInput } from './components'
import './NumberField.styles.css'

type NumberFieldProps = {
  label: string
  hideLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
} & (
  | { path: string; value?: never }
  /** A calculated value: shown read-only and shaded. */
  | { value: number | null; path?: never }
)

export function NumberField({ label, hideLabel, size = 'md', className, path, value }: NumberFieldProps) {
  const classes = ['number-field-container', `number-field-${size}`, className]

  return (
    <Field label={label} hideLabel={hideLabel} className={classes.filter(Boolean).join(' ')}>
      {(id) =>
        path !== undefined ? (
          <NumberInput id={id} path={path} />
        ) : (
          <input
            id={id}
            type="text"
            readOnly
            tabIndex={-1}
            title="Calculated automatically"
            value={value ?? ''}
          />
        )
      }
    </Field>
  )
}
