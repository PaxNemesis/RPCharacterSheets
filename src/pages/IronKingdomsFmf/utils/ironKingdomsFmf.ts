import type { SheetSystem } from '@/components/CharacterWorkspace'
import { IkSheet } from '../components'
import type { IkCharacter } from '../IronKingdomsFmf.types'
import { createCharacter } from './createCharacter'

export const ironKingdomsFmf: SheetSystem<IkCharacter> = {
  id: 'iron-kingdoms-fmf',
  title: 'Iron Kingdoms: Full Metal Fantasy',
  version: 1,
  createCharacter,
  getName: (character) => character.identity.name,
  Sheet: IkSheet,
}
