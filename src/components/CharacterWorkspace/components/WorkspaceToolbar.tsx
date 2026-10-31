import { useRef } from 'react'

type WorkspaceToolbarProps = {
  onOpen: (files: File[]) => void
  onSave: () => void
  onReset: () => void
}

export function WorkspaceToolbar({ onOpen, onSave, onReset }: WorkspaceToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="character-workspace-toolbar">
      <button type="button" onClick={() => inputRef.current?.click()}>
        Open JSON…
      </button>
      <button type="button" onClick={onSave}>
        Save JSON
      </button>
      <button type="button" className="character-workspace-danger" onClick={onReset}>
        Reset sheet…
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        multiple
        hidden
        onChange={(event) => {
          onOpen([...(event.target.files ?? [])])
          event.target.value = ''
        }}
      />
    </div>
  )
}
