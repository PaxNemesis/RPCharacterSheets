type Data = Record<string, unknown>;
type Row = Record<string, unknown>;
const text = (value: unknown) => (typeof value === 'string' ? value : '');

// A page reference the sheet used to write at the start of notes: "Rifle, p. 261. Mod –2 (one hand)" for a
// weapon, "p. 307. Reach" for a steamjack weapon, "KNG 364" for armor.
const NOTES_PAGE = /^(?:([^,.]+), )?(?:p\. (\d+)|((?:KNG|UA) \d+))(?:\. ([\s\S]*))?$/;

/** The row with a page reference at the start of its notes moved into its page, if it has none yet. */
function pageFromNotes(row: unknown): unknown {
  if (!row || typeof row !== 'object') return row;
  const entry = row as Row;
  const match = text(entry.page).trim() ? null : NOTES_PAGE.exec(text(entry.notes).trim());
  if (!match) return row;
  const [, skill, corePage, supplementPage, rest] = match;
  return { ...entry, page: corePage ?? supplementPage, notes: [skill, rest].filter(Boolean).join('. ') };
}

const rowsWithPages = (rows: unknown) => (Array.isArray(rows) ? rows.map(pageFromNotes) : rows);

/** Version 5 gave weapons and armor a page of their own, which the notes used to hold. */
export function toVersion5(character: Data): Data {
  const steamjacks = Array.isArray(character.steamjacks)
    ? character.steamjacks.map((jack: unknown) =>
        jack && typeof jack === 'object'
          ? {
              ...(jack as Row),
              rangedWeapons: rowsWithPages((jack as Row).rangedWeapons),
              meleeWeapons: rowsWithPages((jack as Row).meleeWeapons),
            }
          : jack,
      )
    : character.steamjacks;
  return {
    ...character,
    rangedWeapons: rowsWithPages(character.rangedWeapons),
    meleeWeapons: rowsWithPages(character.meleeWeapons),
    armor: rowsWithPages(character.armor),
    stored: rowsWithPages(character.stored),
    steamjacks,
  };
}
