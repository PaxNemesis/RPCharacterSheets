import type { SheetSystem } from '@/components/CharacterWorkspace';
import { IkSheet } from '../components';
import type { IkCharacter } from '../types';
import { createCharacter } from './createCharacter';
import { LIST_ITEMS } from './listItems';
import { migrate } from './migrate';

export const ironKingdomsFmf: SheetSystem<IkCharacter> = {
  id: 'iron-kingdoms-fmf',
  title: 'Iron Kingdoms: Full Metal Fantasy',
  version: 5,
  createCharacter,
  listItems: LIST_ITEMS,
  migrate,
  getName: (character) => character.identity.name,
  setName: (character, name) => ({ ...character, identity: { ...character.identity, name } }),
  // The PDF code and its library load only when someone exports.
  exportPdf: async (character) => (await import('./pdf/exportPdf')).exportPdf(character),
  Sheet: IkSheet,
};
