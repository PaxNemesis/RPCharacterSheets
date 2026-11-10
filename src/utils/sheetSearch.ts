export type SheetSearch = { panel?: string };

/** The search params a game page reads: `panel`, the sheet tab to show. Anything else is dropped. */
export const validateSheetSearch = (search: Record<string, unknown>): SheetSearch =>
  typeof search.panel === 'string' && search.panel !== '' ? { panel: search.panel } : {};
