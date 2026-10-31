export type SheetUpdater = (data: unknown) => unknown

export type SheetContextValue = {
  /** Reads a value relative to the current scope. An empty path returns the whole scope. */
  get: (path: string) => unknown
  set: (path: string, value: unknown) => void
}
