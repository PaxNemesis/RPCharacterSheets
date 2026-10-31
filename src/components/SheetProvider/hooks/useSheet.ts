import { createContext, useCallback, useContext } from 'react'
import type { SheetContextValue } from '../SheetProvider.types'

export const SheetContext = createContext<SheetContextValue | undefined>(undefined)

export const useSheet = () => {
  const context = useContext(SheetContext)
  if (!context) {
    throw new Error('useSheet must be used within a SheetProvider')
  }
  return context
}

export const useOptionalSheet = () => useContext(SheetContext)

/** Reads and writes one value of the sheet, relative to the current scope. */
export const useSheetField = <T>(path: string) => {
  const { get, set } = useSheet()
  const setValue = useCallback((value: T) => set(path, value), [set, path])
  return [get(path) as T, setValue] as const
}
