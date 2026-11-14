import type { SheetSystem } from '@/components/CharacterWorkspace';
import { FuSheet } from '../components';
import type { FuCharacter } from '../types';
import { createCharacter } from './createCharacter';
import { normalizeCharacter } from './equip';
import { LIST_ITEMS } from './listItems';
import { migrate } from './migrate';

export const fabulaUltima: SheetSystem<FuCharacter> = {
  id: 'fabula-ultima',
  title: 'Fabula Ultima',
  version: 5,
  createCharacter,
  listItems: LIST_ITEMS,
  normalize: normalizeCharacter,
  migrate,
  getName: (character) => character.identity.name,
  setName: (character, name) => ({ ...character, identity: { ...character.identity, name } }),
  Sheet: FuSheet,
};
