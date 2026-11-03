import { useRef } from 'react'

type WorkspaceToolbarProps = {
  onOpen: (files: File[]) => void
  onSave: () => void
}

export function WorkspaceToolbar({ onOpen, onSave }: WorkspaceToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="character-workspace-toolbar">
      <button type="button" onClick={() => inputRef.current?.click()}>
        Open character…
      </button>
      <button type="button" onClick={onSave}>
        Save character
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
