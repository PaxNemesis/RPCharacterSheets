import type { SheetSystem } from '../CharacterWorkspace.types';

/** A separate copy of a character, named "<name> (copy)" when it has a name and the system can rename. */
export function copyCharacter<T>(system: SheetSystem<T>, data: T): T {
  const copy = structuredClone(data);
  const name = system.getName(data).trim();
  return name && system.setName ? system.setName(copy, `${name} (copy)`) : copy;
}
