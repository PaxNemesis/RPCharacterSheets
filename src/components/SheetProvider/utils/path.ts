type Container = Record<string, unknown> | unknown[]

export function joinPath(...parts: string[]) {
  return parts.filter(Boolean).join('.')
}

export function getPath(source: unknown, path: string): unknown {
  if (!path) return source
  return path.split('.').reduce<unknown>(
    (current, key) =>
      current !== null && typeof current === 'object'
        ? (current as Record<string, unknown>)[key]
        : undefined,
    source,
  )
}

// Returns a copy of `source` with `value` at `path`, copying only the objects along the path.
export function setPath(source: unknown, path: string, value: unknown): unknown {
  if (!path) return value
  const [key, ...rest] = path.split('.')
  const current: Container =
    source !== null && typeof source === 'object' ? (source as Container) : {}

  if (Array.isArray(current)) {
    const copy = [...current]
    copy[Number(key)] = setPath(current[Number(key)], rest.join('.'), value)
    return copy
  }
  return { ...current, [key]: setPath(current[key], rest.join('.'), value) }
}
