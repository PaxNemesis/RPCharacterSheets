import { useMemo, type ReactNode } from 'react'
import { SheetContext, useOptionalSheet } from './hooks/useSheet'
import type { SheetContextValue, SheetUpdater } from './SheetProvider.types'
import { getPath, joinPath, setPath } from './utils/path'

type SheetProviderProps =
  | {
      /** Root mode: the character data the fields read and write. */
      data: unknown
      onChange: (update: SheetUpdater) => void
      path?: never
      children: ReactNode
    }
  | {
      /** Scope mode: narrows an enclosing SheetProvider to a sub-path, e.g. `skills.3`. */
      path: string
      data?: never
      onChange?: never
      children: ReactNode
    }

export function SheetProvider({ data, onChange, path, children }: SheetProviderProps) {
  const parent = useOptionalSheet()

  const value = useMemo<SheetContextValue>(() => {
    if (path === undefined) {
      return {
        get: (p) => getPath(data, p),
        set: (p, v) => onChange?.((current) => setPath(current, p, v)),
      }
    }
    if (!parent) {
      throw new Error('A scoped SheetProvider must be inside another SheetProvider')
    }
    return {
      get: (p) => parent.get(joinPath(path, p)),
      set: (p, v) => parent.set(joinPath(path, p), v),
    }
  }, [data, onChange, path, parent])

  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>
}
