import { useState } from 'react'
import type { FileCharacter, OpenCharacter, SheetSystem } from '../CharacterWorkspace.types'
import type { ConflictChoice } from '../components/ConflictDialog'
import { parseCharacterFile } from '../utils/characterFile'

// Far more than any character with a portrait; anything bigger isn't worth freezing the tab over.
const MAX_FILE_SIZE = 10 * 1024 * 1024

/** A character from a file whose id is already open in a tab. */
export type Clash<T> = FileCharacter<T> & { id: string; savedAt?: string }

type Store<T> = {
  characters: OpenCharacter<T>[]
  add: (data?: T, id?: string) => void
  update: (id: string, updater: (data: T) => T) => void
  select: (id: string) => void
}

/**
 * Opens character files. Characters that aren't open yet open straight away; those whose id is
 * already open wait in `clashes` for one answer, passed to `resolve`.
 */
export function useOpenCharacters<T>(system: SheetSystem<T>, { characters, add, update, select }: Store<T>) {
  const [errors, setErrors] = useState<string[]>([])
  const [clashes, setClashes] = useState<Clash<T>[]>([])
  const [opened, setOpened] = useState(0)

  const open = async (files: File[]) => {
    const problems: string[] = []
    const found: Clash<T>[] = []
    const openIds = new Set(characters.map((c) => c.id))
    let added = 0
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        problems.push(`${file.name} is larger than 10 MB, which is too big for a character file.`)
        continue
      }
      try {
        const { savedAt, characters: read } = parseCharacterFile(system, await file.text())
        for (const { id, data } of read) {
          if (id !== undefined && openIds.has(id)) {
            found.push({ id, data, savedAt })
          } else {
            add(data, id)
            added += 1
            if (id !== undefined) openIds.add(id)
          }
        }
      } catch (error) {
        problems.push(`${file.name} ${(error as Error).message}.`)
      }
    }
    setErrors(problems)
    setClashes(found)
    setOpened(added)
  }

  const resolve = (choice: ConflictChoice) => {
    for (const { id, data } of clashes) {
      if (choice === 'replace') update(id, () => data)
      if (choice === 'copy') add(data)
    }
    if (choice === 'replace') select(clashes[clashes.length - 1].id)
    setClashes([])
  }

  return { open, errors, clashes, opened, resolve }
}
