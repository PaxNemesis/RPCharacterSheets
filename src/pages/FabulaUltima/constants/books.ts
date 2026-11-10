import type { BookId, FuSettings, SupplementId } from '../types';

export const SUPPLEMENTS: { id: SupplementId; title: string; short: string }[] = [
  { id: 'high', title: 'High Fantasy Atlas', short: 'HF' },
  { id: 'natural', title: 'Natural Fantasy Atlas', short: 'NF' },
  { id: 'techno', title: 'Techno Fantasy Atlas', short: 'TF' },
  { id: 'low', title: 'Low Fantasy Atlas', short: 'LF' },
  { id: 'necromancer', title: 'Bonus class: Necromancer', short: 'Necromancer' },
  { id: 'aceOfCards', title: 'Bonus class: Ace of Cards', short: 'Ace of Cards' },
];

/** Core rules data is always on; a supplement's only when its setting is. */
export const bookEnabled = (settings: FuSettings, book: BookId | undefined) =>
  book === undefined || book === 'core' || settings.books?.[book] !== false;

/** "p. 186" for the core rules, "HF p. 136" for a supplement. */
export const bookRef = (book: BookId | undefined, page: number) => {
  const supplement = SUPPLEMENTS.find((entry) => entry.id === book);
  return supplement ? `${supplement.short} p. ${page}` : `p. ${page}`;
};
