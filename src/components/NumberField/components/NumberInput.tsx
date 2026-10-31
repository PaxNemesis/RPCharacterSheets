import { useState } from 'react'
import { useSheetField } from '@/components/SheetProvider'

type NumberInputProps = {
  id: string
  path: string
}

const format = (value: number | null | undefined) => (value == null ? '' : String(value))

const parse = (text: string) => {
  const trimmed = text.trim()
  if (trimmed === '' || trimmed === '-' || trimmed === '+') return null
  const number = Number(trimmed)
  return Number.isFinite(number) ? number : undefined
}

// Keeps the typed text as a draft so partial input like "-" isn't wiped while typing.
export function NumberInput({ id, path }: NumberInputProps) {
  const [value, setValue] = useSheetField<number | null | undefined>(path)
  const [draft, setDraft] = useState(format(value))
  const [lastValue, setLastValue] = useState(value)

  if (value !== lastValue) {
    setLastValue(value)
    if (parse(draft) !== (value ?? null)) setDraft(format(value))
  }

  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      value={draft}
      aria-invalid={parse(draft) === undefined}
      onChange={(event) => {
        setDraft(event.target.value)
        const number = parse(event.target.value)
        if (number !== undefined) setValue(number)
      }}
      onBlur={() => setDraft(format(value))}
    />
  )
}
