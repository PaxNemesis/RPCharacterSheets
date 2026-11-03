import type { SheetSystem } from '@/components/CharacterWorkspace'
import { IkSheet } from '../components'
import type { IkCharacter } from '../types'
import { createCharacter } from './createCharacter'
import { LIST_ITEMS } from './listItems'
import { migrate } from './migrate'

export const ironKingdomsFmf: SheetSystem<IkCharacter> = {
  id: 'iron-kingdoms-fmf',
  title: 'Iron Kingdoms: Full Metal Fantasy',
  version: 3,
  createCharacter,
  listItems: LIST_ITEMS,
  migrate,
  getName: (character) => character.identity.name,
  Sheet: IkSheet,
}
