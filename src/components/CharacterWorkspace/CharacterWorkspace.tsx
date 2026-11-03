import { useCallback, useState } from 'react'
import { SheetProvider, type SheetUpdater } from '@/components/SheetProvider'
import { Tabs } from '@/components/Tabs'
import type { SheetSystem } from './CharacterWorkspace.types'
import { SheetErrorBoundary, StorageNotice, WorkspaceToolbar } from './components'
import { useCharacterStore } from './hooks/useCharacterStore'
import { downloadCharacterFile, parseCharacterFile } from './utils/characterFile'
import './CharacterWorkspace.styles.css'

// Far more than any character with a portrait; anything bigger isn't worth freezing the tab over.
const MAX_FILE_SIZE = 10 * 1024 * 1024

type CharacterWorkspaceProps<T> = {
  system: SheetSystem<T>
}

export function CharacterWorkspace<T>({ system }: CharacterWorkspaceProps<T>) {
  const { characters, active, add, update, remove, reset, select, loaded, storageFailed } = useCharacterStore(system)
  const [errors, setErrors] = useState<string[]>([])
  const nameOf = (data: T) => system.getName(data).trim() || 'Unnamed character'

  const activeId = active.id
  const onChange = useCallback(
    (updater: SheetUpdater) => update(activeId, updater as (data: T) => T),
    [update, activeId],
  )

  const open = async (files: File[]) => {
    const problems: string[] = []
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        problems.push(`${file.name} is larger than 10 MB, which is too big for a character file.`)
        continue
      }
      try {
        add(parseCharacterFile(system, await file.text()))
      } catch (error) {
        problems.push(`${file.name} ${(error as Error).message}.`)
      }
    }
    setErrors(problems)
  }

  const close = (id: string) => {
    const character = characters.find((c) => c.id === id)
    if (!character) return
    const name = nameOf(character.data)
    const message = `Close ${name}?\n\nIt will be removed from this browser. Save it as JSON first if you want to keep it.`
    if (window.confirm(message)) remove(id)
  }

  const confirmReset = () => {
    const name = nameOf(active.data)
    const message = `Reset ${name}?\n\nEverything on this sheet will be cleared, including the portrait and settings. This can't be undone. Save it as JSON first if you want to keep a copy.`
    if (window.confirm(message)) reset(active.id)
  }

  if (!loaded) {
    return (
      <div className="character-workspace-container">
        <h1>{system.title}</h1>
        <p className="character-workspace-loading">Loading characters…</p>
      </div>
    )
  }

  return (
    <div className="character-workspace-container">
      <header className="character-workspace-header">
        <h1>{system.title}</h1>
        <WorkspaceToolbar
          onOpen={open}
          onSave={() => downloadCharacterFile(system, active.data)}
          onReset={confirmReset}
        />
      </header>
      <StorageNotice />
      {storageFailed && (
        <p className="character-workspace-alert" role="alert">
          This browser couldn&apos;t store your characters, possibly because storage is full or blocked. Use Save
          JSON to keep your changes.
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
        onClose={close}
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
          onSave={() => downloadCharacterFile(system, active.data)}
          onClose={() => close(active.id)}
        >
          <SheetProvider data={active.data} onChange={onChange}>
            <system.Sheet />
          </SheetProvider>
        </SheetErrorBoundary>
      </div>
    </div>
  )
}
