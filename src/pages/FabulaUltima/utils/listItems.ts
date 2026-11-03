import type { ListItems } from '@/components/CharacterWorkspace'
import { createBond, createClass, createItem } from './createCharacter'

/** Blank entries for each list, so entries loaded from a file or the browser can be checked and completed. */
export const LIST_ITEMS: ListItems = {
  bonds: createBond(),
  classes: createClass(),
  'classes.skills': { name: '', level: null, notes: '' },
  heroicSkills: { name: '', source: '', notes: '' },
  backpack: { name: '', quantity: null, notes: '' },
  stored: createItem(),
  spells: { name: '', offensive: '', mp: '', targets: '', duration: '', page: '', notes: '' },
  arcana: { name: '', notes: '' },
  'floralist.discovered': '',
  'gourmet.ingredients': { name: '', taste: '', quantity: 1 },
}
