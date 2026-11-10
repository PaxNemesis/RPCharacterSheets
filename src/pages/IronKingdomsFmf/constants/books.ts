import type { BookId, IkSettings, SupplementId } from '../types';

export const SUPPLEMENTS: { id: SupplementId; title: string; short: string }[] = [
  { id: 'kng', title: 'Kings, Nations, and Gods', short: 'KNG' },
  { id: 'ua', title: 'Urban Adventure', short: 'UA' },
];

/** Core rules data is always on; a supplement's only when its setting is. */
export const bookEnabled = (settings: IkSettings, book: BookId | undefined) =>
  book === undefined || book === 'core' || settings.books?.[book] !== false;

/** "157" for the core rules, "KNG 90" for a supplement. */
export const bookRef = (book: BookId | undefined, page: number) => {
  const supplement = SUPPLEMENTS.find((entry) => entry.id === book);
  return supplement ? `${supplement.short} ${page}` : String(page);
};
