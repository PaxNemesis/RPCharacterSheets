import type { ListItems } from '@/components/CharacterWorkspace'

const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const fields = (value: unknown) => (isObject(value) ? Object.keys(value).sort() : typeof value)

/**
 * Checks a system's `listItems` against its `createCharacter`: every key must name a list (going
 * into lists through their own blank entry, so 'classes.skills' works while `classes` is empty),
 * and the entries a new character starts with must have the same fields as the blank entry.
 * Returns a description of each problem, so a failing test says what to fix.
 */
export function listItemProblems(character: unknown, items: ListItems): string[] {
  return Object.entries(items).flatMap(([path, template]) => {
    let current: unknown = character
    const walked: string[] = []
    for (const key of path.split('.')) {
      if (Array.isArray(current)) current = walked.join('.') in items ? items[walked.join('.')] : current[0]
      walked.push(key)
      current = isObject(current) ? current[key] : undefined
    }
    if (!Array.isArray(current)) return [`${path} is not a list in createCharacter`]
    return current
      .filter((entry) => JSON.stringify(fields(entry)) !== JSON.stringify(fields(template)))
      .map((entry) => `${path} starts with an entry whose fields differ from its blank entry: ${JSON.stringify(entry)}`)
  })
}
