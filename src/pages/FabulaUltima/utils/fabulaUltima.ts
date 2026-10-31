import type { SheetSystem } from '@/components/CharacterWorkspace'
import { FuSheet } from '../components'
import type { FuCharacter } from '../types'
import { createCharacter } from './createCharacter'

export const fabulaUltima: SheetSystem<FuCharacter> = {
  id: 'fabula-ultima',
  title: 'Fabula Ultima',
  version: 1,
  createCharacter,
  getName: (character) => character.identity.name,
  Sheet: FuSheet,
}
