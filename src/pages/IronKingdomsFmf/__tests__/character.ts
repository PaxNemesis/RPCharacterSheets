import type { IkCharacter, StatKey } from '../types'
import { createCharacter } from '../utils/createCharacter'

type Overrides = Partial<Omit<IkCharacter, 'identity' | 'settings'>> & {
  identity?: Partial<IkCharacter['identity']>
  settings?: Partial<IkCharacter['settings']>
}

/** A fresh character with some fields replaced, for tests; `identity` and `settings` are merged. */
export const character = ({ identity, settings, ...overrides }: Overrides = {}): IkCharacter => {
  const base = createCharacter()
  return {
    ...base,
    ...overrides,
    identity: { ...base.identity, ...identity },
    settings: { ...base.settings, ...settings },
  }
}

/** The stats block with these values filled in and every other stat left blank. */
export const statsWith = (values: Partial<Record<StatKey, number>>): IkCharacter['stats'] => {
  const { stats } = createCharacter()
  for (const [key, value] of Object.entries(values)) stats[key as StatKey] = { value, max: null }
  return stats
}
