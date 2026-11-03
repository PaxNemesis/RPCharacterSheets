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
  /** Called when one of the suggestions is picked. */
  onPick?: (value: string) => void
  /** Called after each edit, once the new value is stored. */
  onChange?: (value: string) => void
  /** Called when the user is done editing: Enter or leaving the field (and picking a suggestion). */
  onCommit?: () => void
  className?: string
}

export function TextField({
  path,
  label,
  hideLabel,
  rows = 1,
  placeholder,
  suggestions,
  onPick,
  onChange,
  onCommit,
  className,
}: TextFieldProps) {
  const [value, store] = useSheetField<string | undefined>(path)
  const setValue = (next: string) => {
    store(next)
    onChange?.(next)
  }

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
            onBlur={onCommit}
          />
        ) : suggestions ? (
          <SuggestionInput
            id={id}
            value={value ?? ''}
            placeholder={placeholder}
            suggestions={suggestions}
            onChange={setValue}
            onPick={onPick}
            onCommit={onCommit}
          />
        ) : (
          <input
            id={id}
            type="text"
            value={value ?? ''}
            placeholder={placeholder}
            onChange={(event) => setValue(event.target.value)}
            onBlur={onCommit}
            onKeyDown={(event) => event.key === 'Enter' && onCommit?.()}
          />
        )
      }
    </Field>
  )
}
