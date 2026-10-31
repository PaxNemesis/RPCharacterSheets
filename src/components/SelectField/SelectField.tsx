import { Field } from '@/components/Field'
import { useSheetField } from '@/components/SheetProvider'
import type { SelectOption } from './SelectField.types'

type SelectFieldProps = {
  path: string
  label: string
  options: SelectOption[]
  hideLabel?: boolean
  className?: string
}

export function SelectField({ path, label, options, hideLabel, className }: SelectFieldProps) {
  const [value, setValue] = useSheetField<string | undefined>(path)

  return (
    <Field label={label} hideLabel={hideLabel} className={className}>
      {(id) => (
        <select id={id} value={value ?? ''} onChange={(event) => setValue(event.target.value)}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  )
}
