import { useRef } from 'react';

type WorkspaceToolbarProps = {
  onOpen: (files: File[]) => void;
  onSave: () => void;
  /** Missing while only one character is open. */
  onSaveAll?: () => void;
  /** Missing for systems without a PDF export. */
  onExportPdf?: () => void;
  /** A PDF is being made, which can take a moment the first time. */
  exporting?: boolean;
};

export function WorkspaceToolbar({ onOpen, onSave, onSaveAll, onExportPdf, exporting }: WorkspaceToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="character-workspace-toolbar">
      <button type="button" onClick={() => inputRef.current?.click()}>
        Open character…
      </button>
      <button type="button" onClick={onSave}>
        Save character
      </button>
      {onSaveAll && (
        <button type="button" onClick={onSaveAll}>
          Save all characters
        </button>
      )}
      {onExportPdf && (
        <button type="button" onClick={onExportPdf} disabled={exporting}>
          {exporting ? 'Making PDF…' : 'Export PDF'}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        multiple
        hidden
        onChange={(event) => {
          onOpen([...(event.target.files ?? [])]);
          event.target.value = '';
        }}
      />
    </div>
  );
}
