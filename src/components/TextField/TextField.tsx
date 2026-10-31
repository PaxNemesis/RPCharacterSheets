import { Field } from '@/components/Field'
import { useSheetField } from '@/components/SheetProvider'
import { SuggestionInput } from './components'

type TextFieldProps = {
  path: string
  label: string
  hideLabel?: boolean
  /** Number of visible lines; above 1 renders a textarea. */
  rows?: number
  placeholder?: string
  /** Values offered while typing; any other text is still allowed. */
  suggestions?: string[]
  className?: string
}

export function TextField({ path, label, hideLabel, rows = 1, placeholder, suggestions, className }: TextFieldProps) {
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
        ) : suggestions ? (
          <SuggestionInput
            id={id}
            value={value ?? ''}
            placeholder={placeholder}
            suggestions={suggestions}
            onChange={setValue}
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
