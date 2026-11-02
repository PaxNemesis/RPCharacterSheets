import type { SheetSystem } from '@/components/CharacterWorkspace'
import { FuSheet } from '../components'
import type { FuCharacter } from '../types'
import { createCharacter } from './createCharacter'
import { migrate } from './migrate'

export const fabulaUltima: SheetSystem<FuCharacter> = {
  id: 'fabula-ultima',
  title: 'Fabula Ultima',
  version: 2,
  createCharacter,
  migrate,
  getName: (character) => character.identity.name,
  Sheet: FuSheet,
}
