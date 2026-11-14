import { useCallback, useState } from 'react';
import { SheetProvider, type SheetUpdater } from '@/components/SheetProvider';
import { Tabs } from '@/components/Tabs';
import type { SheetSystem, WorkspaceLocation } from './CharacterWorkspace.types';
import { CharacterTabMenu, ConflictDialog, SheetErrorBoundary, StorageNotice, WorkspaceToolbar } from './components';
import { useCharacterStore } from './hooks/useCharacterStore';
import { useLocationSync } from './hooks/useLocationSync';
import { useOpenCharacters } from './hooks/useOpenCharacters';
import { usePdfExport } from './hooks/usePdfExport';
import { copyCharacter } from './utils/copyCharacter';
import { downloadAllCharacters, downloadCharacterFile } from './utils/characterFile';
import './CharacterWorkspace.styles.css';

type CharacterWorkspaceProps<T> = {
  system: SheetSystem<T>;
  /** The character and panel named in the URL; without it, they are only kept while the page is open. */
  location?: WorkspaceLocation;
};

export function CharacterWorkspace<T>({ system, location }: CharacterWorkspaceProps<T>) {
  const { characters, active, add, update, remove, select, loaded, storageFailed } = useCharacterStore(system);
  useLocationSync(location, { loaded, characters, active, select });
  const [localPanel, setLocalPanel] = useState<string>();
  const panel = location ? location.panel : localPanel;
  const showPanel = location ? location.showPanel : setLocalPanel;
  const { exportPdf, exporting, exportFailed } = usePdfExport(system, active);
  const { open, errors, clashes, opened, resolve } = useOpenCharacters(system, { characters, add, update, select });
  const nameOf = (data: T) => system.getName(data).trim() || 'Unnamed character';

  const activeId = active.id;
  const { normalize } = system;
  const onChange = useCallback(
    (updater: SheetUpdater) =>
      update(activeId, (data) => {
        const next = (updater as (data: T) => T)(data);
        return normalize ? normalize(next) : next;
      }),
    [update, activeId, normalize],
  );

  const close = (id: string) => {
    const character = characters.find((c) => c.id === id);
    if (!character) return;
    const name = nameOf(character.data);
    const message = `Close ${name}?\n\nIt will be removed from this browser. Use Save first if you want to keep it.`;
    if (window.confirm(message)) remove(id);
  };

  const duplicate = (id: string) => {
    const character = characters.find((c) => c.id === id);
    if (character) add(copyCharacter(system, character.data));
  };

  if (!loaded) {
    return (
      <div className="character-workspace-container">
        <h1>{system.title}</h1>
        <p className="character-workspace-loading">Loading characters…</p>
      </div>
    );
  }

  return (
    <div className="character-workspace-container">
      <header className="character-workspace-header">
        <h1>{system.title}</h1>
        <WorkspaceToolbar
          onOpen={open}
          onSave={() => downloadCharacterFile(system, active)}
          onSaveAll={characters.length > 1 ? () => downloadAllCharacters(system, characters) : undefined}
          onExportPdf={system.exportPdf ? exportPdf : undefined}
          exporting={exporting}
        />
      </header>
      <StorageNotice />
      {storageFailed && (
        <p className="character-workspace-alert" role="alert">
          This browser couldn&apos;t store your characters, possibly because storage is full or blocked. Use Save to
          keep your changes.
        </p>
      )}
      {exportFailed && (
        <p className="character-workspace-alert" role="alert">
          Couldn&apos;t make the PDF. Try again, or use Save to keep a copy.
        </p>
      )}
      {errors.map((error) => (
        <p key={error} className="character-workspace-alert" role="alert">
          Couldn&apos;t open {error}
        </p>
      ))}
      <Tabs
        label="Open characters"
        items={characters.map((c) => ({ id: c.id, label: nameOf(c.data) }))}
        activeId={active.id}
        onSelect={select}
        renderMenu={(item, closeMenu) => (
          <CharacterTabMenu
            onDuplicate={() => (closeMenu(), duplicate(item.id))}
            onClose={() => (closeMenu(), close(item.id))}
          />
        )}
        trailing={
          <button
            type="button"
            className="character-workspace-add"
            aria-label="New character"
            title="New character"
            onClick={() => add()}
          >
            +
          </button>
        }
      />
      <div className="character-workspace-sheet">
        <SheetErrorBoundary
          key={active.id}
          name={nameOf(active.data)}
          onSave={() => downloadCharacterFile(system, active)}
          onClose={() => close(active.id)}
        >
          <SheetProvider data={active.data} onChange={onChange}>
            <system.Sheet panel={panel} onPanelChange={showPanel} />
          </SheetProvider>
        </SheetErrorBoundary>
      </div>
      {clashes.length > 0 && (
        <ConflictDialog
          items={clashes.map((clash, index) => {
            const tab = characters.find((c) => c.id === clash.id);
            const name = nameOf(clash.data);
            return {
              key: `${clash.id}-${index}`,
              name,
              openName: tab ? nameOf(tab.data) : name,
              savedAt: clash.savedAt,
            };
          })}
          opened={opened}
          onChoose={resolve}
        />
      )}
    </div>
  );
}
