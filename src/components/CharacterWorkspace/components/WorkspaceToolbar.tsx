import { useRef } from 'react';
import { Dropdown } from '@/components/Dropdown';
import { Icon } from '@/components/Icon';

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

/** Open and Save, used most, as buttons; everything else in a menu, which new actions can join. */
export function WorkspaceToolbar({ onOpen, onSave, onSaveAll, onExportPdf, exporting }: WorkspaceToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasMore = Boolean(onSaveAll || onExportPdf);

  return (
    <div className="character-workspace-toolbar">
      {exporting && (
        <span className="character-workspace-status" role="status">
          Making PDF…
        </span>
      )}
      <button type="button" className="character-workspace-action" onClick={() => inputRef.current?.click()}>
        <Icon name="folder_open" />
        Open…
      </button>
      <button type="button" className="character-workspace-action" onClick={onSave}>
        <Icon name="save" />
        Save
      </button>
      {hasMore && (
        <Dropdown icon="more_horiz" label="More actions" iconOnly buttonClassName="character-workspace-action">
          {(close) => (
            <ul>
              {onSaveAll && (
                <li>
                  <button type="button" className="dropdown-item" onClick={() => (close(), onSaveAll())}>
                    <Icon name="file_copy" />
                    Save all characters
                  </button>
                </li>
              )}
              {onExportPdf && (
                <li>
                  <button
                    type="button"
                    className="dropdown-item"
                    disabled={exporting}
                    onClick={() => (close(), onExportPdf())}
                  >
                    <Icon name="picture_as_pdf" />
                    Export PDF
                  </button>
                </li>
              )}
            </ul>
          )}
        </Dropdown>
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
