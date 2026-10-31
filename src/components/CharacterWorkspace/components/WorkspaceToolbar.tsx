import { useRef } from 'react'

type WorkspaceToolbarProps = {
  onNew: () => void
  onOpen: (files: File[]) => void
  onSave: () => void
}

export function WorkspaceToolbar({ onNew, onOpen, onSave }: WorkspaceToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="character-workspace-toolbar">
      <button type="button" onClick={onNew}>
        New character
      </button>
      <button type="button" onClick={() => inputRef.current?.click()}>
        Open JSON…
      </button>
      <button type="button" onClick={onSave}>
        Save JSON
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
