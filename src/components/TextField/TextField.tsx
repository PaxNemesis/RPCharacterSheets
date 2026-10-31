import { Field } from '@/components/Field'
import { useSheetField } from '@/components/SheetProvider'

type TextFieldProps = {
  path: string
  label: string
  hideLabel?: boolean
  /** Number of visible lines; above 1 renders a textarea. */
  rows?: number
  placeholder?: string
  className?: string
}

export function TextField({ path, label, hideLabel, rows = 1, placeholder, className }: TextFieldProps) {
  const [value, setValue] = useSheetField<string | undefined>(path)

  return (
    <Field label={label} hideLabel={hideLabel} className={className}>
      {(id) =>
        rows > 1 ? (
          <textarea
            id={id}
            rows={rows}
            value={value ?? ''}
            placeholder={placeholder}
            onChange={(event) => setValue(event.target.value)}
          />
        ) : (
          <input
            id={id}
            type="text"
            value={value ?? ''}
            placeholder={placeholder}
            onChange={(event) => setValue(event.target.value)}
          />
        )
      }
    </Field>
  )
}
