import { DAMAGE_TYPES } from './attributes';

export type SymbolChoice = 'element' | 'status' | 'action' | 'species';

/** The Symbolist's symbols and their pages; `choice` is what is picked when one is created (HF pp. 149–151). */
export const SYMBOLS: { name: string; page: number; choice?: SymbolChoice }[] = [
  { name: 'Symbol of Binding', page: 149 },
  { name: 'Symbol of Creation', page: 149 },
  { name: 'Symbol of Despair', page: 149 },
  { name: 'Symbol of Destiny', page: 149 },
  { name: 'Symbol of Elements', page: 149, choice: 'element' },
  { name: 'Symbol of Enmity', page: 149 },
  { name: 'Symbol of Flux', page: 150, choice: 'status' },
  { name: 'Symbol of Forbiddance', page: 150, choice: 'action' },
  { name: 'Symbol of Growth', page: 150 },
  { name: 'Symbol of Metamorphosis', page: 150, choice: 'species' },
  { name: 'Symbol of Prosperity', page: 150 },
  { name: 'Symbol of Protection', page: 150, choice: 'element' },
  { name: 'Symbol of Rebellion', page: 151 },
  { name: 'Symbol of Rebirth', page: 151 },
  { name: 'Symbol of Revenge', page: 151 },
  { name: 'Symbol of Sacrifice', page: 151 },
  { name: 'Symbol of Sorcery', page: 151 },
  { name: 'Symbol of Truth', page: 151 },
  { name: 'Symbol of Weakness', page: 151, choice: 'element' },
];

/** What each kind of choice is picked from. */
export const SYMBOL_CHOICES: Record<SymbolChoice, { label: string; options: string[] }> = {
  element: { label: 'damage type', options: DAMAGE_TYPES.filter((type) => type !== 'physical') },
  status: { label: 'status effect', options: ['dazed', 'shaken', 'slow', 'weak'] },
  action: { label: 'action', options: ['Attack', 'Guard', 'Objective', 'Spell', 'Skill'] },
  species: { label: 'Species', options: ['beast', 'construct', 'demon', 'elemental', 'monster', 'plant', 'undead'] },
};

/** Inventory Points to create a symbol with Symbolism (HF p. 147). */
export const SYMBOL_IP = 2;
