import type { ListItems } from '../CharacterWorkspace.types';

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const isPrimitive = (value: unknown) => value === null || ['string', 'number', 'boolean'].includes(typeof value);

// A list entry is kept when it is the same kind of value as the template: an object for an object, and so on.
const sameKind = (template: unknown, value: unknown) =>
  isPlainObject(template)
    ? isPlainObject(value)
    : template === null
      ? isPrimitive(value)
      : typeof template === typeof value;

/**
 * Fills in anything missing from `data` with the matching value from `defaults`, so files
 * saved before a field existed, or edited by hand, still load with every field present.
 *
 * Values of the wrong type are replaced by the default, so a hand-edited or hostile file can't
 * crash the sheet: a string where `defaults` has one, a boolean for a boolean, and so on. A `null`
 * default (an empty number field) takes any number, string, boolean or null, and a number default
 * also takes null. Lists keep only entries of the right kind, each merged with `items[path]` or
 * else the default list's first entry; a list with neither is taken as it is.
 */
export function mergeDefaults<T>(defaults: T, data: unknown, items: ListItems = {}, path = ''): T {
  if (data === undefined) return defaults;

  if (Array.isArray(defaults)) {
    if (!Array.isArray(data)) return defaults;
    const template = path in items ? items[path] : defaults[0];
    if (template === undefined) return data as T;
    return data
      .filter((entry) => sameKind(template, entry))
      .map((entry) => mergeDefaults(template, entry, items, path)) as T;
  }

  if (isPlainObject(defaults)) {
    if (!isPlainObject(data)) return defaults;
    const merged: Record<string, unknown> = { ...data };
    for (const [key, value] of Object.entries(defaults)) {
      merged[key] = mergeDefaults(value, data[key], items, path ? `${path}.${key}` : key);
    }
    return merged as T;
  }

  if (defaults === null) return (isPrimitive(data) ? data : null) as T;
  // A number field can also have been cleared.
  if (typeof defaults === 'number' && data === null) return data as T;
  return (typeof data === typeof defaults ? data : defaults) as T;
}
