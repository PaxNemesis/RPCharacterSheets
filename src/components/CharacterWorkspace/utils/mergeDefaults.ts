const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

/**
 * Fills in anything missing from `data` with the matching value from `defaults`, so files
 * saved before a field existed, or edited by hand, still load with every field present.
 * Values in `data` always win; arrays are taken as they are.
 */
export function mergeDefaults<T>(defaults: T, data: unknown): T {
  if (data === undefined) return defaults
  if (!isPlainObject(defaults) || !isPlainObject(data)) return data as T

  const merged: Record<string, unknown> = { ...data }
  for (const [key, value] of Object.entries(defaults)) {
    merged[key] = mergeDefaults(value, data[key])
  }
  return merged as T
}
